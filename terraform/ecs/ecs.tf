module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  version = "~> 4.0"

  name = "${var.resource_prefix}-vpc"
  cidr = "10.0.0.0/16"

  enable_dns_hostnames = true
  enable_dns_support   = true

  azs            = ["ap-southeast-1a", "ap-southeast-1b", "ap-southeast-1c"]
  public_subnets = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
}

module "lb_sg" {
  source = "terraform-aws-modules/security-group/aws"

  version = "~> 4.0"

  name        = "${var.resource_prefix}-lb-sg"
  description = "Security group for load balancer within VPC"
  vpc_id      = module.vpc.vpc_id

  egress_rules = ["all-all"]

  egress_cidr_blocks = ["0.0.0.0/0"]

  ingress_rules = ["https-443-tcp", "http-80-tcp"]

  ingress_cidr_blocks = ["0.0.0.0/0"]

}

module "web_server_sg" {
  source = "terraform-aws-modules/security-group/aws"

  version = "~> 4.0"

  name        = "${var.resource_prefix}-web-sg"
  description = "Security group for web-server with HTTP ports open within VPC"
  vpc_id      = module.vpc.vpc_id

  egress_rules = ["all-all"]

  egress_cidr_blocks = ["0.0.0.0/0"]

  ingress_with_source_security_group_id = [{
    rule                     = "http-80-tcp"
    source_security_group_id = module.lb_sg.security_group_id
  }]
}

module "alb" {
  source  = "terraform-aws-modules/alb/aws"
  version = "~> 8.0"

  load_balancer_type = "application"

  name            = "${var.resource_prefix}-alb"
  vpc_id          = module.vpc.vpc_id
  security_groups = [module.lb_sg.security_group_id]
  subnets         = module.vpc.public_subnets

  target_groups = [
    {
      target_type      = "ip"
      backend_port     = 4000
      backend_protocol = "HTTP"

      health_check = {
        enabled             = true
        path                = "/"
        port                = 4000
        healthy_threshold   = 3
        unhealthy_threshold = 3
        timeout             = 6
        interval            = 30
      }

    }
  ]
  https_listeners = [
    {
      port               = 443
      protocol           = "HTTPS"
      certificate_arn    = module.acm.acm_certificate_arn
      target_group_index = 0
    }
  ]

  http_tcp_listeners = [
    {
      port               = 80
      protocol           = "HTTP"
      target_group_index = 0
    }
  ]
}

module "acm" {
  source  = "terraform-aws-modules/acm/aws"
  version = "~> 4.0"

  domain_name = "tw-clone.tfdevs.com"
  zone_id     = var.zone_id

  validation_method = "DNS"

  wait_for_validation = true
}

resource "aws_cloudwatch_log_group" "cloudwatch" {
  name = "${var.resource_prefix}-cloudwatch"
}

resource "aws_ecs_cluster" "cluster" {
  name = "${var.resource_prefix}-cluster"
}


resource "aws_ecs_task_definition" "definition" {
  family                   = var.resource_prefix
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_execution_role.arn
  network_mode             = "awsvpc"
  cpu                      = 256
  memory                   = 512
  depends_on               = [aws_cloudwatch_log_group.cloudwatch]
  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name      = "${var.resource_prefix}-container"
      image     = "tfdevskh/tw-clone-tfd:v1"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = var.container_port
          hostPort      = 4000
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          awslogs-region        = "ap-southeast-1"
          awslogs-group         = aws_cloudwatch_log_group.cloudwatch.name
          awslogs-stream-prefix = "app"
        }
      }
      environmentFiles = [
        {
          value = "arn:aws:s3:::tfd-tw-clone-env/config/.env"
          type  = "s3"
        }
      ]
    },
  ])
}

resource "aws_ecs_service" "web_service" {
  name            = "${var.resource_prefix}-web_service"
  launch_type     = "FARGATE"
  desired_count   = 2
  cluster         = aws_ecs_cluster.cluster.arn
  task_definition = aws_ecs_task_definition.definition.arn
  network_configuration {
    security_groups  = [module.web_server_sg.security_group_id]
    subnets          = module.vpc.public_subnets
    assign_public_ip = true
  }
  load_balancer {
    target_group_arn = module.alb.target_group_arns[0]
    container_name   = "${var.resource_prefix}-container"
    container_port   = var.container_port
  }
}

resource "aws_route53_record" "www" {
  zone_id = var.zone_id
  name    = "tw-clone.tfdevs.com"
  type    = "A"
  alias {
    name                   = module.alb.lb_dns_name
    zone_id                = module.alb.lb_zone_id
    evaluate_target_health = true
  }
}

// Execution Role

resource "aws_iam_role" "ecs_execution_role" {
  name               = "ecs_execution_role"
  assume_role_policy = data.aws_iam_policy_document.ecs_assume_role_policy.json
}

resource "aws_iam_role_policy" "ecs_execution_policy" {
  role   = aws_iam_role.ecs_execution_role.name
  policy = data.aws_iam_policy_document.s3_read_access.json
}

resource "aws_iam_policy" "s3_policy" {
  name   = "${var.resource_prefix}-s3-policy"
  policy = "${data.aws_iam_policy_document.s3_read_access.json}"
}

resource "aws_iam_role_policy_attachment" "ecs_role_s3_data_bucket_policy_attach" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = aws_iam_policy.s3_policy.arn
}
data "mongodbatlas_roles_org_id" "tfd_data" {
}

data "aws_iam_policy_document" "s3_read_access" {
  statement {
    sid    = ""
    effect = "Allow"
    actions = [
      "s3:ListBucket"
    ]
    resources = [
      "arn:aws:s3:::${aws_s3_bucket.env_bucket.bucket}"
    ]
  }
  statement {
    sid    = ""
    effect = "Allow"
    actions = [
      "s3:DeleteObject",
      "s3:GetObject",
      "s3:PutObject",
      "s3:PutObjectAcl"
    ]
    resources = [
      "arn:aws:s3:::${aws_s3_bucket.env_bucket.bucket}/*"
    ]
  }
}

data "aws_iam_policy_document" "ecs_assume_role_policy" {
  statement {
    sid    = ""
    effect = "Allow"
    actions = [
      "sts:AssumeRole",
    ]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}
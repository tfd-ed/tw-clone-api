resource "mongodbatlas_project" "tw_clone" {
  name   = "tw-clone-tfd"
  org_id = data.mongodbatlas_roles_org_id.tfd_data.org_id
}

resource "mongodbatlas_cluster" "tw_clone" {
  name                        = "tw-clone0cluster"
  project_id                  = mongodbatlas_project.tw_clone.id
  provider_name               = "TENANT"
  backing_provider_name       = "AWS"
  mongo_db_major_version      = "7.0"
  num_shards                  = 1
  cluster_type                = "REPLICASET"
  provider_instance_size_name = "M0"
  provider_region_name        = "AP_SOUTHEAST_1"
}

resource "random_password" "password" {
  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}


resource "mongodbatlas_database_user" "tfd_user" {
  username           = "tfd"
  password           = random_password.password.result
  project_id         = mongodbatlas_cluster.tw_clone.project_id
  auth_database_name = "admin"
  roles {
    role_name     = "readWrite"
    database_name = "admin"
  }
}

resource "mongodbatlas_project_ip_access_list" "ecs_access" {
  project_id = mongodbatlas_cluster.tw_clone.project_id
  cidr_block = module.vpc.vpc_cidr_block
}
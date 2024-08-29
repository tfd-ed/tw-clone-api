resource "aws_s3_bucket" "env_bucket" {
  bucket = "tfd-tw-clone-env"
}

resource "aws_s3_object" "env_file" {
  bucket  = aws_s3_bucket.env_bucket.bucket
  key     = "config/.env"
  content = <<EOF
  MONGO_URI=${mongodbatlas_cluster.tw_clone.connection_strings[0].standard}
  MONGO_USER=${mongodbatlas_database_user.tfd_user.username}
  MONGO_PASSWORD=${mongodbatlas_database_user.tfd_user.password}
  EOF
}
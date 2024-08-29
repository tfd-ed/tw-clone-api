output "standard" {
  value = mongodbatlas_cluster.tw_clone.connection_strings[0].standard
}
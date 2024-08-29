# Declare the mongo_private_key variable
variable "mongo_private_key" {
  description = "MongoDB Atlas Private API Key"
  type        = string
}

variable "mongo_public_key" {
  description = "MongoDB Atlas Public API Key"
  type        = string
}

variable "resource_prefix" {
  default = "tfd-tw-clone"
}

variable "zone_id" {
  default = "Z07968202SOE4I3RYAJ3F"
}

variable "container_port" {
  default = 4000
}

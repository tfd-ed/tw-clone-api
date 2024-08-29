terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "1.18.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.6.2"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "ap-southeast-1"
}

provider "mongodbatlas" {
  public_key  = var.mongo_public_key
  private_key = var.mongo_private_key
}


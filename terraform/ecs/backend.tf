terraform {
  backend "s3" {
    bucket = "tfd-tw-clone"
    key    = "tf"
    region = "ap-southeast-1"
  }
}
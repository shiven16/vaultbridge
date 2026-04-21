terraform {
  required_version = ">= 1.1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Values for these variables are supplied via environment variables in GitHub Actions 
# (TF_VAR_subnet_id and TF_VAR_security_group_id)
variable "subnet_id" {
  description = "The subnets to deploy the ECS service into"
  type        = string
}

variable "security_group_id" {
  description = "Security group for the ECS tasks (should allow inbound port 80)"
  type        = string
}

# Fetch caller identity to dynamically retrieve the account ID
data "aws_caller_identity" "current" {}

# ECR Repository referenced by `.github/workflows/deploy.yml`
resource "aws_ecr_repository" "app_repo" {
  name                 = "devops-static-app"
  image_tag_mutability = "MUTABLE"
  # force_delete is useful for lab environments, allows terraform destroy to work even if images exist
  force_delete         = true
}

# ECS Cluster
resource "aws_ecs_cluster" "app_cluster" {
  name = "devops-static-app-cluster"
}

# ECS Task Definition describing the container spec
resource "aws_ecs_task_definition" "app_task" {
  family                   = "devops-static-app-task"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  
  # Ensure you are using the standard LabRole provided by AWS Academy.
  # AWS Academy typically restricts IAM role creation.
  execution_role_arn       = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
  task_role_arn            = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"

  container_definitions = jsonencode([
    {
      name      = "devops-static-app"
      # Points to the 'latest' image deployed via github actions
      image     = "${aws_ecr_repository.app_repo.repository_url}:latest"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ]
    }
  ])
}

# ECS Service to run the standard Fargate task
resource "aws_ecs_service" "app_service" {
  name            = "devops-static-app-service"
  cluster         = aws_ecs_cluster.app_cluster.id
  task_definition = aws_ecs_task_definition.app_task.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = [var.subnet_id]
    security_groups  = [var.security_group_id]
    # Required for Fargate tasks pulling from ECR without NAT Gateways (typical for public subnets)
    assign_public_ip = true 
  }
}

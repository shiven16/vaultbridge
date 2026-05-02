resource "aws_secretsmanager_secret" "app_secrets" {
  name = "${var.project_name}-secrets"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "app_secrets_version" {
  secret_id = aws_secretsmanager_secret.app_secrets.id
  secret_string = jsonencode({
    DATABASE_URL         = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.postgres.endpoint}/vaultbridge?schema=public"
    JWT_SECRET           = var.jwt_secret
    GOOGLE_CLIENT_SECRET = var.google_client_secret
    ENCRYPTION_KEY       = var.encryption_key
  })
}

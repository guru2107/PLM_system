"""
Configuration file for PLM system
Use environment variables to override defaults
"""
import os
from datetime import timedelta

# Database Configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:Jainam051205%40@localhost:5432/plm_db"
)

# Database Pool Configuration
DB_POOL_SIZE = int(os.getenv("DB_POOL_SIZE", 5))
DB_MAX_OVERFLOW = int(os.getenv("DB_MAX_OVERFLOW", 10))
DB_POOL_TIMEOUT = int(os.getenv("DB_POOL_TIMEOUT", 30))
DB_POOL_RECYCLE = int(os.getenv("DB_POOL_RECYCLE", 3600))
DB_ECHO = os.getenv("DB_ECHO", "True").lower() == "true"

# Application Configuration
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
API_V1_PREFIX = "/api/v1"

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# CORS Configuration
CORS_ORIGINS = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = ["*"]
CORS_ALLOW_HEADERS = ["*"]

# Logging
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FILE = os.getenv("LOG_FILE", "logs/plm.log")

# Pagination
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

# File Upload
MAX_FILE_SIZE_MB = 100  # Maximum file size in MB
ALLOWED_FILE_TYPES = {
    "image": ["jpg", "jpeg", "png", "gif"],
    "document": ["pdf", "doc", "docx", "xls", "xlsx"],
    "archive": ["zip", "rar", "7z"],
}

# Email Configuration (if needed)
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@plmsystem.com")

# Audit Configuration
ENABLE_AUDIT_LOGGING = os.getenv("ENABLE_AUDIT_LOGGING", "True").lower() == "true"
AUDIT_RETENTION_DAYS = int(os.getenv("AUDIT_RETENTION_DAYS", 365))

# ECO Configuration
ECO_AUTO_ARCHIVE_DAYS = int(os.getenv("ECO_AUTO_ARCHIVE_DAYS", 90))
REQUIRE_ECO_APPROVAL = os.getenv("REQUIRE_ECO_APPROVAL", "True").lower() == "true"

# API Rate Limiting
RATE_LIMIT_ENABLED = os.getenv("RATE_LIMIT_ENABLED", "False").lower() == "true"
RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", 100))
RATE_LIMIT_PERIOD_SECONDS = int(os.getenv("RATE_LIMIT_PERIOD_SECONDS", 60))

from pydantic_settings import BaseSettings
from pydantic import model_validator
from typing import Optional

class Settings(BaseSettings):
    DB_HOST: Optional[str] = None
    DB_PORT: Optional[int] = None
    DB_USER: Optional[str] = None
    DB_PASS: Optional[str] = None
    DB_NAME: Optional[str] = None
    DB_SSL_MODE: Optional[str] = "prefer"
    
    HOST: str = "0.0.0.0"
    PORT: int = 3000

    DATABASE_URL: Optional[str] = None
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    @model_validator(mode="after")
    def assemble_db_connection(self) -> "Settings":
        if not self.DATABASE_URL and self.DB_HOST:
            import urllib.parse
            encoded_pass = urllib.parse.quote_plus(self.DB_PASS) if self.DB_PASS else ""
            ssl_param = f"?sslmode={self.DB_SSL_MODE}" if self.DB_SSL_MODE else ""
            self.DATABASE_URL = f"postgresql://{self.DB_USER}:{encoded_pass}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}{ssl_param}"
        return self

    class Config:
        env_file = ".env"

settings = Settings()

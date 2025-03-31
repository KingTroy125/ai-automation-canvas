from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()

class SecurityConfig:
    SECRET_KEY = os.getenv("SECRET_KEY") or os.urandom(32)
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    REFRESH_TOKEN_EXPIRE_DAYS = 7
    ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
    RATE_LIMIT_REQUESTS = 100
    RATE_LIMIT_PERIOD = 3600  # 1 hour
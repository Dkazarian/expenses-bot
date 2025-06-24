import os
from dotenv import load_dotenv

load_dotenv()

def get(key):
    value = os.getenv(key)
    if value is None:
        raise ValueError(f"Environment variable {key} is not set")
    return value
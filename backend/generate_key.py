import secrets

# Generate a 32-byte random secret key
secret_key = secrets.token_hex(32)
print(f"Generated SECRET_KEY: {secret_key}")
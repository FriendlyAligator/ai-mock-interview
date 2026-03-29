from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from jose import JWTError, jwt
from app.database import SessionLocal
from app import models
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login")

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 600

pwd_context = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")


# Password Hashing
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Create JWT Token
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)):
    
    if False:
        print("TOKEN RECEIVED:")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        
        if False:
            print("PAYLOAD:")

        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except JWTError as e:
        if False:
            print("JWT ERROR:")
        raise HTTPException(status_code=401, detail="Invalid token")

    db = SessionLocal()

    user = db.query(models.User).filter(models.User.email == email).first()

    db.close()

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user

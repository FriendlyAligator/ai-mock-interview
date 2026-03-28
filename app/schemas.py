from pydantic import BaseModel, EmailStr
from datetime import datetime


# -------- User Schemas --------

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True


# -------- Token Schema --------

class Token(BaseModel):
    access_token: str
    token_type: str

class InterviewStart(BaseModel):
    role: str

class InterviewAnswer(BaseModel):
    answer: str

class AnswerSubmit(BaseModel):
    interview_id: int
    question_number: int
    answer: str

class AnswerResponse(BaseModel):
    score: int
    feedback: str

class AnswerRequest(BaseModel):
    interview_id: int
    question: str
    answer: str
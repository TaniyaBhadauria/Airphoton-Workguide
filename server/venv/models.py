from pydantic import BaseModel, EmailStr
from typing import List, Optional

class InstructionMedia(BaseModel):
    media_path: str

class Instruction(BaseModel):
    title: str
    content: str
    media: List[InstructionMedia]

# User Table
class User(BaseModel):
    id: Optional[int] = None
    username: str
    password: str
    role: str
    email: EmailStr
    profilepic: Optional[bytes] = None

# Products Table
class Product(BaseModel):
    id: Optional[int] = None
    item_code: str
    item_name: str
    bom_code: str
    cover_image: str

# Tools Table
class Tool(BaseModel):
    id: Optional[int] = None
    product_id: int
    tool_name: str
    tool_image: str


# Feedback Table
class Feedback(BaseModel):
    id: Optional[int] = None
    feedback_type: str
    comment: str
    file_upload: Optional[bytes] = None
    experience_rating: Optional[int] = None
    additional_comments: Optional[str] = None
    status: Optional[str] = None
    created_at: Optional[str] = None  # Using string to handle timestamps easily
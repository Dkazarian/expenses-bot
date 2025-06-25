from pydantic import BaseModel, Field
from enum import Enum

class Category(str, Enum):
    housing = "Housing"
    transportation = "Transportation"
    food = "Food"
    utilities = "Utilities"
    insurance = "Insurance"
    medical = "Medical/Healthcare"
    savings = "Savings"
    debt = "Debt"
    education = "Education"
    entertainment = "Entertainment"
    other = "Other"

class Expense(BaseModel):
    """
    Recorded expense.
    """
    category: Category = Field(..., description="Category of the expense", example="Food")
    description: str = Field(..., description="Name of the object/service paid", example="Pizza")
    amount: float = Field(..., description="Amount of the expense", example=20.0)

class Message(BaseModel):
    """
    A message that contains the expense to be recorded. 
    """
    telegramId: int = Field(..., description="Telegram username", example="user_123")
    message: str = Field(..., max_length=1000, description="Content of the message", example="Hello world!")
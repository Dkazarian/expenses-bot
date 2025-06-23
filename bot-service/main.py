from fastapi import Body, Depends, FastAPI, Header, HTTPException
from typing import Annotated, Optional
from dotenv import load_dotenv
from pydantic import BaseModel, Field
import os

load_dotenv()
API_KEY = os.getenv("BOT_SERVICE_API_KEY")
if not API_KEY:
    raise ValueError("Missing BOT_SERVICE_API_KEY in environment")

app = FastAPI()

def verify_api_key(
    x_api_key: Annotated[str, Header(..., description="API key for authentication")]
) -> str:
    if x_api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return x_api_key

class Message(BaseModel):
    """
    A message that contains the expense to be recorded. 
    """
    userId: int = Field(..., description="Telegram username", example="user_123")
    message: str = Field(..., max_length=1000, description="Content of the message", example="Hello world!")

class Expense(BaseModel):
    """
    Recorded expense.
    """
    category: str = Field(..., description="Category of the expense", example="Food")
    description: str = Field(..., description="Description of the expense", example="Pizza")
    amount: float = Field(..., description="Amount of the expense", example=20.0)

@app.post(
    "/expenses", 
    dependencies=[Depends(verify_api_key)],
    response_model=Optional[Expense],
    responses={
        200: {
            "description": "Successful response",
            "content": {
                "application/json": {
                    "examples": {
                        "expense_found": {
                            "summary": "Expense found in message",
                            "value": {
                                "category": "Food",
                                "description": "Pizza",
                                "amount": 20.0
                            }
                        },
                        "no_expense": {
                            "summary": "No expense found",
                            "value": "null"
                        }
                    }
                }
            }
        }
    }
)
async def expenses(message: Annotated[Message, Body()]) -> Optional[Expense]:
    print(f"Received message from user {message.userId}: {message.message}")
    """
    Searches for an expense in the message. If found it returns it and returns its category.
    """
    if "pizza" in message.message.lower():
        return Expense(
            category="Food",
            description="Pizza",
            amount=20.0
        )
    return None
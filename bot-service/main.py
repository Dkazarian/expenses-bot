import config
from fastapi import Body, Depends, FastAPI, Header, HTTPException
from typing import Annotated, Optional
from schema import Expense, Message
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from database.models import UserModel as User
from helpers import contains_numbers_and_words
from ia import extract_expense

app = FastAPI()

def verify_api_key(
    x_api_key: Annotated[str, Header(..., description="API key for authentication")]
) -> str:
    if x_api_key != config.get("API_KEY"):
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return x_api_key

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

async def expenses(message: Annotated[Message, Body()], db: AsyncSession = Depends(get_db(config.get("DATABASE_URL")))) -> Optional[Expense]:
    """
    Searches for an expense in the message. If found it returns it and returns its category.
    """
    print(f"Received message from user {message.telegramId}: {message.message}")
    user = await User.get_by_telegram_id(db, message.telegramId)
    
    if not user:
        raise HTTPException(status_code=403, detail="User not found")
    
    text = message.message
    if (contains_numbers_and_words(text)):
        expense_data = extract_expense(text)
        if (expense_data):
            await user.add_expense(db, expense_data.dict())
            return expense_data
    return None
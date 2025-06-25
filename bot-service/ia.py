from typing import Optional
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from schema import Expense
import config

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,
    api_key=config.get("OPENAI_API_KEY"),
)

def extract_expense(message: str) -> Optional[Expense]:
    structured_llm = llm.bind_tools(
        [Expense],
        strict=True,
        tool_choice="Expense"
    )

    messages = [
        (
            "system",
            "You are expense recording assistant. If you detect an expense (description and cost), extract it using the provided tool. Otherwise return null.\n\n"
            "The expense fields are:\n"
            "- description: a brief text describing the expense (e.g., 'pizza', 'Uber ride')\n"
            "- amount: a number representing the cost or amount spent (e.g., 20, 15.5).\n"
            "- category: one of the predefined categories: Housing, Transportation, Food, Utilities, Insurance, Medical/Healthcare, Savings, Debt, Education, Entertainment, or Other."
        ),
        ("human", message),
    ]


    try:
        result = structured_llm.invoke(message)
        if not result.tool_calls:
            return None
        expense_data = result.tool_calls[0]['args']
        if (expense_data["amount"] > 0):
            return Expense(**expense_data)
        return None
    except Exception as e:
        print(e)
        return None
# Expenses bot

This repository contains the services required for running a telegram bot powered by **ChatGPT 4o-mini** that classifies and records user expenses.

## Connector service
This service acts as a middleware between Telegram and the Bot Service. 

**Instructions:** https://github.com/Dkazarian/expenses-bot/blob/main/connector-service/README.md

## Bot service
This service handles the message from an authorized user to ChatGPT and, if an expense was extracted, it stores it in a database and informs its category.

**Categories:** 

*Housing, Transportation, Food, Utilities, Insurance, Medical/Healthcare, Savings, 
Debt, Education, Entertainment, and Other.*

**Instructions:** https://github.com/Dkazarian/expenses-bot/blob/main/bot-service/README.md


## Example:

**User message:**
> Pizza 20 bucks 

**Response:**
> Food expense added ✅

**Database entry:**
| id | user_id | description | amount  | category | added_at                     |
|----|---------|-------------|---------|----------|------------------------------|
| 4  | 1       | Pizza       | $20.00  | Food     | 2025-06-25 16:05:13.92559    |


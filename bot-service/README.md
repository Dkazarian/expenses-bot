# Bot Service

Python service developed with FastAPI that extracts expenses information from messages using ChatGPT and stores them in a PostgresSQL database.

Why FastAPI? it requires minimal setup, handles concurrent requests, and automatically generates Swagger documentation.

## Setup
### Requirements
1. Python 3.11+
2. Packages:
    ```
    fastapi[standard]
    uvicorn[standard]
    sqlalchemy>=2.0
    asyncpg
    python-dotenv
    pydantic>=2.0
    langchain_openai
    ```
3. PostgresSQL database
   
### Setup
1. Install the lastest version of Python (https://www.python.org/downloads)
2. Create and start a virtual env:
   ```
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. Install the depencencies using the `requirements.txt` file.
   ```
   pip install -r requirements.txt
   ```
4. Setup the environment variables. This can be done by setting them manually in the console.
    ```
    export API_KEY="value-of-your-choice"
    export OPENAI_API_KEY="key-provided-by-open-ai-or-me"
    export DATABASE_URL="postgres-connection-url"
    ```
   Or by creating a `.env` file inside the folder.
    ```
    API_KEY="value-of-your-choice"
    OPENAI_API_KEY="key-provided-by-open-ai-or-me"
    DATABASE_URL="postgres-connection-url"
    ```
    **Example of connection url:**
    ```
    postgresql+asyncpg://username:password@host:port/database
    ```

    (The `+asyncpg` is necessary for this to work.)
5. Get your Telegram Id by messaging the bot *@userinfobot* or follow this link https://t.me/userinfobot and press Start or send `\start`.
   
6. Setup the database, either by creating the tables manually or running the `create-and-seed-tables.py` script.

    ```
    python create-and-seed-tables.py
    ```
    This will create the tables and add the Telegram Ids in `users.txt` to the authorized users table.

    #### Manual creation
    ```
    CREATE TABLE users ( 
        "id" SERIAL PRIMARY KEY, 
        "telegram_id" text UNIQUE NOT NULL 
    ); 
    CREATE TABLE expenses ( 
        "id" SERIAL PRIMARY KEY, 
        "user_id" integer NOT NULL REFERENCES users("id"), 
        "description" text NOT NULL, 
        "amount" money NOT NULL, 
        "category" text NOT NULL, 
        "added_at" timestamp NOT NULL 
    );
    ```

7. Run the server   

    ```
    uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
    ```
    *(This values can be changed)*
8. You should see this
    ```
    INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
    INFO:     Started parent process [6466]
    INFO:     Started server process [6468]
    INFO:     Waiting for application startup.
    INFO:     Application startup complete.
    ```
9.  That's it, your service is up!

## Documentation

You can access the API documentation at `http://127.0.0.1:8000/docs` (or the host:port you set up). 

By pressing "Try it out" you can test requests without having to use the telegram bot. Enter the **API_KEY** you have in your env var in the field **x-api-key** 

## Example

**User message:**
```
{
  "telegramId": 12345678,
  "message": "Pizza 20 bucks"
}
```

**Response:**
```
{
  "category": "Food",
  "description": "Pizza",
  "amount": 20
}
```

**Database entry:**
| id | user_id | description | amount  | category | added_at                     |
|----|---------|-------------|---------|----------|------------------------------|
| 4  | 1       | Pizza       | $20.00  | Food     | 2025-06-25 16:05:13.92559    |
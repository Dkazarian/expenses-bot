# Connector Service

NodeJS server that receives messages sent to a telegram bot and sends them to the Bot Service to identify and record expenses.

## Setup
### Requirements
- Node LTS (currently v22.16.0)
- Telegram bot token: https://core.telegram.org/bots/features#creating-a-new-bot
   
### Setup
1. Install Node https://nodejs.org/en/download
2. Install packages
    ```
    npm install
    ```
3. (Optional) Run tests
    ```
    npm test
    ```
4. Setup the environment variables. This can be done by setting them manually in the console.
    ```
    export BOT_TOKEN="token-provided-by-bot-father"
    export BOT_SERVICE_URL="your-bot-service-url"
    export BOT_SERVICE_API_KEY="your-bot-service-api-key"
    ```
   Or by creating a `.env` file inside the folder.
    ```
    BOT_TOKEN="token-provided-by-bot-father"
    BOT_SERVICE_URL="your-bot-service-url"
    BOT_SERVICE_API_KEY="your-bot-service-api-key"
    ``` 
   Example:
    ```
    BOT_TOKEN="123456789:abcdefghijklmnopqrstuvwxyz"
    BOT_SERVICE_URL="http://127.0.0.1:8000"
    BOT_SERVICE_API_KEY="1234567890"
    ``` 
5. Run the service.
    ```
    npm start
    ```
    You should see this:
    ```
    > expenses_bot@1.0.0 start
    > tsc && node dist/app.js

    Bot started
    ```
6. You can now start sending messages to the telegram bot.

## Example
**User message:**
> Pizza 20 bucks 

**Response:**
> Food expense added ✅
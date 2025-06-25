import asyncio
import config
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from database.models import Base, UserModel as User

engine = create_async_engine(config.get('DATABASE_URL'), echo=True, future=True)
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def reset_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

async def seed_data():
    async with AsyncSessionLocal() as db:
        with open("users.txt", "r") as f:
            for line in f:
                telegram_id = line.strip()
                if telegram_id:
                    user = await User.create(db, telegram_id=telegram_id)
                    print(f"Created user: {user.telegram_id}")

async def main():
    await reset_tables()
    await seed_data()

if __name__ == "__main__":
    asyncio.run(main())

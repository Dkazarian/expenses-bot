from sqlalchemy import Column, Integer, Text, TIMESTAMP, ForeignKey, select
from sqlalchemy.sql import text
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.dialects.postgresql import MONEY
from sqlalchemy.ext.asyncio import AsyncSession

Base = declarative_base()

class UserModel(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    telegram_id = Column(Text, unique=True, nullable=False)

    @classmethod
    async def create(cls, db: AsyncSession, telegram_id: str) -> "UserModel":
        user = cls(telegram_id=str(telegram_id))
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

    @classmethod
    async def get_by_telegram_id(cls, db: AsyncSession, telegram_id: str) -> "UserModel | None":
        result = await db.execute(select(cls).where(cls.telegram_id == str(telegram_id)))
        user = result.scalars().first()
        return user

    async def add_expense(self, db: AsyncSession, data: dict):
        data['amount'] = f"{data['amount']:.2f}"
        expense = ExpenseModel(user_id=self.id, **data)
        db.add(expense)
        await db.commit()
        await db.refresh(expense)
        return expense

class ExpenseModel(Base):
    __tablename__ = "expenses"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    description = Column(Text, nullable=False)
    amount = Column(MONEY, nullable=False)
    category = Column(Text, nullable=False)
    added_at = Column(TIMESTAMP(timezone=True), server_default=text('now()'))
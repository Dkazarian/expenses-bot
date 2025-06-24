from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

def get_db(url):
    async def _get_db()-> AsyncSession:
        async_engine = create_async_engine(url, echo=True, future=True)

        AsyncSessionLocal = sessionmaker(
            bind=async_engine,
            expire_on_commit=False,
            class_=AsyncSession,
        )
        async with AsyncSessionLocal() as session:
            yield session
    return _get_db
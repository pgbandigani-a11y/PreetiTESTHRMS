from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "hrms_lite"

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()

# Global database client and db reference
client: AsyncIOMotorClient = None
db = None


async def connect_db():
    """Initialize database connection"""
    global client, db
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.database_name]
    
    # Create indexes for employees collection
    await db.employees.create_index("employee_id", unique=True)
    await db.employees.create_index("email", unique=True)
    
    # Create compound index for attendance (one record per employee per day)
    await db.attendance.create_index([("employee_id", 1), ("date", 1)], unique=True)
    
    print("✅ Connected to MongoDB and created indexes")


async def close_db():
    """Close database connection"""
    global client
    if client:
        client.close()
        print("👋 Database connection closed")


def get_db():
    """Get database reference"""
    return db

from pydantic import BaseModel, EmailStr, field_validator, ConfigDict
from typing import List
from datetime import datetime


class EmployeeCreate(BaseModel):
    """Schema for creating a new employee"""
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

    @field_validator('employee_id')
    @classmethod
    def validate_employee_id(cls, v):
        if not v or len(v) > 20:
            raise ValueError('Employee ID must be 1-20 characters')
        return v

    @field_validator('full_name')
    @classmethod
    def validate_full_name(cls, v):
        if not v or len(v) > 100:
            raise ValueError('Full name must be 1-100 characters')
        return v

    @field_validator('department')
    @classmethod
    def validate_department(cls, v):
        if not v or len(v) > 50:
            raise ValueError('Department must be 1-50 characters')
        return v

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "employee_id": "EMP001",
                "full_name": "John Doe",
                "email": "john.doe@example.com",
                "department": "Engineering"
            }
        }
    )


class EmployeeResponse(BaseModel):
    """Schema for employee response"""
    id: str
    employee_id: str
    full_name: str
    email: str
    department: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class EmployeeListResponse(BaseModel):
    """Schema for list of employees response"""
    employees: List[EmployeeResponse]
    total: int

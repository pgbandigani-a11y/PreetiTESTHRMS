from fastapi import APIRouter, HTTPException, status
from config.database import get_db
from schemas.employee import EmployeeCreate, EmployeeResponse, EmployeeListResponse
from datetime import datetime
from bson import ObjectId
from pymongo.errors import DuplicateKeyError

router = APIRouter(prefix="/api/employees", tags=["Employees"])


@router.post(
    "",
    response_model=EmployeeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new employee",
    responses={
        409: {"description": "Employee with this ID or email already exists"}
    }
)
async def create_employee(employee_data: EmployeeCreate):
    """
    Create a new employee with the following information:
    - **employee_id**: Unique identifier for the employee
    - **full_name**: Full name of the employee
    - **email**: Valid email address (must be unique)
    - **department**: Department name
    """
    db = get_db()
    
    try:
        employee_doc = {
            "employee_id": employee_data.employee_id,
            "full_name": employee_data.full_name,
            "email": employee_data.email,
            "department": employee_data.department,
            "created_at": datetime.utcnow()
        }
        
        result = await db.employees.insert_one(employee_doc)
        employee_doc["_id"] = result.inserted_id
        
        return EmployeeResponse(
            id=str(employee_doc["_id"]),
            employee_id=employee_doc["employee_id"],
            full_name=employee_doc["full_name"],
            email=employee_doc["email"],
            department=employee_doc["department"],
            created_at=employee_doc["created_at"]
        )
    except DuplicateKeyError as e:
        error_message = str(e)
        if "employee_id" in error_message:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Employee with ID '{employee_data.employee_id}' already exists"
            )
        elif "email" in error_message:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Employee with email '{employee_data.email}' already exists"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Employee with this ID or email already exists"
            )


@router.get(
    "",
    response_model=EmployeeListResponse,
    summary="Get all employees"
)
async def get_all_employees():
    """Retrieve a list of all employees"""
    db = get_db()
    
    cursor = db.employees.find()
    employees = await cursor.to_list(length=1000)
    
    return EmployeeListResponse(
        employees=[
            EmployeeResponse(
                id=str(emp["_id"]),
                employee_id=emp["employee_id"],
                full_name=emp["full_name"],
                email=emp["email"],
                department=emp["department"],
                created_at=emp["created_at"]
            )
            for emp in employees
        ],
        total=len(employees)
    )


@router.get(
    "/{employee_id}",
    response_model=EmployeeResponse,
    summary="Get employee by ID",
    responses={
        404: {"description": "Employee not found"}
    }
)
async def get_employee(employee_id: str):
    """Retrieve a specific employee by their employee ID"""
    db = get_db()
    
    employee = await db.employees.find_one({"employee_id": employee_id})
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    return EmployeeResponse(
        id=str(employee["_id"]),
        employee_id=employee["employee_id"],
        full_name=employee["full_name"],
        email=employee["email"],
        department=employee["department"],
        created_at=employee["created_at"]
    )


@router.delete(
    "/{employee_id}",
    status_code=status.HTTP_200_OK,
    summary="Delete an employee",
    responses={
        404: {"description": "Employee not found"}
    }
)
async def delete_employee(employee_id: str):
    """Delete an employee by their employee ID"""
    db = get_db()
    
    result = await db.employees.delete_one({"employee_id": employee_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    # Also delete related attendance records
    await db.attendance.delete_many({"employee_id": employee_id})
    
    return {"message": f"Employee '{employee_id}' deleted successfully"}

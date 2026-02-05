from fastapi import APIRouter, HTTPException, status, Query
from config.database import get_db
from schemas.attendance import AttendanceCreate, AttendanceResponse, AttendanceListResponse
from datetime import date, datetime
from typing import Optional
from pymongo.errors import DuplicateKeyError

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])


@router.post(
    "",
    response_model=AttendanceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Mark attendance for an employee",
    responses={
        404: {"description": "Employee not found"},
        409: {"description": "Attendance already marked for this date"}
    }
)
async def mark_attendance(attendance_data: AttendanceCreate):
    """
    Mark attendance for an employee:
    - **employee_id**: The employee's unique identifier
    - **date**: Date for attendance (YYYY-MM-DD format)
    - **status**: Either 'Present' or 'Absent'
    """
    db = get_db()
    
    # Find employee by employee_id
    employee = await db.employees.find_one({"employee_id": attendance_data.employee_id})
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{attendance_data.employee_id}' not found"
        )
    
    try:
        attendance_doc = {
            "employee_id": attendance_data.employee_id,
            "employee_name": employee["full_name"],
            "date": attendance_data.date.isoformat(),
            "status": attendance_data.status,
            "created_at": datetime.utcnow()
        }
        
        result = await db.attendance.insert_one(attendance_doc)
        attendance_doc["_id"] = result.inserted_id
        
        return AttendanceResponse(
            id=str(attendance_doc["_id"]),
            employee_id=attendance_doc["employee_id"],
            employee_name=attendance_doc["employee_name"],
            date=attendance_data.date,
            status=attendance_doc["status"]
        )
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Attendance already marked for employee '{attendance_data.employee_id}' on {attendance_data.date}"
        )


@router.get(
    "",
    response_model=AttendanceListResponse,
    summary="Get all attendance records"
)
async def get_all_attendance(
    date_filter: Optional[date] = Query(None, description="Filter by date (YYYY-MM-DD)")
):
    """
    Retrieve all attendance records with optional date filter
    """
    db = get_db()
    
    query = {}
    if date_filter:
        query["date"] = date_filter.isoformat()
    
    cursor = db.attendance.find(query)
    records = await cursor.to_list(length=1000)
    
    return AttendanceListResponse(
        records=[
            AttendanceResponse(
                id=str(record["_id"]),
                employee_id=record["employee_id"],
                employee_name=record["employee_name"],
                date=date.fromisoformat(record["date"]),
                status=record["status"]
            )
            for record in records
        ],
        total=len(records)
    )


@router.get(
    "/{employee_id}",
    response_model=AttendanceListResponse,
    summary="Get attendance records for an employee",
    responses={
        404: {"description": "Employee not found"}
    }
)
async def get_employee_attendance(employee_id: str):
    """
    Retrieve all attendance records for a specific employee
    """
    db = get_db()
    
    # Find employee
    employee = await db.employees.find_one({"employee_id": employee_id})
    
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    # Get attendance records for this employee
    cursor = db.attendance.find({"employee_id": employee_id})
    records = await cursor.to_list(length=1000)
    
    return AttendanceListResponse(
        records=[
            AttendanceResponse(
                id=str(record["_id"]),
                employee_id=record["employee_id"],
                employee_name=record["employee_name"],
                date=date.fromisoformat(record["date"]),
                status=record["status"]
            )
            for record in records
        ],
        total=len(records)
    )

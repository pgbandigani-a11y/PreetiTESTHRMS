const API_BASE_URL = 'https://hrms-lx48.onrender.com/api';

// Employee API calls
export const employeeAPI = {
    // Get all employees
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/employees`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to fetch employees');
        }
        return response.json();
    },

    // Get single employee
    getById: async (employeeId) => {
        const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Employee not found');
        }
        return response.json();
    },

    // Create new employee
    create: async (employeeData) => {
        const response = await fetch(`${API_BASE_URL}/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employeeData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to create employee');
        }
        return response.json();
    },

    // Delete employee
    delete: async (employeeId) => {
        const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to delete employee');
        }
        return response.json();
    },
};

// Attendance API calls
export const attendanceAPI = {
    // Mark attendance
    mark: async (attendanceData) => {
        const response = await fetch(`${API_BASE_URL}/attendance`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(attendanceData),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to mark attendance');
        }
        return response.json();
    },

    // Get all attendance
    getAll: async (dateFilter = null) => {
        const url = dateFilter
            ? `${API_BASE_URL}/attendance?date_filter=${dateFilter}`
            : `${API_BASE_URL}/attendance`;
        const response = await fetch(url);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to fetch attendance');
        }
        return response.json();
    },

    // Get attendance by employee
    getByEmployee: async (employeeId) => {
        const response = await fetch(`${API_BASE_URL}/attendance/${employeeId}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to fetch attendance');
        }
        return response.json();
    },
};

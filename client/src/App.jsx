import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import AddEmployeeModal from './components/AddEmployeeModal';
import MarkAttendanceModal from './components/MarkAttendanceModal';
import ViewAttendanceModal from './components/ViewAttendanceModal';
import { employeeAPI, attendanceAPI } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showMarkAttendance, setShowMarkAttendance] = useState(false);
  const [viewAttendanceEmployee, setViewAttendanceEmployee] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empRes, attRes] = await Promise.all([
        employeeAPI.getAll(),
        attendanceAPI.getAll(),
      ]);
      setEmployees(empRes.employees || []);
      setAttendance(attRes.records || []);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard employees={employees} attendance={attendance} />;
      case 'employees':
        return (
          <Employees
            employees={employees}
            attendance={attendance}
            loading={loading}
            onRefresh={fetchData}
            onAddClick={() => setShowAddEmployee(true)}
            onViewAttendance={(emp) => setViewAttendanceEmployee(emp)}
          />
        );
      case 'attendance':
        return (
          <Attendance
            attendance={attendance}
            loading={loading}
            onMarkClick={() => setShowMarkAttendance(true)}
          />
        );
      default:
        return <Dashboard employees={employees} attendance={attendance} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {renderPage()}
      </main>

      {/* Modals */}
      <AddEmployeeModal
        isOpen={showAddEmployee}
        onClose={() => setShowAddEmployee(false)}
        onSuccess={fetchData}
      />
      <MarkAttendanceModal
        isOpen={showMarkAttendance}
        onClose={() => setShowMarkAttendance(false)}
        onSuccess={fetchData}
        employees={employees}
      />
      <ViewAttendanceModal
        isOpen={!!viewAttendanceEmployee}
        onClose={() => setViewAttendanceEmployee(null)}
        employee={viewAttendanceEmployee}
      />
    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { attendanceAPI } from '../services/api';

export default function ViewAttendanceModal({ isOpen, onClose, employee }) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && employee) {
            fetchAttendance();
        }
    }, [isOpen, employee]);

    const fetchAttendance = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await attendanceAPI.getByEmployee(employee.employee_id);
            setRecords(data.records || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !employee) return null;

    const presentDays = records.filter(r => r.status === 'Present').length;
    const absentDays = records.filter(r => r.status === 'Absent').length;
    const attendanceRate = records.length > 0
        ? Math.round((presentDays / records.length) * 100)
        : 0;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {employee.full_name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{employee.full_name}</h2>
                            <p className="text-indigo-200">{employee.employee_id} • {employee.department}</p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-100">
                    <div className="text-center p-4 bg-emerald-50 rounded-xl">
                        <p className="text-3xl font-bold text-emerald-600">{presentDays}</p>
                        <p className="text-sm text-emerald-700">Present Days</p>
                    </div>
                    <div className="text-center p-4 bg-rose-50 rounded-xl">
                        <p className="text-3xl font-bold text-rose-600">{absentDays}</p>
                        <p className="text-sm text-rose-700">Absent Days</p>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 rounded-xl">
                        <p className="text-3xl font-bold text-indigo-600">{attendanceRate}%</p>
                        <p className="text-sm text-indigo-700">Attendance Rate</p>
                    </div>
                </div>

                {/* Records List */}
                <div className="flex-1 overflow-auto p-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        Attendance History
                    </h3>

                    {loading ? (
                        <div className="flex items-center justify-center py-10">
                            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    ) : records.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p>No attendance records found</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {records
                                .sort((a, b) => new Date(b.date) - new Date(a.date))
                                .map((record) => (
                                    <div
                                        key={record.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {new Date(record.date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${record.status === 'Present'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-rose-100 text-rose-700'
                                            }`}>
                                            <span className={`w-2 h-2 rounded-full ${record.status === 'Present' ? 'bg-emerald-500' : 'bg-rose-500'
                                                }`}></span>
                                            {record.status}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

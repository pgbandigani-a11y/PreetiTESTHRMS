import { useState } from 'react';

export default function Attendance({ attendance, loading, onMarkClick }) {
    const [dateFilter, setDateFilter] = useState('');

    // Filter attendance by date
    const filteredAttendance = dateFilter
        ? attendance.filter(a => a.date === dateFilter)
        : attendance;

    // Group attendance by date
    const groupedByDate = filteredAttendance.reduce((acc, record) => {
        const date = record.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(record);
        return acc;
    }, {});

    const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));

    // Get unique dates for filter dropdown
    const uniqueDates = [...new Set(attendance.map(a => a.date))].sort((a, b) => new Date(b) - new Date(a));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
                    <p className="text-gray-500">Track and manage daily attendance records</p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Date Filter */}
                    <div className="relative">
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white appearance-none cursor-pointer"
                        >
                            <option value="">All Dates</option>
                            {uniqueDates.map(date => (
                                <option key={date} value={date}>
                                    {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </option>
                            ))}
                        </select>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>

                    {/* Mark Attendance Button */}
                    <button
                        onClick={onMarkClick}
                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all font-medium flex items-center gap-2 shadow-lg shadow-emerald-500/30"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Mark Attendance
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            {filteredAttendance.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{filteredAttendance.length}</p>
                            <p className="text-sm text-gray-500">Total Records</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{filteredAttendance.filter(a => a.status === 'Present').length}</p>
                            <p className="text-sm text-gray-500">Present</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{filteredAttendance.filter(a => a.status === 'Absent').length}</p>
                            <p className="text-sm text-gray-500">Absent</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full"></div>
                </div>
            ) : filteredAttendance.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {dateFilter ? 'No records for this date' : 'No attendance records'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                        {dateFilter ? 'Try selecting a different date' : 'Start tracking attendance for your employees'}
                    </p>
                    {!dateFilter && (
                        <button
                            onClick={onMarkClick}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Mark Attendance
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    {sortedDates.map((date) => (
                        <div key={date} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Date Header */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {new Date(date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-sm text-gray-500">{groupedByDate[date].length} records</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                                            {groupedByDate[date].filter(r => r.status === 'Present').length} Present
                                        </span>
                                        <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-medium">
                                            {groupedByDate[date].filter(r => r.status === 'Absent').length} Absent
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Records */}
                            <div className="divide-y divide-gray-50">
                                {groupedByDate[date].map((record) => (
                                    <div key={record.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                                                {record.employee_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{record.employee_name}</p>
                                                <p className="text-sm text-gray-500">{record.employee_id}</p>
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

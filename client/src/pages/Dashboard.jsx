export default function Dashboard({ employees, attendance }) {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date === todayStr);
    const presentToday = todayAttendance.filter(a => a.status === 'Present').length;
    const absentToday = todayAttendance.filter(a => a.status === 'Absent').length;

    // Get unique departments
    const departments = [...new Set(employees.map(e => e.department))];
    const deptStats = departments.map(dept => ({
        name: dept,
        count: employees.filter(e => e.department === dept).length,
    }));

    // Calculate attendance stats per employee
    const employeeStats = employees.map(emp => {
        const empAttendance = attendance.filter(a => a.employee_id === emp.employee_id);
        const present = empAttendance.filter(a => a.status === 'Present').length;
        const absent = empAttendance.filter(a => a.status === 'Absent').length;
        const total = present + absent;
        const rate = total > 0 ? Math.round((present / total) * 100) : 0;
        return { ...emp, present, absent, total, rate };
    }).sort((a, b) => b.rate - a.rate);

    const stats = [
        {
            label: 'Total Employees',
            value: employees.length,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            bgColor: 'bg-indigo-50',
            textColor: 'text-indigo-600',
        },
        {
            label: 'Present Today',
            value: presentToday,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-600',
        },
        {
            label: 'Absent Today',
            value: absentToday,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bgColor: 'bg-rose-50',
            textColor: 'text-rose-600',
        },
        {
            label: 'Total Records',
            value: attendance.length,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-600',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Welcome back! Here's your HR overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            </div>
                            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.textColor}`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Department Distribution */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h2>
                    {deptStats.length > 0 ? (
                        <div className="space-y-3">
                            {deptStats.map((dept, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                                            <span className="text-sm text-gray-500">{dept.count} employees</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                                                style={{ width: `${(dept.count / employees.length) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No employees yet</p>
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Attendance</h2>
                    {attendance.length > 0 ? (
                        <div className="space-y-3">
                            {attendance
                                .sort((a, b) => new Date(b.date) - new Date(a.date))
                                .slice(0, 5)
                                .map((record, index) => (
                                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                                {record.employee_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{record.employee_name}</p>
                                                <p className="text-sm text-gray-500">{record.date}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${record.status === 'Present'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-rose-100 text-rose-700'
                                            }`}>
                                            {record.status}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No attendance records yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Employee Attendance Summary Table */}
            {employeeStats.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Employee Attendance Summary</h2>
                        <p className="text-sm text-gray-500">Overview of attendance performance per employee</p>
                    </div>
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Present</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Absent</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Days</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {employeeStats.map((emp) => (
                                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                {emp.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{emp.full_name}</p>
                                                <p className="text-xs text-gray-500">{emp.department}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-700 rounded-lg font-semibold text-sm">
                                            {emp.present}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center w-8 h-8 bg-rose-100 text-rose-700 rounded-lg font-semibold text-sm">
                                            {emp.absent}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-gray-600 font-medium">
                                        {emp.total}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${emp.rate >= 80 ? 'bg-emerald-500' :
                                                            emp.rate >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                                                        }`}
                                                    style={{ width: `${emp.rate}%` }}
                                                />
                                            </div>
                                            <span className={`text-sm font-semibold ${emp.rate >= 80 ? 'text-emerald-600' :
                                                    emp.rate >= 50 ? 'text-amber-600' : 'text-rose-600'
                                                }`}>
                                                {emp.rate}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

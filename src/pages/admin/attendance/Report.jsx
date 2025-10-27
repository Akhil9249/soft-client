import React, { useState, useEffect } from 'react';
import { Check, X, ChevronDown, CalendarDays } from 'lucide-react';
import AdminService from '../../../services/admin-api-service/AdminService';
import Tabs from '../../../components/button/Tabs';

// --- Mock Data ---
const mockAttendanceData = [
  { admNo: '1111', name: 'John Abraham', attendance: [1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0] },
  { admNo: '1112', name: 'Alice Smith', attendance: [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
  { admNo: '1113', name: 'Bob Johnson', attendance: [0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1] },
  { admNo: '1114', name: 'Emily Davis', attendance: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0] },
  { admNo: '1115', name: 'Michael Lee', attendance: [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1] },
];

const tabOptions = [
  { value: "Student Attendance", label: "Student Attendance" },
  { value: "Report", label: "Report" },
];

const AttendanceIcon = ({ status }) => {
  // status: 1 = Present (Green Check), 0 = Absent (Red X), -1 = Not Marked (Blank/Default)
  if (status === 1) {
    return <Check className="text-green-600 w-4 h-4" />;
  }
  if (status === 0) {
    return <X className="text-red-500 w-4 h-4" />;
  }
  return <div className="w-4 h-4 text-gray-300"></div>; // Blank for Not Marked
};

const AttendanceTable = ({ data, monthData }) => {
  // Generate days based on the month data or fallback to data length
  const daysInMonth = monthData?.daysInMonth || (data.length > 0 ? Math.max(...data.map(item => item.attendance.length)) : 31);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-auto divide-y divide-gray-200">
        {/* Table Header */}
        <thead className="bg-white sticky top-0 z-10">
          <tr>
            {/* Fixed Name/Adm. No. columns */}
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[5rem] sticky left-0 bg-white">
              Adm. No.
            </th><th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[10rem] sticky left-20 bg-white shadow-inner">
              Name
            </th>{/* Scrollable Day columns */}
            {days.map(day => (
              <th
                key={day}
                scope="col"
                className="px-2 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[2.5rem]"
              >
                {day}
              </th>
            ))}<th scope="col" className="min-w-[4rem]"></th>
          </tr>
          <tr className="border-b border-gray-300">
            <td colSpan={2} className="p-0 border-r border-gray-200 sticky left-0 bg-white"></td><td colSpan={days.length} className="p-0"></td><td className="p-0"></td>
          </tr>
        </thead>
        
        {/* Table Body */}
        <tbody className="bg-white divide-y divide-gray-100 text-sm">
          {data.map((student, index) => (
            <tr key={student._id} className="hover:bg-yellow-50/50 transition duration-150 ease-in-out">
              {/* Fixed Name/Adm. No. cells */}
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium sticky left-0 bg-white z-10">
                {student._id.slice(-4)}
              </td><td className="px-6 py-4 whitespace-nowrap text-gray-800 sticky left-20 bg-white z-10 shadow-inner">
                {student.fullName}
              </td>{/* Scrollable Attendance Cells */}
              {days.map(dayIndex => (
                <td key={dayIndex} className="px-2 py-4 whitespace-nowrap text-center">
                  <AttendanceIcon status={student.attendance[dayIndex - 1]} />
                </td>
              ))}<td className="min-w-[4rem]"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AttendanceKey = () => (
    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Attendance</h2>
        <span className="flex items-center space-x-1.5">
            <Check className="text-green-600 w-4 h-4" />
            <span>Present</span>
        </span>
        <span className="flex items-center space-x-1.5">
            <X className="text-red-500 w-4 h-4" />
            <span>Absent</span>
        </span>
        <span className="flex items-center space-x-1.5">
            <div className="w-4 h-4 border border-gray-300 rounded-sm"></div>
            <span>Blank - Not Marked</span>
        </span>
    </div>
);

// --- Main App Component ---
const Report = ({ activeTab, setActiveTab }) => {
  // const [activeTab, setActiveTab] = useState('attendance');
  
  // AdminService for fetching data
  const { getBranchesData, getCoursesData, getInternsAttendanceByMonth } = AdminService();
  
  // State for branches
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [branchesLoading, setBranchesLoading] = useState(false);
  
  // State for courses
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [coursesLoading, setCoursesLoading] = useState(false);
  
  // State for month selection
  const [selectedMonth, setSelectedMonth] = useState('');
  
  // State for attendance data
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState('');
  const [monthData, setMonthData] = useState(null);
  const [summary, setSummary] = useState(null);
  
  // Fetch branches from backend
  const fetchBranches = async () => {
    try {
      setBranchesLoading(true);
      const response = await getBranchesData();
      
      if (response?.data) {
        setBranches(response.data);
        console.log('Branches loaded:', response.data.length, 'branches available');
      }
    } catch (err) {
      console.error('Failed to load branches:', err);
    } finally {
      setBranchesLoading(false);
    }
  };
  
  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      const response = await getCoursesData();
      
      if (response?.data) {
        setCourses(response.data);
        console.log('Courses loaded:', response.data.length, 'courses available');
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setCoursesLoading(false);
    }
  };
  
  // Fetch attendance data for selected month
  const fetchAttendanceData = async (month, branchId = null, courseId = null) => {
    try {
      setAttendanceLoading(true);
      setAttendanceError('');
      
      if (!month) {
        setAttendanceData([]);
        return;
      }
      
      // Get current year
      const currentYear = new Date().getFullYear();
      
      console.log('Fetching attendance for month:', month, 'year:', currentYear);
      
      // Use the new month-based API
      const response = await getInternsAttendanceByMonth(
        parseInt(month), 
        currentYear, 
        branchId, 
        courseId
      );
      
      if (response?.data) {
        console.log('Response:', response.data.data);
        // Process the data to match the table format
        const processedData = response.data.data.map(intern => ({
          _id: intern._id,
          fullName: intern.fullName,
          email: intern.email,
          role: intern.role,
          branchName: intern.branchName,
          courseName: intern.courseName,
          attendance: intern.attendance.map(dayAttendance => {
            if (dayAttendance === null) {
              return -1; // Not marked
            } else if (dayAttendance.status === true) {
              return 1; // Present
            } else if (dayAttendance.status === false) {
              return 0; // Absent
            }
            return -1; // Default to not marked
          })
        }));
        
        setAttendanceData(processedData);
        setMonthData(response.monthData);
        setSummary(response.summary);
        console.log('Processed attendance data:', processedData.length, 'interns');
        console.log('Month data:', response.monthData);
        console.log('Summary:', response.summary);
      } else {
        setAttendanceData([]);
        console.log('No attendance data found for the selected month');
      }
      
    } catch (err) {
      console.error('Failed to load attendance data:', err);
      setAttendanceError('Failed to load attendance data');
    } finally {
      setAttendanceLoading(false);
    }
  };
  
  // Load data when component mounts
  useEffect(() => {
    fetchBranches();
    fetchCourses();
  }, []);
  
  // Fetch attendance data when month, branch, or course changes
  useEffect(() => {
    if (selectedMonth) {
      fetchAttendanceData(selectedMonth, selectedBranch || null, selectedCourse || null);
    }
  }, [selectedMonth, selectedBranch, selectedCourse]);

  return (
    <div className="min-h-screen max-w-[1250px]  font-inter">
      {/* Global Header / Breadcrumb */}
  
      <Tabs tabs={tabOptions} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Card */}
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl border border-gray-100 mt-4">
        
        {/* Top Filters and Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center  gap-4 mb-4">
          
          {/* Tabs */}
          <div className="flex rounded-lg overflow-hidden shadow-md">
           
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Branch Dropdown */}
            <div className="relative">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                disabled={branchesLoading}
                className="appearance-none block w-full bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition shadow-sm text-sm"
              >
                <option value="">
                  {branchesLoading ? 'Loading branches...' : 'All Branches'}
                </option>
                {branches.map((branch) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 w-5 h-5 text-gray-400" />
            </div>

            {/* Course Dropdown */}
            <div className="relative">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                disabled={coursesLoading}
                className="appearance-none block w-full bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition shadow-sm text-sm"
              >
                <option value="">
                  {coursesLoading ? 'Loading courses...' : 'All Courses'}
                </option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseName}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 w-5 h-5 text-gray-400" />
            </div>

            {/* Month Dropdown */}
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none block w-full bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition shadow-sm text-sm"
              >
                <option value="">All Months</option>
                <option value="01">January</option>
                <option value="02">February</option>
                <option value="03">March</option>
                <option value="04">April</option>
                <option value="05">May</option>
                <option value="06">June</option>
                <option value="07">July</option>
                <option value="08">August</option>
                <option value="09">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
              <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 w-5 h-5 text-gray-400" />
            </div>
            
            {/* Date Picker Icon Placeholder */}
            {/* <button className="flex items-center justify-center p-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition shadow-sm">
                <CalendarDays className="w-5 h-5" />
            </button> */}
          </div>
        </div>

        {/* Attendance Key / Legend */}
        {activeTab === 'attendance' && <AttendanceKey />}

        {/* Summary Statistics */}
        {summary && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-white rounded-xl shadow-sm flex flex-col justify-center items-center">
              <div className="text-xs font-semibold text-gray-500 mb-1">Total Interns</div>
              <div className="text-2xl font-extrabold text-gray-800">
                {summary.totalInterns}
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm flex flex-col justify-center items-center">
              <div className="text-xs font-semibold text-gray-500 mb-1">Present</div>
              <div className="text-2xl font-extrabold text-green-600">
                {summary.presentCount}
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm flex flex-col justify-center items-center">
              <div className="text-xs font-semibold text-gray-500 mb-1">Absent</div>
              <div className="text-2xl font-extrabold text-red-500">
                {summary.absentCount}
              </div>
            </div>
            <div className="p-4 bg-white rounded-xl shadow-sm flex flex-col justify-center items-center">
              <div className="text-xs font-semibold text-gray-500 mb-1">Not Marked</div>
              <div className="text-2xl font-extrabold text-gray-500">
                {summary.notMarkedCount}
              </div>
            </div>
          </div>
        )}

        {/* Attendance Grid/Table */}
        {attendanceLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading attendance data...</div>
          </div>
        ) : attendanceError ? (
          <div className="text-center py-8">
            <div className="text-red-500">{attendanceError}</div>
          </div>
        ) : attendanceData.length > 0 ? (
          <AttendanceTable data={attendanceData} monthData={monthData} />
        ) : selectedMonth ? (
          <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-yellow-800 font-medium">No attendance records found for the selected month</div>
            <div className="text-yellow-600 text-sm mt-1">Try selecting a different month or check if attendance has been marked</div>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-gray-600 font-medium">Select a month to view attendance records</div>
          </div>
        )}

        {/* Report View Placeholder */}
        {activeTab === 'report' && (
            <div className="p-10 text-center bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Report View</h3>
                <p className="text-gray-500">
                    A detailed summary report would be displayed here, aggregating the attendance data.
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Report;
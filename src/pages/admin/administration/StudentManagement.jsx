import React, { useEffect, useState } from 'react'
import Tabs from '../../../components/button/Tabs';
import { Navbar } from '../../../components/admin/AdminNavBar';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import AdminService from '../../../services/admin-api-service/AdminService';

export const StudentManagement = () => {

    const { getInternsData, getBatchesData,putInternsData,postInternsData,getBranchesData,getCoursesData,deleteInternsData } = AdminService();

  const [activeTab, setActiveTab] = useState('studentsList');
  const [activeSubModule, setActiveSubModule] = useState('studentManagement');
  const axiosPrivate = useAxiosPrivate();
  const [interns, setInterns] = useState([]);
  const [branches, setBranches] = useState([]);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [batchesLoading, setBatchesLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [formData, setFormData] = useState({});
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 4
  });
  const [filters, setFilters] = useState({
    courseStatus: '',
    branch: '',
    batch: ''
  });
  const [notification, setNotification] = useState({
    show: false,
    type: 'success', // 'success', 'error', 'info'
    title: '',
    message: ''
  });
  const [openSections, setOpenSections] = useState({
    administration: true,
    course: false,
    syllabus: false,
    task: false,
    schedule: false,
    settings: false,
  });

  const toggleSection = (section) => {
    setOpenSections(prevState => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const tabOptions = [
    { value: "studentsList", label: "Students List" },
    { value: "newStudent", label: isEditMode ? "Edit Student" : "New Student" }
  ];

   const headData = "Student Management"

  // Notification helper functions
  const showNotification = (type, title, message) => {
    setNotification({
      show: true,
      type,
      title,
      message
    });
  };

  const hideNotification = () => {
    setNotification({
      show: false,
      type: 'success',
      title: '',
      message: ''
    });
  };

  const departments = ['Choose Department', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering'];
  const employmentStatus = ['Choose Employment Status', 'Full-time', 'Part-time', 'Contract'];
  const courseStatus = ['Choose Course Status', 'Active', 'Inactive', 'Completed'];
  const syllabusStatus = ['Choose Syllabus Status', 'Pending', 'In Progress', 'Completed'];
  const placementStatus = ['Choose Placement Status', 'Placed', 'Not Placed'];
  const roles = ['Choose Role', 'Super Admin', 'Admin', 'Mentor', 'Student'];

  const fetchInterns = async (page = 1, search = '', courseStatus = '', branch = '', batch = '') => {
    try {
      setLoading(true);
      setError('');
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (search) queryParams.append('search', search);
      if (courseStatus) queryParams.append('courseStatus', courseStatus);
      if (branch) queryParams.append('branch', branch);
      if (batch) queryParams.append('batch', batch);
      
      const res = await getInternsData(queryParams.toString());
      // console.log("interns==", res.data);
      
      setInterns(res?.data || []);
      
      // Update pagination state
      if (res?.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      setBranchesLoading(true);
      // const res = await axiosPrivate.get('http://localhost:3000/api/branches');
      const res = await getBranchesData();
      setBranches(res?.data || []);
    } catch (err) {
      console.error('Failed to load branches:', err);
      // Set default branches if API fails
      setBranches([
        { _id: '1', branchName: 'Choose Branch' },
        { _id: '2', branchName: 'Software Development' },
        { _id: '3', branchName: 'Data Science' },
        { _id: '4', branchName: 'Embedded Systems' }
      ]);
    } finally {
      setBranchesLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      setBatchesLoading(true);
      // const res = await axiosPrivate.get('http://localhost:3000/api/batches');
      const res = await getBatchesData();
      setBatches(res?.data || []);
    } catch (err) {
      console.error('Failed to load batches:', err);
      // Set default batches if API fails
      setBatches([
        { _id: '1', batchName: 'Choose Batch' },
        { _id: '2', batchName: 'Batch 1' },
        { _id: '3', batchName: 'Batch 2' },
        { _id: '4', batchName: 'Batch 3' }
      ]);
    } finally {
      setBatchesLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      // const res = await axiosPrivate.get('http://localhost:3000/api/course');
      const res = await getCoursesData();
      // console.log("courses==", res);
      setCourses(res?.data || []);
    } catch (err) {
      console.error('Failed to load courses:', err);
      // Set default courses if API fails
      setCourses([
        { _id: '1', courseName: 'Choose Course' },
        { _id: '2', courseName: 'Web Development' },
        { _id: '3', courseName: 'Mobile App Development' },
        { _id: '4', courseName: 'Cybersecurity' }
      ]);
    } finally {
      setCoursesLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns(pagination.currentPage, searchTerm, filters.courseStatus, filters.branch, filters.batch);
    fetchBranches();
    fetchBatches();
    fetchCourses();
  }, []);

  // Handle search and filter changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchInterns(1, searchTerm, filters.courseStatus, filters.branch, filters.batch);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters]);

  // Clear messages when switching tabs
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [activeTab]);

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
      fetchInterns(newPage, searchTerm, filters.courseStatus, filters.branch, filters.batch);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleEditStudent = (student) => {
    // console.log('Editing student:', student);
    // console.log('Date of Birth:', student.dateOfBirth);
    // console.log('Course Started Date:', student.courseStartedDate);
    // console.log('Completion Date:', student.completionDate);
    
    setEditingStudent(student);
    setIsEditMode(true);
    
    // Format dates for HTML date input (YYYY-MM-DD)
    const formatDateForInput = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split('T')[0];
    };
    
    setFormData({
      fullName: student.fullName || "",
      dateOfBirth: formatDateForInput(student.dateOfBirth),
      gender: student.gender || "",
      email: student.email || "",
      internPhoneNumber: student.internPhoneNumber || "",
      internWhatsAppNumber: student.internWhatsAppNumber || "",
      guardianName: student.guardianName || "",
      fatherName: student.fatherName || "",
      motherName: student.motherName || "",
      guardianParentPhone: student.guardianParentPhone || "",
      internPermanentAddress: student.internPermanentAddress || "",
      district: student.district || "",
      state: student.state || "",
      course: student.course?._id || student.course || "",
      branch: student.branch?._id || student.branch || "",
      courseStartedDate: formatDateForInput(student.courseStartedDate),
      completionDate: formatDateForInput(student.completionDate),
      batch: student.batch || "",
      courseStatus: student.courseStatus === 'Ongoing' ? 'Active' : 
                   student.courseStatus === 'Completed' ? 'Completed' : 'Inactive',
      remarks: student.remarks || "",
      internSyllabusStatus: student.internSyllabusStatus === 'Not Started' ? 'Pending' :
                           student.internSyllabusStatus === 'In Progress' ? 'In Progress' : 'Completed',
      placementStatus: student.placementStatus || "",
      linkedin: student.linkedin || "",
      portfolio: student.portfolio || "",
      companyName: student.companyName || "",
      jobRole: student.jobRole || "",
      officialEmail: student.officialEmail || "",
      password: "",
    });
    
    // console.log('Form data set:', {
    //   dateOfBirth: formatDateForInput(student.dateOfBirth),
    //   courseStartedDate: formatDateForInput(student.courseStartedDate),
    //   completionDate: formatDateForInput(student.completionDate)
    // });
    
    setActiveTab('newStudent');
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setIsEditMode(false);
    setFormData({});
    setActiveTab('studentsList');
  };

  const handleDeleteStudent = (student) => {
    setDeletingStudent(student);
    setShowDeleteModal(true);
  };

  const handleViewStudent = (student) => {
    setViewingStudent(student);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewingStudent(null);
  };

  const handleExport = () => {
    try {
      // Create a new window for PDF generation
      const printWindow = window.open('', '_blank');
      
      // Prepare table data
      const tableHeaders = [
        'Name',
        'Email',
        'Phone',
        'Course',
        'Branch',
        'Batch',
        'Status',
        'Date of Birth',
        'Gender',
        'Guardian Name',
        'Address',
        'District',
        'State',
        'Course Started',
        'Completion Date',
        'Syllabus Status',
        'Placement Status',
        'Company',
        'Job Role',
        'Created Date'
      ];

      const tableData = interns.map(student => [
        student.fullName || 'N/A',
        student.email || 'N/A',
        student.internPhoneNumber || 'N/A',
        student.course?.courseName || student.course || 'N/A',
        student.branch?.branchName || 'N/A',
        student.batch || 'N/A',
        student.courseStatus || 'N/A',
        student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A',
        student.gender || 'N/A',
        student.guardianName || 'N/A',
        student.internPermanentAddress || 'N/A',
        student.district || 'N/A',
        student.state || 'N/A',
        student.courseStartedDate ? new Date(student.courseStartedDate).toLocaleDateString() : 'N/A',
        student.completionDate ? new Date(student.completionDate).toLocaleDateString() : 'N/A',
        student.internSyllabusStatus || 'N/A',
        student.placementStatus || 'N/A',
        student.companyName || 'N/A',
        student.jobRole || 'N/A',
        student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'
      ]);

      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Students Export</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #f7931e;
              padding-bottom: 10px;
            }
            .header h1 {
              color: #f7931e;
              margin: 0;
              font-size: 24px;
            }
            .header p {
              margin: 5px 0;
              color: #666;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 10px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 6px;
              text-align: left;
              vertical-align: top;
            }
            th {
              background-color: #f7931e;
              color: white;
              font-weight: bold;
              font-size: 9px;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            tr:hover {
              background-color: #f5f5f5;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 10px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 10px;
            }
            @media print {
              body { margin: 0; }
              .header { page-break-inside: avoid; }
              table { page-break-inside: auto; }
              tr { page-break-inside: avoid; page-break-after: auto; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Students Management Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>Total Students: ${interns.length}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                ${tableHeaders.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${tableData.map(row => 
                `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
              ).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This report was generated from the Student Management System</p>
            <p>© ${new Date().getFullYear()} Learning Management System</p>
          </div>
        </body>
        </html>
      `;

      // Write content to new window
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load, then print
      printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };

      showNotification('success', 'Export Successful', 'Student data has been exported as PDF successfully.');
    } catch (error) {
      console.error('Export error:', error);
      showNotification('error', 'Export Failed', 'Failed to export student data. Please try again.');
    }
  };

  const confirmDeleteStudent = async () => {
    if (!deletingStudent) return;
    
    try {
      setLoading(true);
      setError('');
      const res = await deleteInternsData(deletingStudent._id);
      showNotification('success', 'Success', 'Student deleted successfully.');
      await fetchInterns();
      setShowDeleteModal(false);
      setDeletingStudent(null);
    } catch (err) {
      showNotification('error', 'Error', err?.response?.data?.message || 'Failed to delete student');
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingStudent(null);
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setError('');
    const formDataObj = new FormData(e.currentTarget);

    // Map UI values to backend expectations
    const uiCourseStatus = formDataObj.get('courseStatus');
    const courseStatusMap = { 'Active': 'Ongoing', 'Inactive': 'Dropped', 'Completed': 'Completed' };
    const courseStatus = courseStatusMap[uiCourseStatus] || undefined;

    const uiSyllabusStatus = formDataObj.get('internSyllabusStatus');
    const syllabusMap = { 'Pending': 'Not Started', 'In Progress': 'In Progress', 'Completed': 'Completed' };
    const internSyllabusStatus = syllabusMap[uiSyllabusStatus] || undefined;

    const payload = {
      fullName: formDataObj.get('fullName') || undefined,
      dateOfBirth: formDataObj.get('dateOfBirth') || undefined,
      gender: formDataObj.get('gender') || undefined,
      email: formDataObj.get('email') || undefined,
      internPhoneNumber: formDataObj.get('internPhoneNumber') || undefined,
      internWhatsAppNumber: formDataObj.get('internWhatsAppNumber') || undefined,
      guardianName: formDataObj.get('guardianName') || undefined,
      fatherName: formDataObj.get('fatherName') || undefined,
      motherName: formDataObj.get('motherName') || undefined,
      guardianParentPhone: formDataObj.get('guardianParentPhone') || undefined,
      internPermanentAddress: formDataObj.get('internPermanentAddress') || undefined,
      district: formDataObj.get('district') || undefined,
      state: formDataObj.get('state') || undefined,

      course: formDataObj.get('course') || undefined,
      branch: formDataObj.get('branch') || undefined,
      courseStartedDate: formDataObj.get('courseStartedDate') || undefined,
      completionDate: formDataObj.get('completionDate') || undefined,
      batch: formDataObj.get('batch') || undefined,
      courseStatus,
      remarks: formDataObj.get('remarks') || undefined,

      internSyllabusStatus,

      placementStatus: formDataObj.get('placementStatus') || undefined,
      linkedin: formDataObj.get('linkedin') || undefined,
      portfolio: formDataObj.get('portfolio') || undefined,
      companyName: formDataObj.get('companyName') || undefined,
      jobRole: formDataObj.get('jobRole') || undefined,

      officialEmail: formDataObj.get('officialEmail') || undefined,
      password: formDataObj.get('password') || undefined,
    };

    try {
      setLoading(true);
      let res;
      if (isEditMode && editingStudent) {
        // Update existing student
        res = await putInternsData(editingStudent._id, payload);
        showNotification('success', 'Success', res?.data?.message || 'Student updated successfully.');
      } else {
        // Create new student
        res = await postInternsData(payload);
        showNotification('success', 'Success', res?.data?.message || 'Student created successfully.');
      }
      
      // refresh list and switch tab
      await fetchInterns();
      setActiveTab('studentsList');
      setEditingStudent(null);
      setIsEditMode(false);
      setFormData({});
      // e.currentTarget.reset();
    } catch (err) {
      showNotification('error', 'Error', err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} student`);
    } finally {
      setLoading(false);
    }
  };

  const [permissions, setPermissions] = useState({
    studentManagement: {
      addStudent: false,
      viewStudent: false,
      editStudent: false,
      deleteStudent: false,
    },
    mentorManagement: {
      addMentor: false,
      viewMentor: false,
      editMentor: false,
      deleteMentor: false,
    },
    courseManagement: {
      addCourse: false,
      viewCourse: false,
      editCourse: false,
      deleteCourse: false,
    },
    categoryManagement: {
      addCategory: false,
      viewCategory: false,
      editCategory: false,
      deleteCategory: false,
    },
    moduleManagement: {
      addModule: false,
      viewModule: false,
      editModule: false,
      deleteModule: false,
    },
    topicManagement: {
      addTopic: false,
      viewTopic: false,
      editTopic: false,
      deleteTopic: false,
    },
    taskManagement: {
      addTask: false,
      viewTask: false,
      editTask: false,
      deleteTask: false,
    },
    weeklySchedule: {
      addSchedule: false,
      viewSchedule: false,
      editSchedule: false,
      deleteSchedule: false,
    },
    scheduleTiming: {
      addTiming: false,
      viewTiming: false,
      editTiming: false,
      deleteTiming: false,
    },
    staticPage: {
      addPage: false,
      viewPage: false,
      editPage: false,
      deletePage: false,
    },
  });

  const handlePermissionChange = (section, permission) => {
    setPermissions(prevState => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [permission]: !prevState[section][permission],
      },
    }));
  };

  const allPermissionsAreOn = (section) => {
    return Object.values(permissions[section]).every(Boolean);
  };

  const handleToggleAll = (section) => {
    const areAllOn = allPermissionsAreOn(section);
    const newPermissions = Object.fromEntries(
      Object.keys(permissions[section]).map(key => [key, !areAllOn])
    );
    setPermissions(prevState => ({
      ...prevState,
      [section]: newPermissions,
    }));
  };

  const renderStudentsList = () => (
    <div className="bg-white p-6 rounded-lg shadow-md flex-grow">

      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 mr-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Students"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <select 
            value={filters.courseStatus}
            onChange={(e) => handleFilterChange('courseStatus', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Dropped">Dropped</option>
          </select>
          <button 
            onClick={handleExport}
            className="flex items-center px-4 py-2 bg-white text-gray-600 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Export
          </button>
        </div>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading students...</p>
          </div>
        </div>
      ) : interns.length === 0 ? (
        <div className="flex items-center justify-center p-12">
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'No students found matching your search.' : 'No students available. Please add students to view them here.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex justify-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {interns.map((intern, idx) => (
                <tr key={intern._id || idx} className="hover:bg-gray-50">
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <span className="text-orange-600 font-medium text-sm">
                            {intern.fullName?.charAt(0)?.toUpperCase() || 'S'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{intern.fullName}</div>
                        <div className="text-sm text-gray-500">{intern.internPhoneNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{intern.email}</div>
                    {/* <div className="text-sm text-gray-500">{intern.officialEmail}</div> */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {intern.course?.courseName || intern.course || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{intern.branch?.branchName || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{intern.batch}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      intern.courseStatus === 'Ongoing' 
                        ? 'bg-green-100 text-green-800' 
                        : intern.courseStatus === 'Completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {intern.courseStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {intern.createdAt ? new Date(intern.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewStudent(intern)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleEditStudent(intern)}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteStudent(intern)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-700">
            <span>
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} results
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage || loading}
              className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-200 flex items-center ${
                pagination.hasPrevPage && !loading
                  ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                  : 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
              }`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              {loading ? 'Loading...' : 'Previous'}
            </button>

            {/* Current Page Info */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
            </div>

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage || loading}
              className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-200 flex items-center ${
                pagination.hasNextPage && !loading
                  ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                  : 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
              }`}
            >
              {loading ? 'Loading...' : 'Next'}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderNewStudentForm = () => (
    <form onSubmit={handleCreateStudent} className="bg-white p-6 rounded-lg shadow-md flex-grow">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {isEditMode ? `Edit Student - ${editingStudent?.fullName}` : 'Create New Student'}
      </h2>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Full Name</label>
            <input 
              name="fullName" 
              type="text" 
              placeholder="Enter full name" 
              value={formData.fullName || ''}
              onChange={(e) => setFormData(prev => ({...prev, fullName: e.target.value}))}
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
            />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
          <input 
            name="dateOfBirth" 
            type="date" 
            value={formData.dateOfBirth || ''}
            onChange={(e) => setFormData(prev => ({...prev, dateOfBirth: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Gender</label>
          <select 
            name="gender" 
            value={formData.gender || ''}
            onChange={(e) => setFormData(prev => ({...prev, gender: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Choose Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email Address</label>
          <input 
            name="email" 
            type="email" 
            placeholder="Enter Email Address" 
            value={formData.email || ''}
            onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Student Phone Number</label>
          <input 
            name="internPhoneNumber" 
            type="tel" 
            placeholder="Enter Student Phone Number" 
            value={formData.internPhoneNumber || ''}
            onChange={(e) => setFormData(prev => ({...prev, internPhoneNumber: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Student WhatsApp Number</label>
          <input 
            name="internWhatsAppNumber" 
            type="tel" 
            placeholder="Enter Student WhatsApp Number" 
            value={formData.internWhatsAppNumber || ''}
            onChange={(e) => setFormData(prev => ({...prev, internWhatsAppNumber: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Guardian's Name</label>
          <input 
            name="guardianName" 
            type="text" 
            placeholder="Enter Student Guardian's Name" 
            value={formData.guardianName || ''}
            onChange={(e) => setFormData(prev => ({...prev, guardianName: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Father's Name</label>
          <input 
            name="fatherName" 
            type="text" 
            placeholder="Enter Student Father's Name" 
            value={formData.fatherName || ''}
            onChange={(e) => setFormData(prev => ({...prev, fatherName: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Student Permanent Address</label>
          <input 
            name="internPermanentAddress" 
            type="text" 
            placeholder="Enter Student Permanent Address" 
            value={formData.internPermanentAddress || ''}
            onChange={(e) => setFormData(prev => ({...prev, internPermanentAddress: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Mother's Name</label>
          <input 
            name="motherName" 
            type="text" 
            placeholder="Enter Student Mother's Name" 
            value={formData.motherName || ''}
            onChange={(e) => setFormData(prev => ({...prev, motherName: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Guardians/Parent Phone Number <span className="text-gray-400">(Optional)</span></label>
          <input 
            name="guardianParentPhone" 
            type="tel" 
            placeholder="Enter Guardians/Parent Phone Number" 
            value={formData.guardianParentPhone || ''}
            onChange={(e) => setFormData(prev => ({...prev, guardianParentPhone: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">District</label>
          <input 
            name="district" 
            type="text" 
            placeholder="Enter Student District" 
            value={formData.district || ''}
            onChange={(e) => setFormData(prev => ({...prev, district: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">State</label>
          <input 
            name="state" 
            type="text" 
            placeholder="Enter Student State" 
            value={formData.state || ''}
            onChange={(e) => setFormData(prev => ({...prev, state: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Photo <span className="text-gray-400">(Photo format: JPG/PNG only)</span></label>
          <div className="flex items-center w-full px-4 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent">
            <span className="text-gray-500 flex-1">Upload Photo</span>
            <input type="file" className="sr-only" id="photo-upload" />
            <label htmlFor="photo-upload" className="cursor-pointer text-gray-500 hover:text-orange-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm3-4a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1v-2z" clipRule="evenodd"></path>
              </svg>
            </label>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Course</label>
          <select 
            name="course" 
            value={formData.course || ''}
            onChange={(e) => setFormData(prev => ({...prev, course: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={coursesLoading}
          >
            <option value="">Choose Course</option>
            {coursesLoading ? (
              <option>Loading courses...</option>
            ) : (
              courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.courseName}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Branch</label>
          <select 
            name="branch" 
            value={formData.branch || ''}
            onChange={(e) => setFormData(prev => ({...prev, branch: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={branchesLoading}
          >
            <option value="">Choose Branch</option>
            {branchesLoading ? (
              <option>Loading branches...</option>
            ) : (
              branches.map(branch => (
                <option key={branch._id} value={branch._id}>
                  {branch.branchName}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Course Started Date</label>
          <input 
            name="courseStartedDate" 
            type="date" 
            value={formData.courseStartedDate || ''}
            onChange={(e) => setFormData(prev => ({...prev, courseStartedDate: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Completion Date</label>
          <input 
            name="completionDate" 
            type="date" 
            value={formData.completionDate || ''}
            onChange={(e) => setFormData(prev => ({...prev, completionDate: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Batch</label>
          <select 
            name="batch" 
            value={formData.batch || ''}
            onChange={(e) => setFormData(prev => ({...prev, batch: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={batchesLoading}
          >
            <option value="">Choose Batch</option>
            {batchesLoading ? (
              <option>Loading batches...</option>
            ) : (
              batches.map(batch => (
                <option key={batch._id} value={batch.batchName}>
                  {batch.batchName}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Course Status</label>
          <select 
            name="courseStatus" 
            value={formData.courseStatus || ''}
            onChange={(e) => setFormData(prev => ({...prev, courseStatus: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {courseStatus.map(status => <option key={status} value={status === 'Choose Course Status' ? '' : status}>{status}</option>)}
          </select>
        </div>
        <div className="lg:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">Remarks/Notes <span className="text-gray-400">(Optional)</span></label>
          <input 
            name="remarks" 
            type="text" 
            placeholder="Enter Any Remarks or notes" 
            value={formData.remarks || ''}
            onChange={(e) => setFormData(prev => ({...prev, remarks: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Syllabus</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Student Syllabus Status</label>
          <select 
            name="internSyllabusStatus" 
            value={formData.internSyllabusStatus || ''}
            onChange={(e) => setFormData(prev => ({...prev, internSyllabusStatus: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {syllabusStatus.map(status => <option key={status} value={status === 'Choose Syllabus Status' ? '' : status}>{status}</option>)}
          </select>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">Placement Information <span className="text-gray-400">(Optional)</span></h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Placement Status</label>
          <select 
            name="placementStatus" 
            value={formData.placementStatus || ''}
            onChange={(e) => setFormData(prev => ({...prev, placementStatus: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {placementStatus.map(status => <option key={status} value={status === 'Choose Placement Status' ? '' : status}>{status}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">LinkedIn</label>
          <input 
            name="linkedin" 
            type="text" 
            placeholder="Enter LinkedIn Link" 
            value={formData.linkedin || ''}
            onChange={(e) => setFormData(prev => ({...prev, linkedin: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Portfolio</label>
          <input 
            name="portfolio" 
            type="text" 
            placeholder="Enter Portfolio Link" 
            value={formData.portfolio || ''}
            onChange={(e) => setFormData(prev => ({...prev, portfolio: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Company Name <span className="text-gray-400">(Only If Placed)</span></label>
          <input 
            name="companyName" 
            type="text" 
            placeholder="Enter Company Name" 
            value={formData.companyName || ''}
            onChange={(e) => setFormData(prev => ({...prev, companyName: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Job Role <span className="text-gray-400">(Only If Placed)</span></label>
          <input 
            name="jobRole" 
            type="text" 
            placeholder="Enter Job Role" 
            value={formData.jobRole || ''}
            onChange={(e) => setFormData(prev => ({...prev, jobRole: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Resume <span className="text-gray-400">(Upload PDF only Max 5MB)</span></label>
          <div className="flex items-center w-full px-4 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent">
            <span className="text-gray-500 flex-1">upload resume</span>
            <input type="file" className="sr-only" id="resume-upload" />
            <label htmlFor="resume-upload" className="cursor-pointer text-gray-500 hover:text-orange-500">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm3-4a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1v-2z" clipRule="evenodd"></path>
              </svg>
            </label>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">Login & Access</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Student Email Address</label>
          <input 
            name="officialEmail" 
            type="email" 
            placeholder="Enter Student Email Address" 
            value={formData.officialEmail || ''}
            onChange={(e) => setFormData(prev => ({...prev, officialEmail: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Create Password</label>
          <input 
            name="password" 
            type="password" 
            placeholder="Create A Password" 
            value={formData.password || ''}
            onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
          <input type="password" placeholder="Re-Enter The Password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
      </div>
      <div className="flex justify-end mt-8 space-x-4">
        <button 
          type="button"
          onClick={handleCancelEdit}
          className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        >
          Cancel
        </button>
        <button type="submit" disabled={loading} className="px-6 py-2 bg-orange-500 text-white rounded-md font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 disabled:opacity-60">
          {loading 
            ? (isEditMode ? 'Updating...' : 'Creating...') 
            : (isEditMode ? 'Update Student' : 'Create Student')
          }
        </button>
      </div>
    </form>
  );

  // Notification Modal Component
  const NotificationModal = () => {
    if (!notification.show) return null;

    const getIcon = () => {
      switch (notification.type) {
        case 'success':
          return (
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        case 'error':
          return (
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          );
        case 'info':
          return (
            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        default:
          return null;
      }
    };

    const getButtonColor = () => {
      switch (notification.type) {
        case 'success':
          return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
        case 'error':
          return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
        case 'info':
          return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
        default:
          return 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500';
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                {getIcon()}
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">{notification.title}</h3>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-500">{notification.message}</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={hideNotification}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonColor()}`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRolesList = () => (
    <div className="bg-white p-6 rounded-lg shadow-md flex-grow">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 mr-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Role"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-white text-gray-600 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 font-semibold uppercase text-sm">
              <th className="py-3 px-4 rounded-tl-lg">#</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Last Log In</th>
              <th className="py-3 px-4">Updated by</th>
              <th className="py-3 px-4 rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b last:border-b-0 border-gray-200">
              <td className="py-3 px-4">1</td>
              <td className="py-3 px-4">Priyesh</td>
              <td className="py-3 px-4">Super Admin</td>
              <td className="py-3 px-4">Full access to all modules</td>
              <td className="py-3 px-4">priyesh@gmail.com</td>
              <td className="py-3 px-4">13/01/25<br />16:25:22</td>
              <td className="py-3 px-4">Administrator</td>
              <td className="py-3 px-4 flex space-x-2">
                <button className="text-gray-500 hover:text-orange-500 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.5a1.25 1.25 0 011.768 0l2.536 2.536a1.25 1.25 0 010 1.768L12.768 18.768a2 2 0 01-1.414.586H6.5a2 2 0 01-2-2v-5.5a2 2 0 01.586-1.414l6-6a2 2 0 012.828 0z"></path></svg>
                </button>
                <button className="text-gray-500 hover:text-red-500 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-end items-center mt-4 text-gray-500 text-sm space-x-2">
        <span>1 of 1</span>
        <button className="p-1 rounded-md border border-gray-300 text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <button className="p-1 rounded-md border border-gray-300">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </div>
  );

  const renderNewRoleForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-md flex-grow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Role</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            {roles.map(role => <option key={role}>{role}</option>)}
          </select>
        </div>
        <div className="lg:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <input type="text" placeholder="Enter Description" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">All Privilege's</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(permissions).map(section => (
          <div key={section} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-gray-700 capitalize">{section.replace(/([A-Z])/g, ' $1').trim()}</h4>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={allPermissionsAreOn(section)}
                  onChange={() => handleToggleAll(section)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
              </label>
            </div>
            <ul className="space-y-2">
              {Object.keys(permissions[section]).map(permission => (
                <li key={permission} className="flex items-center justify-between text-gray-600">
                  <span className="text-sm">{permission.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={permissions[section][permission]}
                      onChange={() => handlePermissionChange(section, permission)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-8 space-x-4">
        <button className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200">
          Cancel
        </button>
        <button className="px-6 py-2 bg-orange-500 text-white rounded-md font-medium shadow-md hover:bg-orange-600 transition-colors duration-200">
          Create Role
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    if (activeSubModule === 'studentManagement') {
      return (
        <>
        <Navbar headData={headData} activeTab={activeTab} />
        <div className="flex-1 ">
    
          <div className="mb-6" >
            <Tabs tabs={tabOptions} activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {activeTab === 'studentsList' ? renderStudentsList() : renderNewStudentForm()}
        </div>

        {/* Notification Modal */}
        <NotificationModal />

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Delete Student</h3>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete the student <strong>"{deletingStudent?.fullName}"</strong>? 
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteStudent}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Student Details Modal */}
        {showViewModal && viewingStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-semibold text-gray-900">{viewingStudent.fullName}</h1>
                  <button 
                    onClick={closeViewModal}
                    className="flex items-center gap-1 text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors print:hidden"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="px-8 py-6">
                <div className="flex flex-col md:flex-row gap-10">
                  {/* Left Column - Details */}
                  <div className="flex-1 space-y-6">
                    {/* Basic Details */}
                    <div>
                      <h2 className="text-[#f7931e] font-semibold mb-4 text-lg italic">
                        Basic Details
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm">
                        <p className="leading-6"><span className="font-semibold text-gray-900">Full Name:</span> <span className="text-gray-600">{viewingStudent.fullName || 'N/A'}</span></p>
                        <p className="leading-6"><span className="font-semibold text-gray-900">Date of Birth:</span> <span className="text-gray-600">{viewingStudent.dateOfBirth ? new Date(viewingStudent.dateOfBirth).toLocaleDateString('en-GB').replace(/\//g, ' / ') : 'N/A'}</span></p>
                        <p className="leading-6"><span className="font-semibold text-gray-900">Gender:</span> <span className="text-gray-600">{viewingStudent.gender || 'N/A'}</span></p>
                        <p className="leading-6"><span className="font-semibold text-gray-900">Email Address:</span> <span className="text-gray-600">{viewingStudent.email || 'N/A'}</span></p>
                        <p className="leading-6"><span className="font-semibold text-gray-900">Student Phone Number:</span> <span className="text-gray-600">{viewingStudent.internPhoneNumber || 'N/A'}</span></p>
                        <p className="leading-6"><span className="font-semibold text-gray-900">Student WhatsApp Number:</span> <span className="text-gray-600">{viewingStudent.internWhatsAppNumber || 'N/A'}</span></p>
                        <p className="leading-6"><span className="font-semibold text-gray-900">Guardian's Name:</span> <span className="text-gray-600">{viewingStudent.guardianName || 'N/A'}</span></p>
                        <p className="leading-6"><span className="font-semibold text-gray-900">Father's Name:</span> <span className="text-gray-600">{viewingStudent.fatherName || 'N/A'}</span></p>
                        <p className="leading-6"><span className="font-semibold text-gray-900">Mother's Name:</span> <span className="text-gray-600">{viewingStudent.motherName || 'N/A'}</span></p>
                        <p className="leading-6"><span className="font-semibold text-gray-900">Guardian/Parent Phone:</span> <span className="text-gray-600">{viewingStudent.guardianParentPhone || 'N/A'}</span></p>
                        <p className="col-span-2 leading-6"><span className="font-semibold text-gray-900">Student Permanent Address:</span> <span className="text-gray-600">{viewingStudent.internPermanentAddress || 'N/A'}</span></p>
                        <p className="leading-6"><span className="font-semibold text-gray-900">District:</span> <span className="text-gray-600">{viewingStudent.district || 'N/A'}</span></p>
                        <p className="leading-6"><span className="font-semibold text-gray-900">State:</span> <span className="text-gray-600">{viewingStudent.state || 'N/A'}</span></p>
                      </div>
                    </div>

                    {/* Academic Details */}
                    <div>
                      <h2 className="text-[#f7931e] font-semibold mb-4 text-lg italic">
                        Academic Details
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm">
                        <p className="leading-6"><span className="font-semibold text-gray-900">Course:</span> <span className="text-gray-600">{viewingStudent.course?.courseName || viewingStudent.course || 'N/A'}</span></p>
                        <p className="leading-6"><span className="font-semibold text-gray-900">Branch:</span> <span className="text-gray-600">{viewingStudent.branch?.branchName || 'N/A'}</span></p>
                        <p className="leading-6"><span className="font-semibold text-gray-900">Batch:</span> <span className="text-gray-600">{viewingStudent.batch || 'N/A'}</span></p>
                        <p className="leading-6"><span className="font-semibold text-gray-900">Course Started Date:</span> <span className="text-gray-600">{viewingStudent.courseStartedDate ? new Date(viewingStudent.courseStartedDate).toLocaleDateString('en-GB').replace(/\//g, ' / ') : 'N/A'}</span></p>
                        <p className="leading-6"><span className="font-semibold text-gray-900">Completion Date:</span> <span className="text-gray-600">{viewingStudent.completionDate ? new Date(viewingStudent.completionDate).toLocaleDateString('en-GB').replace(/\//g, ' / ') : 'N/A'}</span></p>
                        <p className="leading-6">
                          <span className="font-semibold text-gray-900">Course Status:</span>{" "}
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            viewingStudent.courseStatus === 'Ongoing' 
                              ? 'bg-green-100 text-green-800' 
                              : viewingStudent.courseStatus === 'Completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {viewingStudent.courseStatus || 'N/A'}
                          </span>
                        </p>
                        <p className="leading-6"><span className="font-semibold text-gray-900">Syllabus Status:</span> <span className="text-gray-600">{viewingStudent.internSyllabusStatus || 'N/A'}</span></p>
                        {viewingStudent.remarks && (
                          <p className="col-span-2 leading-6">
                            <span className="font-semibold text-gray-900">Remarks/Notes:</span>{" "}
                            <span className="text-gray-600">{viewingStudent.remarks}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Placement Information */}
                    {(viewingStudent.placementStatus || viewingStudent.linkedin || viewingStudent.portfolio || viewingStudent.companyName || viewingStudent.jobRole) && (
                      <div>
                        <h2 className="text-[#f7931e] font-semibold mb-4 text-lg italic">
                          Placement Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm">
                          <p className="leading-6"><span className="font-semibold text-gray-900">Placement Status:</span> <span className="text-gray-600">{viewingStudent.placementStatus || 'N/A'}</span></p>
                          <p className="leading-6"><span className="font-semibold text-gray-900">LinkedIn:</span> <span className="text-gray-600">{viewingStudent.linkedin || 'N/A'}</span></p>
                          <p className="leading-6"><span className="font-semibold text-gray-900">Portfolio:</span> <span className="text-gray-600">{viewingStudent.portfolio || 'N/A'}</span></p>
                          <p className="leading-6"><span className="font-semibold text-gray-900">Company Name:</span> <span className="text-gray-600">{viewingStudent.companyName || 'N/A'}</span></p>
                          <p className="leading-6"><span className="font-semibold text-gray-900">Job Role:</span> <span className="text-gray-600">{viewingStudent.jobRole || 'N/A'}</span></p>
                          <p className="leading-6"><span className="font-semibold text-gray-900">Official Email:</span> <span className="text-gray-600">{viewingStudent.officialEmail || 'N/A'}</span></p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Profile Image */}
                  <div className="flex flex-col items-center print:hidden">
                    <div className="w-48 h-48 rounded-full overflow-hidden mb-4">
                      {viewingStudent.photo ? (
                        <img
                          src={viewingStudent.photo}
                          alt={viewingStudent.fullName}
                          className="w-48 h-48 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-4xl font-medium">
                            {viewingStudent.fullName?.charAt(0)?.toUpperCase() || 'S'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 border-t border-gray-200 print:hidden">
                <div className="flex justify-end gap-4">
                  <button 
                    onClick={() => {
                      closeViewModal();
                      handleEditStudent(viewingStudent);
                    }}
                    className="bg-gray-100 border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="bg-[#f7931e] text-white px-5 py-2 rounded-lg hover:bg-[#e67c00] transition-colors"
                  >
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </>
      );
    } else if (activeSubModule === 'roleManagement') {
      return (
        <div className="flex-1 p-8">
          <header className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-gray-800">Role Management</h1>
              <p className="text-sm text-gray-500">Administration &gt; Role Management &gt; Roles</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-end">
                <span className="font-semibold text-gray-800">Priyesh</span>
                <span className="text-sm text-gray-500">Super Admin</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM10 12a7 7 0 100-14 7 7 0 000 14zM10 13a7 7 0 100-14 7 7 0 000 14z" />
                </svg>
              </div>
            </div>
          </header>
          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setActiveTab('roles')}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${activeTab === 'roles'
                  ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              Roles
            </button>
            <button
              onClick={() => setActiveTab('newRole')}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${activeTab === 'newRole'
                  ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              New Role
            </button>
          </div>
          {activeTab === 'roles' ? renderRolesList() : renderNewRoleForm()}
        </div>
      );
    }
    return null;
  };
  return (
    <>
      {renderContent()}
    </>
  )
}

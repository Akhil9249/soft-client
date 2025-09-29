import React, { useEffect, useState } from 'react'
import Tabs from '../../../components/button/Tabs';
import { Navbar } from '../../../components/admin/AdminNavBar';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

export const StudentManagement = () => {

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
  const [formData, setFormData] = useState({});
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

  const departments = ['Choose Department', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering'];
  const employmentStatus = ['Choose Employment Status', 'Full-time', 'Part-time', 'Contract'];
  const courseStatus = ['Choose Course Status', 'Active', 'Inactive', 'Completed'];
  const syllabusStatus = ['Choose Syllabus Status', 'Pending', 'In Progress', 'Completed'];
  const placementStatus = ['Choose Placement Status', 'Placed', 'Not Placed'];
  const roles = ['Choose Role', 'Super Admin', 'Admin', 'Mentor', 'Student'];

  const fetchInterns = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axiosPrivate.get('http://localhost:3000/api/intern');
      setInterns(res.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      setBranchesLoading(true);
      const res = await axiosPrivate.get('http://localhost:3000/api/branches');
      setBranches(res.data || []);
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
      const res = await axiosPrivate.get('http://localhost:3000/api/batches');
      setBatches(res.data || []);
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
      const res = await axiosPrivate.get('http://localhost:3000/api/course');
      setCourses(res.data || []);
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
    fetchInterns();
    fetchBranches();
    fetchBatches();
    fetchCourses();
  }, []);

  // Clear messages when switching tabs
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [activeTab]);

  // Filter interns based on search term
  const filteredInterns = interns.filter(intern =>
    intern.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.course?.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.branch?.branchName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.batch?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditStudent = (student) => {
    console.log('Editing student:', student);
    console.log('Date of Birth:', student.dateOfBirth);
    console.log('Course Started Date:', student.courseStartedDate);
    console.log('Completion Date:', student.completionDate);
    
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
    
    console.log('Form data set:', {
      dateOfBirth: formatDateForInput(student.dateOfBirth),
      courseStartedDate: formatDateForInput(student.courseStartedDate),
      completionDate: formatDateForInput(student.completionDate)
    });
    
    setActiveTab('newStudent');
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
    setIsEditMode(false);
    setFormData({});
    setActiveTab('studentsList');
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
        res = await axiosPrivate.put(`http://localhost:3000/api/intern/${editingStudent._id}`, payload);
        setSuccess(res.data?.message || 'Student updated successfully.');
      } else {
        // Create new student
        res = await axiosPrivate.post('http://localhost:3000/api/intern', payload);
        setSuccess(res.data?.message || 'Student created successfully.');
      }
      
      // refresh list and switch tab
      await fetchInterns();
      setActiveTab('studentsList');
      setEditingStudent(null);
      setIsEditMode(false);
      setFormData({});
      e.currentTarget.reset();
    } catch (err) {
      setError(err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} student`);
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
      {/* Error and Success Messages */}
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
          {success}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 mr-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Students"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          <select className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            <option>Filter</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-white text-gray-600 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200">
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
      ) : filteredInterns.length === 0 ? (
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInterns.map((intern, idx) => (
                <tr key={intern._id || idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
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
                        onClick={() => handleEditStudent(intern)}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
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

  const renderNewStudentForm = () => (
    <form onSubmit={handleCreateStudent} className="bg-white p-6 rounded-lg shadow-md flex-grow">
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>
      )}
      {success && (
        <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{success}</div>
      )}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
          <input 
            name="dateOfBirth" 
            type="date" 
            value={formData.dateOfBirth || ''}
            onChange={(e) => setFormData(prev => ({...prev, dateOfBirth: e.target.value}))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Gender</label>
          <select 
            name="gender" 
            value={formData.gender || ''}
            onChange={(e) => setFormData(prev => ({...prev, gender: e.target.value}))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={coursesLoading}
          >
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Completion Date</label>
          <input 
            name="completionDate" 
            type="date" 
            value={formData.completionDate || ''}
            onChange={(e) => setFormData(prev => ({...prev, completionDate: e.target.value}))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Batch</label>
          <select 
            name="batch" 
            value={formData.batch || ''}
            onChange={(e) => setFormData(prev => ({...prev, batch: e.target.value}))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={batchesLoading}
          >
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
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

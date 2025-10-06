import React, { useEffect, useState } from 'react'
import Tabs from '../../../components/button/Tabs';
import { Navbar } from '../../../components/admin/AdminNavBar';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import AdminService from '../../../services/admin-api-service/AdminService';

export const Courses = () => {
  // const axiosPrivate = useAxiosPrivate();

  const { getCategoriesData, getCoursesData, postCoursesData, putCoursesData, deleteCoursesData } = AdminService();  


  const [activeTab, setActiveTab] = useState('courses');
  const [activeSubModule, setActiveSubModule] = useState('courseManagement');
  const [openSections, setOpenSections] = useState({
    administration: false,
    course: true,
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

  const headData = "Course Management"

  const departments = ['Choose Department', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering'];
  const branches = ['Choose Branch', 'Software Development', 'Data Science', 'Embedded Systems'];
  const employmentStatus = ['Choose Employment Status', 'Full-time', 'Part-time', 'Contract'];
  const courses = ['Choose Course', 'Web Development', 'Mobile App Development', 'Cybersecurity'];
  const batches = ['Choose Batch', 'Batch 1', 'Batch 2', 'Batch 3'];
  const courseStatus = ['Choose Course Status', 'Active', 'Inactive', 'Completed'];
  const syllabusStatus = ['Choose Syllabus Status', 'Pending', 'In Progress', 'Completed'];
  const placementStatus = ['Choose Placement Status', 'Placed', 'Not Placed'];
  const roles = ['Choose Role', 'Super Admin', 'Admin', 'Mentor', 'Student'];
  const durations = ['3 Months', '6 Months', '1 Year'];
  const courseTypes = ['Regular', 'Fast Track', 'Online'];
  const [categories, setCategories] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [success, setSuccess] = useState('');
  const [editingCourse, setEditingCourse] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState(null);

  const tabOptions = [
    { value: "courses", label: "Courses" },
    { value: "newCourse", label: isEditMode ? "Edit Course" : "New Course" }
  ];

  console.log("categories==", categories);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      // const res = await axiosPrivate.get('http://localhost:3000/api/category');
      const res = await getCategoriesData();
      console.log("categories==", res);

      setCategories(res?.data || []);
      // setCategories(res);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      // const res = await axiosPrivate.get('http://localhost:3000/api/course');
      const res = await getCoursesData();
      setCourseList(res?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, []);

  // Clear messages when switching tabs
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [activeTab]);

  // Filter courses based on search term
  const filteredCourses = courseList.filter(course =>
    course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.duration?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (typeof course.category === 'object' && course.category?.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (typeof course.category === 'string' && course.category?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setIsEditMode(true);
    setFormData({
      courseName: course.courseName || "",
      duration: course.duration || "",
      category: typeof course.category === 'object' ? course.category._id : course.category || "",
      courseType: course.courseType || "",
      courseFee: course.courseFee || "",
    });
    setActiveTab('newCourse');
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    setIsEditMode(false);
    setFormData({});
    setActiveTab('courses');
  };

  const handleDeleteCourse = (course) => {
    setDeletingCourse(course);
    setShowDeleteModal(true);
  };

  const confirmDeleteCourse = async () => {
    if (!deletingCourse) return;
    
    try {
      setLoading(true);
      setError('');
      const res = await deleteCoursesData(deletingCourse._id);
      setSuccess('Course deleted successfully.');
      await fetchCourses();
      setShowDeleteModal(false);
      setDeletingCourse(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingCourse(null);
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
      <div className="flex items-center justify-center p-12">
        <p className="text-gray-500 text-lg">No data available. Please add students to view them here</p>
      </div>
    </div>
  );

  const renderNewStudentForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-md flex-grow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Full Name</label>
          <input type="text" placeholder="Enter full name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
          <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Gender</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            <option>Choose Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Email Address</label>
          <input type="email" placeholder="Enter Email Address" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Student Phone Number</label>
          <input type="tel" placeholder="Enter Student Phone Number" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Student WhatsApp Number</label>
          <input type="tel" placeholder="Enter Student WhatsApp Number" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Guardian's Name</label>
          <input type="text" placeholder="Enter Student Guardian's Name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Father's Name</label>
          <input type="text" placeholder="Enter Student Father's Name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Student Permanent Address</label>
          <input type="text" placeholder="Enter Student Permanent Address" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Mother's Name</label>
          <input type="text" placeholder="Enter Student Mother's Name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Guardians/Parent Phone Number <span className="text-gray-400">(Optional)</span></label>
          <input type="tel" placeholder="Enter Guardians/Parent Phone Number" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">District</label>
          <input type="text" placeholder="Enter Student District" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">State</label>
          <input type="text" placeholder="Enter Student State" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
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
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            {courses.map(course => <option key={course}>{course}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Branch</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            {branches.map(branch => <option key={branch}>{branch}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Course Started Date</label>
          <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Completion Date</label>
          <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Batch</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            {batches.map(batch => <option key={batch}>{batch}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Course Status</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            {courseStatus.map(status => <option key={status}>{status}</option>)}
          </select>
        </div>
        <div className="lg:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">Remarks/Notes <span className="text-gray-400">(Optional)</span></label>
          <input type="text" placeholder="Enter Any Remarks or notes" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Syllabus</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Student Syllabus Status</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            {syllabusStatus.map(status => <option key={status}>{status}</option>)}
          </select>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">Placement Information <span className="text-gray-400">(Optional)</span></h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Placement Status</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
            {placementStatus.map(status => <option key={status}>{status}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">LinkedIn</label>
          <input type="text" placeholder="Enter LinkedIn Link" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Portfolio</label>
          <input type="text" placeholder="Enter Portfolio Link" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Company Name <span className="text-gray-400">(Only If Placed)</span></label>
          <input type="text" placeholder="Enter Company Name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Job Role <span className="text-gray-400">(Only If Placed)</span></label>
          <input type="text" placeholder="Enter Job Role" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
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
          <input type="email" placeholder="Enter Mentor Email Address" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Create Password</label>
          <input type="password" placeholder="Create A Password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
          <input type="password" placeholder="Re-Enter The Password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
      </div>
      <div className="flex justify-end mt-8 space-x-4">
        <button className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200">
          Cancel
        </button>
        <button className="px-6 py-2 bg-orange-500 text-white rounded-md font-medium shadow-md hover:bg-orange-600 transition-colors duration-200">
          Create Student
        </button>
      </div>
    </div>
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

  const renderCoursesList = () => (
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
              placeholder="Search Courses"
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

      {/* Courses Table */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading courses...</p>
          </div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="flex items-center justify-center p-12">
          <p className="text-gray-500 text-lg">
            {searchTerm ? 'No courses found matching your search.' : 'No courses available. Please add courses to view them here.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course, idx) => (
                <tr key={course._id || idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <span className="text-orange-600 font-medium text-sm">
                            {course.courseName?.charAt(0)?.toUpperCase() || 'C'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{course.courseName}</div>
                        <div className="text-sm text-gray-500">ID: {course._id?.slice(-6) || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {course.duration}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof course.category === 'object' && course.category ? course.category.categoryName : course.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      course.courseType === 'Regular' 
                        ? 'bg-green-100 text-green-800' 
                        : course.courseType === 'Fast Track'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {course.courseType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{course.courseFee?.toLocaleString() || '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditCourse(course)}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteCourse(course)}
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
    </div>
  );

  const renderNewCourseForm = () => (
    <form onSubmit={async (e) => {
      e.preventDefault();
      setError('');
      const formDataObj = new FormData(e.currentTarget);

      const courseName = formDataObj.get('courseName');
      const duration = formDataObj.get('duration');
      const category = formDataObj.get('category');
      const courseType = formDataObj.get('courseType');
      const courseFee = formDataObj.get('courseFee');

      // Validate required fields
      if (!courseName || !duration || !category || !courseType || !courseFee) {
        setError('All fields are required');
        return;
      }

      const payload = {
        courseName: courseName.trim(),
        duration: duration,
        category: category,
        courseType: courseType,
        courseFee: Number(courseFee),
      };
      try {
        setLoading(true);
        let res;
        if (isEditMode && editingCourse) {
          // Update existing course
          // res = await axiosPrivate.put(`http://localhost:3000/api/course/${editingCourse._id}`, payload);
          res = await putCoursesData(editingCourse._id, payload);
          setSuccess('Course updated successfully.');
        } else {
          // Create new course
          // res = await axiosPrivate.post('http://localhost:3000/api/course', payload);
          res = await postCoursesData(payload);
          setSuccess('Course created successfully.');
        }
        
        await fetchCourses();
        setActiveTab('courses');
        setEditingCourse(null);
        setIsEditMode(false);
        setFormData({});
        e.currentTarget.reset();
      } catch (err) {
        setError(err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} course`);
      } finally {
        setLoading(false);
      }
    }} className="bg-white p-6 rounded-lg shadow-md flex-grow">
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>
      )}
      {success && (
        <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{success}</div>
      )}
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {isEditMode ? `Edit Course - ${editingCourse?.courseName}` : 'Create New Course'}
      </h2>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Course Name</label>
          <input 
            name="courseName" 
            type="text" 
            placeholder="Enter Course Name" 
            value={formData.courseName || ''}
            onChange={(e) => setFormData(prev => ({...prev, courseName: e.target.value}))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
            required 
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Duration</label>
          <select 
            name="duration" 
            value={formData.duration || ''}
            onChange={(e) => setFormData(prev => ({...prev, duration: e.target.value}))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
            required
          >
            <option value="">Choose Duration</option>
            {durations.map(duration => <option key={duration} value={duration}>{duration}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Category Name</label>
          <select 
            name="category" 
            value={formData.category || ''}
            onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
            required
          >
            <option value="">Choose Category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.categoryName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Course Type</label>
          <select 
            name="courseType" 
            value={formData.courseType || ''}
            onChange={(e) => setFormData(prev => ({...prev, courseType: e.target.value}))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
            required
          >
            <option value="">Choose Course Type</option>
            {courseTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Course Fee</label>
          <input 
            name="courseFee" 
            type="number" 
            placeholder="Enter Course Fee" 
            value={formData.courseFee || ''}
            onChange={(e) => setFormData(prev => ({...prev, courseFee: e.target.value}))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
            required 
          />
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
            : (isEditMode ? 'Update Course' : 'Create Course')
          }
        </button>
      </div>
    </form>
  );

  const renderContent = () => {
    if (activeSubModule === 'studentManagement') {
      return (
        <div className="flex-1 p-8">
          <header className="flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-gray-800">Student Management</h1>
              <p className="text-sm text-gray-500">Administration &gt; Student Management</p>
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
              onClick={() => setActiveTab('studentsList')}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${activeTab === 'studentsList'
                  ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              Students List
            </button>
            <button
              onClick={() => setActiveTab('newStudent')}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${activeTab === 'newStudent'
                  ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              New Student
            </button>
          </div>
          {activeTab === 'studentsList' ? renderStudentsList() : renderNewStudentForm()}
        </div>
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
    } else if (activeSubModule === 'courseManagement') {
      return (
        <div className="flex-1 ">

          <Navbar headData={headData} activeTab={activeTab} />


          <div className="mb-6">
            <Tabs tabs={tabOptions} activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {activeTab === 'courses' ? renderCoursesList() : renderNewCourseForm()}
        </div>
      );
    }
    return null;
  };


  return (
    <>
      {renderContent()}
      
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
                <h3 className="text-lg font-medium text-gray-900">Delete Course</h3>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete the course <strong>"{deletingCourse?.courseName}"</strong>? 
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
                onClick={confirmDeleteCourse}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

import React, { useState, useEffect } from 'react'
import Tabs from '../../../components/button/Tabs';
import { Navbar } from '../../../components/admin/AdminNavBar';
// import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import AdminService from '../../../services/admin-api-service/AdminService';

export const Modules = () => {

  // const axiosPrivate = useAxiosPrivate();
  const { getCoursesData, getModulesData, putModulesData, postModulesData, deleteModulesData, getTopicsData, removeTopicFromModuleData } = AdminService();

  // State to manage the active tab. 'modules-list' is the default.
  const [activeTab, setActiveTab] = useState('modules-list');
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingModule, setEditingModule] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [deletingModule, setDeletingModule] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [moduleTopics, setModuleTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [deletingTopic, setDeletingTopic] = useState(null);
  const [showDeleteTopicModal, setShowDeleteTopicModal] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    type: 'success', // 'success', 'error', 'info'
    title: '',
    message: ''
  });
  
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 5
  });
  const [filters, setFilters] = useState({
    course: ''
  });

  const tabOptions = [
    { value: "modules-list", label: "Modules List" },
    { value: "new-module", label: isEditMode ? "Edit Module" : "New Module" }
  ];


  const headData = "Modules Management"

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

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      // const res = await axiosPrivate.get('http://localhost:3000/api/course');
      const res = await getCoursesData();
      setCourses(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async (page = 1, search = '', course = '') => {
    try {
      setLoading(true);
      setError('');
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (search) queryParams.append('search', search);
      if (course) queryParams.append('course', course);
      
      const res = await getModulesData(queryParams.toString());
      setModules(res.data || []);
      
      // Update pagination state
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load modules');
    } finally {
      setLoading(false);
    }
  };

  const fetchModuleTopics = async (moduleId) => {
    try {
      setTopicsLoading(true);
      const res = await getTopicsData();
      // Filter topics that belong to the specific module
      console.log("moduleId==", moduleId);
      console.log("res.data==", res.data);
      const filteredTopics = res.data?.filter(topic => topic.module._id === moduleId) || [];
      setModuleTopics(filteredTopics);
    } catch (err) {
      console.error('Failed to load topics for module:', err);
      setModuleTopics([]);
    } finally {
      setTopicsLoading(false);
    }
  };

  const handleDeleteTopic = (topic) => {
    setDeletingTopic(topic);
    setShowDeleteTopicModal(true);
  };

  const handleConfirmDeleteTopic = async () => {
    if (!deletingTopic || !editingModule) return;

    try {
      setLoading(true);
      await removeTopicFromModuleData(editingModule._id, deletingTopic._id);
      showNotification('success', 'Success', `Topic "${deletingTopic.topicName}" removed from module successfully.`);
      
      // Refresh the topics list for the current module
      await fetchModuleTopics(editingModule._id);
      
      setShowDeleteTopicModal(false);
      setDeletingTopic(null);
    } catch (err) {
      showNotification('error', 'Error', err?.response?.data?.message || 'Failed to remove topic from module');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDeleteTopic = () => {
    setShowDeleteTopicModal(false);
    setDeletingTopic(null);
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
      fetchModules(newPage, searchTerm, filters.course);
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  useEffect(() => {
    fetchCourses();
    fetchModules(pagination.currentPage, searchTerm, filters.course);
  }, []);

  // Handle search and filter changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchModules(1, searchTerm, filters.course);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters]);

  // Clear messages when switching tabs
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [activeTab]);

  // No client-side filtering needed - server handles it

  const handleEditModule = (module) => {
    setEditingModule(module);
    setIsEditMode(true);
    setFormData({
      moduleName: module.moduleName || "",
      course: typeof module.course === 'object' ? module.course._id : module.course || "",
      moduleImage: module.moduleImage || "",
    });
    // Fetch topics for this module
    fetchModuleTopics(module._id);
    setActiveTab('new-module');
  };

  const handleCancelEdit = () => {
    setEditingModule(null);
    setIsEditMode(false);
    setFormData({});
    setModuleTopics([]);
    setActiveTab('modules-list');
  };

  // Handle delete module
  const handleDeleteModule = (module) => {
    setDeletingModule(module);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingModule) return;

    try {
      setLoading(true);
      const res = await deleteModulesData(deletingModule._id);
      showNotification('success', 'Success', 'Module deleted successfully.');
      await fetchModules(pagination.currentPage, searchTerm, filters.course);
      setShowDeleteModal(false);
      setDeletingModule(null);
    } catch (err) {
      showNotification('error', 'Error', err?.response?.data?.message || 'Failed to delete module');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingModule(null);
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formDataObj = new FormData(e.currentTarget);

    const moduleName = formDataObj.get('moduleName');
    const course = formDataObj.get('course');
    const moduleImage = formDataObj.get('moduleImage');

    // Validate required fields
    if (!moduleName || !course) {
      showNotification('error', 'Validation Error', 'Module name and course are required');
      return;
    }

    const payload = {
      moduleName: moduleName.trim(),
      course: course,
      totalTopics: 0,
      moduleImage: moduleImage ? moduleImage.name : null, // For now, just store filename
    };

    try {
      setLoading(true);
      let res;
      if (isEditMode && editingModule) {
        // Update existing module
        const res = await putModulesData(editingModule._id, payload);
        showNotification('success', 'Success', 'Module updated successfully.');
      } else {
        // Create new module
        const res = await postModulesData(payload);
        showNotification('success', 'Success', 'Module created successfully.');
      }
      
      await fetchModules(pagination.currentPage, searchTerm, filters.course);
      setActiveTab('modules-list');
      setEditingModule(null);
      setIsEditMode(false);
      setFormData({});
      setModuleTopics([]);
      // e.currentTarget.reset();
    } catch (err) {
      showNotification('error', 'Error', err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} module`);
    } finally {
      setLoading(false);
    }
  };

  // SVG icons, converted to React components for reusability.
  const DashboardIcon = () => (
    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 01-1 1h-3m-6 0a1 1 0001 1h-3m0-11v10a1 1 01-1 1h-3m-6 0a1 1 0001 1h-3"></path></svg>
  );

  const AdministrationIcon = () => (
    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.402 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 01-6 0 3 3 016 0z"></path></svg>
  );

  const CourseManagementIcon = () => (
    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.433 9.496 5 8 5c-4 0-8 3-8 8s4 8 8 8c.94 0 1.841-.213 2.684-.606m3.56-5.894C15.687 7.159 15.589 8 15 8s-1.5-.5-1.5-.5V5a2 2 00-2-2h-2c-1.5 0-2 1-2 2v2.5M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.402 2.572-1.065z"></path></svg>
  );

  const SyllabusIcon = () => (
    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2-2v4m-6-4h.01M21 12a9 9 01-18 0 9 9 0118 0z"></path></svg>
  );

  const TaskManagementIcon = () => (
    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
  );

  const ScheduleIcon = () => (
    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h.01M7 12h.01M11 12h.01M15 12h.01M21 12h.01M4.75 6.25v10.5a.75.75 0 00.75.75h14a.75.75 0 00.75-.75V6.25a.75.75 0 00-.75-.75h-14a.75.75 0 00-.75.75z"></path></svg>
  );

  const SettingsIcon = () => (
    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.433 9.496 5 8 5c-4 0-8 3-8 8s4 8 8 8c.94 0 1.841-.213 2.684-.606m3.56-5.894C15.687 7.159 15.589 8 15 8s-1.5-.5-1.5-.5V5a2 2 00-2-2h-2c-1.5 0-2 1-2 2v2.5M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.402 2.572-1.065z"></path></svg>
  );

  const LogOutIcon = () => (
    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 01-3 3H6a3 3 01-3-3V7a3 3 013-3h4a3 3 013 3v1"></path></svg>
  );

  const UserIcon = () => (
    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 01-4-4A4 4 014 7v10a4 4 014 4h8a4 4 014-4V7a4 4 01-4-4z"></path></svg>
  );

  const ExportIcon = () => (
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0006 0v-1m-4-4l4-4m0 0l4 4m-4-4v12"></path></svg>
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

  return (
    <>
      <Navbar headData={headData} activeTab={activeTab} />
      
      {/* Notification Modal */}
      <NotificationModal />

      <div className="flex justify-between items-center ">
      <div className="mb-6">
        <Tabs tabs={tabOptions} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="flex justify-end ">
          <button className="flex items-center px-4 py-2 bg-white text-gray-600 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Export
          </button>
        </div>

      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">

        {/* Tab content */}
        {activeTab === 'modules-list' ? (
          <div id="modules-list-content">

            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 mr-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Modules"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
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
                <select 
                  value={filters.course}
                  onChange={(e) => handleFilterChange('course', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Courses</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.courseName}
                    </option>
                  ))}
                </select>
                <button className="flex items-center px-4 py-2 bg-white text-gray-600 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Export
                </button>
              </div>
            </div>

            {/* Modules Table */}
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading modules...</p>
                </div>
              </div>
            ) : modules.length === 0 ? (
              <div className="flex items-center justify-center p-12">
                <p className="text-gray-500 text-lg">
                  {searchTerm || filters.course ? 'No modules found matching your search.' : 'No modules available. Please add modules to view them here.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Topics</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {modules.map((module, idx) => (
                      <tr key={module._id || idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <span className="text-orange-600 font-medium text-sm">
                                  {module.moduleName?.charAt(0)?.toUpperCase() || 'M'}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{module.moduleName}</div>
                              <div className="text-sm text-gray-500">ID: {module._id?.slice(-6) || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {typeof module.course === 'object' && module.course ? module.course.courseName : module.course}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {module.totalTopics || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {module.createdAt ? new Date(module.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditModule(module)}
                              className="text-orange-600 hover:text-orange-900"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteModule(module)}
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
        ) : (
          <div id="new-module-content">
            <form onSubmit={handleCreateModule} className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditMode ? `Edit Module - ${editingModule?.moduleName}` : 'Module Details'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Module Name</label>
                  <input 
                    name="moduleName" 
                    type="text" 
                    placeholder="Enter Module Name" 
                    value={formData.moduleName || ''}
                    onChange={(e) => setFormData(prev => ({...prev, moduleName: e.target.value}))}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Topics</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={isEditMode ? moduleTopics.length : 0}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" 
                    disabled 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Course</label>
                  <select 
                    name="course" 
                    value={formData.course || ''}
                    onChange={(e) => setFormData(prev => ({...prev, course: e.target.value}))}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" 
                    required
                  >
                    <option value="">Choose Course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>{course.courseName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Module Image <span className="text-gray-400">(Optional - JPG/PNG only)</span></label>
                  <div className="flex items-center w-full px-4 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent">
                    <span className="text-gray-500 flex-1">
                      {formData.moduleImage ? formData.moduleImage : 'Upload Module Image'}
                    </span>
                    <input 
                      name="moduleImage" 
                      type="file" 
                      accept="image/*" 
                      className="sr-only" 
                      id="module-image-upload" 
                    />
                    <label htmlFor="module-image-upload" className="cursor-pointer text-gray-500 hover:text-orange-500">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm3-4a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1v-2z" clipRule="evenodd"></path>
                      </svg>
                    </label>
                  </div>
                </div>
              </div>

              {/* Show topics for the module being edited */}
              {isEditMode && editingModule && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Module Topics</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {topicsLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mr-2"></div>
                        <span className="text-gray-500">Loading topics...</span>
                      </div>
                    ) : moduleTopics.length > 0 ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">
                            {moduleTopics.length} topic{moduleTopics.length !== 1 ? 's' : ''} found
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {moduleTopics.map((topic, index) => (
                            <div key={topic._id || index} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                                    {topic.topicName || 'Untitled Topic'}
                                  </h4>
                                  <p className="text-xs text-gray-500 mb-2">
                                    {topic.description || 'No description available'}
                                  </p>
                                  <div className="flex items-center space-x-2">
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                                      {topic.duration || '0'} min
                                    </span>
                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                                      {topic.difficulty || 'Beginner'}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 ml-2">
                                  <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-600 p-1"
                                    title="View Topic"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    className="text-gray-400 hover:text-orange-600 p-1"
                                    title="Edit Topic"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                    </svg>
                                  </button>
                                  {/* <button
                                    type="button"
                                    onClick={() => handleDeleteTopic(topic)}
                                    className="text-gray-400 hover:text-red-600 p-1"
                                    title="Remove Topic from Module"
                                    disabled={loading}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                  </button> */}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-full border border-gray-200">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                          </svg>
                          No topics found for this module
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Add topics to this module to see them here</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 mt-8">
                <button 
                  type="button" 
                  onClick={handleCancelEdit}
                  className="py-2 px-6 rounded-lg bg-white border border-gray-300 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="py-2 px-6 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-60">
                  {loading 
                    ? (isEditMode ? 'Updating...' : 'Creating...') 
                    : (isEditMode ? 'Update Module' : 'Create Module')
                  }
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Delete Module Confirmation Modal */}
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
                <h3 className="text-lg font-medium text-gray-900">Delete Module</h3>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete the module <strong>"{deletingModule?.moduleName}"</strong>?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Topic Confirmation Modal */}
      {showDeleteTopicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Remove Topic from Module</h3>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Are you sure you want to remove the topic <strong>"{deletingTopic?.topicName}"</strong> from this module?
                The topic will be removed from the module but will remain in the topics collection.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDeleteTopic}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteTopic}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Removing...' : 'Remove Topic'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>

  )
}

import React, { useState, useEffect } from 'react'
import Tabs from '../../../components/button/Tabs';
import { Navbar } from '../../../components/admin/AdminNavBar';
// import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import AdminService from '../../../services/admin-api-service/AdminService';

export const TaskManagement = () => {

  // State to manage the active tab. 'tasks-list' is the default.
  const [activeTab, setActiveTab] = useState('tasks-list');
  const [tasks, setTasks] = useState([]);
  const [batches, setBatches] = useState([]);
  const [modules, setModules] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [batchesLoading, setBatchesLoading] = useState(false);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [mentorsLoading, setMentorsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  // const axiosPrivate = useAxiosPrivate();

  const tabOptions = [
    { value: "tasks-list", label: "Tasks List" },
    { value: "new-task", label: "New Task" }
  ];

  const headData = "Task Management"

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

  const CalendarIcon = () => (
    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h.01M7 12h.01M11 12h.01M15 12h.01M21 12h.01M4.75 6.25v10.5a.75.75 0 00.75.75h14a.75.75 0 00.75-.75V6.25a.75.75 0 00-.75-.75h-14a.75.75 0 00-.75.75z"></path></svg>
  );

  const UploadIcon = () => (
    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0006 0v-1m-4-4l4-4m0 0l4 4m-4-4v12"></path></svg>
  );

  const { getBatchesData, getModulesData, getMentorsData, getTasksData, putTasksData, postTasksData } = AdminService();

  // API functions to fetch data
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      // const res = await axiosPrivate.get('http://localhost:3000/api/tasks');
      const res = await getTasksData();
      const tasksData =  res?.data || [];
      if (Array.isArray(tasksData)) {
        setTasks(tasksData);
      } else {
        setTasks([]);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {
      setBatchesLoading(true);
      // const res = await axiosPrivate.get('http://localhost:3000/api/batches');
      const res = await getBatchesData();
      const batchesData =  res?.data || [];
      if (Array.isArray(batchesData)) {
        setBatches(batchesData);
      } else {
        setBatches([]);
      }
    } catch (err) {
      console.error('Failed to load batches:', err);
      setBatches([
        { _id: '1', batchName: 'Choose Batch' }
      ]);
    } finally {
      setBatchesLoading(false);
    }
  };

  const fetchModules = async () => {
    try {
      console.log("fetchModules");

      setModulesLoading(true);
      // const res = await axiosPrivate.get('http://localhost:3000/api/module');
      const res = await getModulesData();
      console.log("modules==", res.data);

      const modulesData =  res?.data || [];
      if (Array.isArray(modulesData)) {
        setModules(modulesData);
      } else {
        setModules([]);
      }
    } catch (err) {
      console.error('Failed to load modules:', err);
      setModules([
        { _id: '1', moduleName: 'Choose Module' }
      ]);
    } finally {
      setModulesLoading(false);
    }
  };

  const fetchMentors = async () => {
    try {
      setMentorsLoading(true);
      // const res = await axiosPrivate.get('http://localhost:3000/api/mentor');
      const res = await getMentorsData();
      const mentorsData =  res?.data || [];
      if (Array.isArray(mentorsData)) {
        setMentors(mentorsData);
      } else {
        setMentors([]);
      }
    } catch (err) {
      console.error('Failed to load mentors:', err);
      setMentors([
        { _id: '1', fullName: 'Choose Mentor' }
      ]);
    } finally {
      setMentorsLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchTasks();
    fetchBatches();
    fetchModules();
    fetchMentors();
  }, []);

  // Clear messages when switching tabs
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [activeTab]);

  // Filter tasks based on search term
  const filteredTasks = (tasks || []).filter(task =>
    task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.batch?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.module?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assignedMentor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsEditMode(true);
    setFormData({
      title: task.title || "",
      batch: task.batch || "",
      module: task.module || "",
      assignedMentor: task.assignedMentor || "",
      startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : "",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
      description: task.description || "",
      attachments: task.attachments || "",
      totalMarks: task.totalMarks || "",
      achievedMarks: task.achievedMarks || "",
      status: task.status || "",
    });
    setActiveTab('new-task');
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setIsEditMode(false);
    setFormData({});
    setActiveTab('tasks-list');
  };

  // Handle form submission
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    console.log('Form submission started');
    console.log('Is edit mode:', isEditMode);
    console.log('Editing task:', editingTask);

    const formDataObj = new FormData(e.currentTarget);
    
    // Handle attachments properly
    const attachmentsFile = formDataObj.get('attachments');
    let attachmentsValue = undefined;
    if (attachmentsFile && attachmentsFile.size > 0) {
      // If a file is selected, you might want to handle file upload here
      // For now, we'll just use the file name
      attachmentsValue = attachmentsFile.name;
    }
    
    const payload = {
      title: formDataObj.get('title') || undefined,
      batch: formDataObj.get('batch') || undefined,
      module: formDataObj.get('module') || undefined,
      assignedMentor: formDataObj.get('assignedMentor') || undefined,
      startDate: formDataObj.get('startDate') || undefined,
      dueDate: formDataObj.get('dueDate') || undefined,
      description: formDataObj.get('description') || undefined,
      attachments: attachmentsValue,
      totalMarks: formDataObj.get('totalMarks') || undefined,
      achievedMarks: formDataObj.get('achievedMarks') || undefined,
      status: formDataObj.get('status') || undefined
    };

    try {
      setLoading(true);
      let res;
      if (isEditMode && editingTask) {
        // Update existing task
        console.log('Updating task with payload:', payload);
        // res = await axiosPrivate.put(`http://localhost:3000/api/tasks/${editingTask._id}`, payload);
        const res = await putTasksData(editingTask._id, payload);
        console.log('Update response:', res);
        
        if (res.status === 200 || res.status === 201) {
          setSuccess('Task updated successfully!');
          setError(''); // Clear any previous errors
        } else {
          throw new Error('Update request failed with status: ' + res.status);
        }
      } else {
        // Create new task
        console.log('Creating task with payload:', payload);
        // res = await axiosPrivate.post('http://localhost:3000/api/tasks', payload);
        const res = await postTasksData(payload);
        console.log('Create response:', res);
        
        if (res.status === 200 || res.status === 201) {
          setSuccess('Task created successfully!');
          setError(''); // Clear any previous errors
        } else {
          throw new Error('Create request failed with status: ' + res.status);
        }
      }
      
      await fetchTasks(); // Refresh the list
      setActiveTab('tasks-list'); // Switch to tasks list tab
      setEditingTask(null);
      setIsEditMode(false);
      setFormData({});
    } catch (err) {
      console.error('Task operation error:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      
      // More specific error handling
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError(`Failed to ${isEditMode ? 'update' : 'create'} task`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar headData={headData} activeTab={activeTab} />
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
        {activeTab === 'tasks-list' ? (
          <div id="tasks-list-content">
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
                    placeholder="Search Tasks"
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

            {/* Tasks Table */}
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading tasks...</p>
                </div>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="flex items-center justify-center p-12">
                <p className="text-gray-500 text-lg">
                  {searchTerm ? 'No tasks found matching your search.' : 'No tasks available. Please add tasks to view them here.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTasks.map((task, idx) => (
                      <tr key={task._id || idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <span className="text-orange-600 font-medium text-sm">
                                  {task.title?.charAt(0)?.toUpperCase() || 'T'}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{task.title}</div>
                              <div className="text-sm text-gray-500">ID: {task._id?.slice(-6) || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {task.batch}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            {task.module}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{task.assignedMentor}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            task.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : task.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : task.status === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditTask(task)}
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
        ) : (
          <div id="new-task-content">
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

            <form onSubmit={handleCreateTask} className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditMode ? `Edit Task - ${editingTask?.title}` : 'Task Details'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    name="title"
                    type="text"
                    placeholder="Enter Task Title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Batch</label>
                  <select
                    name="batch"
                    value={formData.batch || ''}
                    onChange={(e) => setFormData(prev => ({...prev, batch: e.target.value}))}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    disabled={batchesLoading}
                    required
                  >
                    {batchesLoading ? (
                      <option>Loading batches...</option>
                    ) : (
                      (batches || []).map(batch => (
                        <option key={batch._id} value={batch.batchName}>
                          {batch.batchName}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Module</label>
                  <select
                    name="module"
                    value={formData.module || ''}
                    onChange={(e) => setFormData(prev => ({...prev, module: e.target.value}))}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    disabled={modulesLoading}
                    required
                  >
                    {modulesLoading ? (
                      <option>Loading modules...</option>
                    ) : (
                      (modules || []).map(module => (
                        <option key={module._id} value={module.moduleName}>
                          {module.moduleName}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned Mentor</label>
                  <select
                    name="assignedMentor"
                    value={formData.assignedMentor || ''}
                    onChange={(e) => setFormData(prev => ({...prev, assignedMentor: e.target.value}))}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    disabled={mentorsLoading}
                    required
                  >
                    {mentorsLoading ? (
                      <option>Loading mentors...</option>
                    ) : (
                      (mentors || []).map(mentor => (
                        <option key={mentor._id} value={mentor.fullName}>
                          {mentor.fullName}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <div className="relative mt-1">
                    <input
                      name="startDate"
                      type="date"
                      value={formData.startDate || ''}
                      onChange={(e) => setFormData(prev => ({...prev, startDate: e.target.value}))}
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <CalendarIcon />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Due Date</label>
                  <div className="relative mt-1">
                    <input
                      name="dueDate"
                      type="date"
                      value={formData.dueDate || ''}
                      onChange={(e) => setFormData(prev => ({...prev, dueDate: e.target.value}))}
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <CalendarIcon />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  placeholder="Enter Task Description"
                  rows="3"
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  required
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Attachments</label>
                  <div className="relative mt-1">
                    <input
                      name="attachments"
                      type="file"
                      className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <UploadIcon />
                    </div>
                    {formData.attachments && (
                      <p className="text-sm text-gray-500 mt-1">Current: {formData.attachments}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Marks</label>
                  <input
                    name="totalMarks"
                    type="number"
                    placeholder="Enter Total Marks"
                    value={formData.totalMarks || ''}
                    onChange={(e) => setFormData(prev => ({...prev, totalMarks: e.target.value}))}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Achieved Marks</label>
                  <input
                    name="achievedMarks"
                    type="number"
                    placeholder="Enter Achieved Marks"
                    value={formData.achievedMarks || ''}
                    onChange={(e) => setFormData(prev => ({...prev, achievedMarks: e.target.value}))}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status || ''}
                  onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="">Choose Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="py-2 px-6 rounded-lg bg-white border border-gray-300 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2 px-6 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed"
                >
                  {loading 
                    ? (isEditMode ? 'Updating...' : 'Creating...') 
                    : (isEditMode ? 'Update Task' : 'Create Task')
                  }
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  )
}

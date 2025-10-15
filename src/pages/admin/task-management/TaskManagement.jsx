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
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [batchesLoading, setBatchesLoading] = useState(false);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [mentorsLoading, setMentorsLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [interns, setInterns] = useState([]);
  const [internsLoading, setInternsLoading] = useState(false);
  const [internSearchTerm, setInternSearchTerm] = useState('');
  const [selectedInterns, setSelectedInterns] = useState([]);
  const [batchSearchTerm, setBatchSearchTerm] = useState('');
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

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

  const { getBatchesData, getModulesData, getStaffData, getTasksData, putTasksData, postTasksData, getInternsData, getCoursesData, deleteTasksData } = AdminService();

  // API functions to fetch data
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      // const res = await axiosPrivate.get('http://localhost:3000/api/tasks');
      const res = await getTasksData();
      console.log("tasks data==", res.data);
      const tasksData =  res?.data || [];
      if (Array.isArray(tasksData)) {
        // Log the first task to see its structure
        if (tasksData.length > 0) {
          console.log("First task structure:", tasksData[0]);
          console.log("First task batches:", tasksData[0].batches);
          console.log("First task courses:", tasksData[0].courses);
          console.log("First task individualInterns:", tasksData[0].individualInterns);
        }
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
      const res = await getStaffData();
      console.log("staff data==", res?.data);
      const staffData = res?.data || [];
      if (Array.isArray(staffData)) {
        // Filter only mentors from staff data
        const mentorsData = staffData.filter(staff => 
          staff.typeOfEmployee === 'Mentor' && staff.employmentStatus === 'Active'
        );
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

  const fetchInterns = async () => {
    try {
      setInternsLoading(true);
      const res = await getInternsData();
      const internsData = res?.data || [];
      if (Array.isArray(internsData)) {
        setInterns(internsData);
      } else {
        setInterns([]);
      }
    } catch (err) {
      console.error('Failed to load interns:', err);
      setInterns([]);
    } finally {
      setInternsLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      const res = await getCoursesData();
      const coursesData = res?.data || [];
      if (Array.isArray(coursesData)) {
        setCourses(coursesData);
      } else {
        setCourses([]);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchTasks();
    fetchBatches();
    fetchModules();
    fetchMentors();
  }, []);

  // Handle data population when editing task and data becomes available
  useEffect(() => {
    if (isEditMode && editingTask) {
      // Re-populate selections when data becomes available
      if (editingTask.audience === "By batches" && editingTask.batches && editingTask.batches.length > 0 && batches.length > 0) {
        const selectedBatchObjects = editingTask.batches.map(batch => {
          if (typeof batch === 'object' && batch._id) {
            return batch;
          } else {
              return batches.find(b => b._id === batch);
          }
        }).filter(Boolean);
        if (selectedBatchObjects.length > 0) {
          setSelectedBatches(selectedBatchObjects);
        }
      }
      
      if (editingTask.audience === "By courses" && editingTask.courses && editingTask.courses.length > 0 && courses.length > 0) {
        const selectedCourseObjects = editingTask.courses.map(course => {
          if (typeof course === 'object' && course._id) {
            return course;
          } else {
            return courses.find(c => c._id === course);
          }
        }).filter(Boolean);
        if (selectedCourseObjects.length > 0) {
          setSelectedCourses(selectedCourseObjects);
        }
      }
      
      if (editingTask.audience === "Individual interns" && editingTask.individualInterns && editingTask.individualInterns.length > 0 && interns.length > 0) {
        const selectedInternObjects = editingTask.individualInterns.map(intern => {
          if (typeof intern === 'object' && intern._id) {
            return intern;
          } else {
            return interns.find(i => i._id === intern);
          }
        }).filter(Boolean);
        if (selectedInternObjects.length > 0) {
          setSelectedInterns(selectedInternObjects);
        }
      }
    }
  }, [isEditMode, editingTask, batches, courses, interns]);

  // Clear messages when switching tabs
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [activeTab]);

  // Filter tasks based on search term
  const filteredTasks = (tasks || []).filter(task =>
    task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.taskType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.module?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assignedMentor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsEditMode(true);
    
    // Find mentor name from mentor ID
    const mentorName = task.assignedMentor ? 
      (typeof task.assignedMentor === 'object' ? task.assignedMentor.fullName : 
       mentors.find(mentor => mentor._id === task.assignedMentor)?.fullName || '') : '';
    
    setFormData({
      title: task.title || "",
      taskType: task.taskType || "",
      module: task.module || "",
      assignedMentor: mentorName,
      startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : "",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
      description: task.description || "",
      attachments: task.attachments || "",
      totalMarks: task.totalMarks || "",
      achievedMarks: task.achievedMarks || "",
      status: task.status || "",
      audience: task.audience || "",
    });
    
    // Clear all selected items first
    setSelectedBatches([]);
    setSelectedCourses([]);
    setSelectedInterns([]);
    
    // Set selected items based on task data and audience type
    if (task.audience === "By batches" && task.batches && task.batches.length > 0) {
      console.log('Task batches data:', task.batches);
      // Check if batches are already populated objects or just IDs
      const selectedBatchObjects = task.batches.map(batch => {
        if (typeof batch === 'object' && batch._id) {
          // Already populated object
          return batch;
        } else {
          // ID string, find in local batches array
          return batches.find(b => b._id === batch);
        }
      }).filter(Boolean);
      console.log('Selected batch objects:', selectedBatchObjects);
      setSelectedBatches(selectedBatchObjects);
    }
    
    if (task.audience === "By courses" && task.courses && task.courses.length > 0) {
      console.log('Task courses data:', task.courses);
      // Check if courses are already populated objects or just IDs
      const selectedCourseObjects = task.courses.map(course => {
        if (typeof course === 'object' && course._id) {
          // Already populated object
          return course;
        } else {
          // ID string, find in local courses array
          return courses.find(c => c._id === course);
        }
      }).filter(Boolean);
      console.log('Selected course objects:', selectedCourseObjects);
      setSelectedCourses(selectedCourseObjects);
    }
    
    if (task.audience === "Individual interns" && task.individualInterns && task.individualInterns.length > 0) {
      console.log('Task individualInterns data:', task.individualInterns);
      // Check if interns are already populated objects or just IDs
      const selectedInternObjects = task.individualInterns.map(intern => {
        if (typeof intern === 'object' && intern._id) {
          // Already populated object
          return intern;
        } else {
          // ID string, find in local interns array
          return interns.find(i => i._id === intern);
        }
      }).filter(Boolean);
      console.log('Selected intern objects:', selectedInternObjects);
      setSelectedInterns(selectedInternObjects);
    }
    
    // Load data if needed based on audience type
    if (task.audience === "Individual interns" && interns.length === 0) {
      fetchInterns();
    }
    if (task.audience === "By courses" && courses.length === 0) {
      fetchCourses();
    }
    
    setActiveTab('new-task');
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setIsEditMode(false);
    setFormData({});
    setSelectedInterns([]);
    setInternSearchTerm('');
    setSelectedBatches([]);
    setBatchSearchTerm('');
    setSelectedCourses([]);
    setCourseSearchTerm('');
    setActiveTab('tasks-list');
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    
    try {
      setLoading(true);
      setError('');
      
      const res = await deleteTasksData(taskToDelete._id);
      console.log('Delete response:', res);
      
      if (res.status === 200 || res.status === 201) {
        setSuccess('Task deleted successfully!');
        setError('');
        // Refresh the tasks list
        await fetchTasks();
        // Close modal
        setShowDeleteModal(false);
        setTaskToDelete(null);
      } else {
        throw new Error('Delete request failed with status: ' + res.status);
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to delete task');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const handleInternSearch = (searchTerm) => {
    setInternSearchTerm(searchTerm);
  };

  const handleInternSelect = (intern) => {
    const isSelected = selectedInterns.find(selected => selected._id === intern._id);
    if (isSelected) {
      setSelectedInterns(selectedInterns.filter(selected => selected._id !== intern._id));
      setSuccess(`Removed ${intern.fullName} from selection`);
    } else {
      setSelectedInterns([...selectedInterns, intern]);
      setSuccess(`Added ${intern.fullName} to selection`);
    }
    // Clear success message after 2 seconds
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleBatchSearch = (searchTerm) => {
    setBatchSearchTerm(searchTerm);
  };

  const handleBatchSelect = (batch) => {
    const isSelected = selectedBatches.find(selected => selected._id === batch._id);
    if (isSelected) {
      setSelectedBatches(selectedBatches.filter(selected => selected._id !== batch._id));
      setSuccess(`Removed ${batch.batchName} from selection`);
    } else {
      setSelectedBatches([...selectedBatches, batch]);
      setSuccess(`Added ${batch.batchName} to selection`);
    }
    // Clear success message after 2 seconds
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleCourseSearch = (searchTerm) => {
    setCourseSearchTerm(searchTerm);
  };

  const handleCourseSelect = (course) => {
    const isSelected = selectedCourses.find(selected => selected._id === course._id);
    if (isSelected) {
      setSelectedCourses(selectedCourses.filter(selected => selected._id !== course._id));
      setSuccess(`Removed ${course.courseName} from selection`);
    } else {
      setSelectedCourses([...selectedCourses, course]);
      setSuccess(`Added ${course.courseName} to selection`);
    }
    // Clear success message after 2 seconds
    setTimeout(() => setSuccess(''), 2000);
  };

  // Clear all functions
  const handleClearAllInterns = () => {
    setSelectedInterns([]);
    setSuccess('Cleared all selected interns');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleClearAllBatches = () => {
    setSelectedBatches([]);
    setSuccess('Cleared all selected batches');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleClearAllCourses = () => {
    setSelectedCourses([]);
    setSuccess('Cleared all selected courses');
    setTimeout(() => setSuccess(''), 2000);
  };

  const filteredInterns = interns.filter(intern =>
    intern.fullName?.toLowerCase().includes(internSearchTerm.toLowerCase()) ||
    intern.email?.toLowerCase().includes(internSearchTerm.toLowerCase())
  );

  const filteredBatches = batches.filter(batch =>
    batch.batchName?.toLowerCase().includes(batchSearchTerm.toLowerCase()) ||
    batch.description?.toLowerCase().includes(batchSearchTerm.toLowerCase())
  );

  const filteredCourses = courses.filter(course =>
    course.courseName?.toLowerCase().includes(courseSearchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(courseSearchTerm.toLowerCase())
  );

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
    
    // Find the mentor ID from the selected mentor name
    const selectedMentorName = formDataObj.get('assignedMentor');
    const selectedMentor = mentors.find(mentor => mentor.fullName === selectedMentorName);
    const mentorId = selectedMentor ? selectedMentor._id : undefined;

    // Ensure dates are properly formatted
    const startDateValue = formDataObj.get('startDate');
    const dueDateValue = formDataObj.get('dueDate');
    
    // Convert dates to ISO string format to avoid timezone issues
    const startDate = startDateValue ? new Date(startDateValue + 'T00:00:00.000Z').toISOString() : undefined;
    const dueDate = dueDateValue ? new Date(dueDateValue + 'T23:59:59.999Z').toISOString() : undefined;

    // Client-side validation for dates
    if (startDateValue && dueDateValue) {
      const startDateObj = new Date(startDateValue);
      const dueDateObj = new Date(dueDateValue);
      
      if (startDateObj >= dueDateObj) {
        setError('Due date must be after start date');
        setLoading(false);
        return;
      }
    }

    const payload = {
      title: formDataObj.get('title') || undefined,
      taskType: formDataObj.get('taskType') || undefined,
      module: formDataObj.get('module') || undefined,
      assignedMentor: mentorId,
      startDate: startDate,
      dueDate: dueDate,
      description: formDataObj.get('description') || undefined,
      attachments: attachmentsValue,
      totalMarks: formDataObj.get('totalMarks') || undefined,
      achievedMarks: formDataObj.get('achievedMarks') || undefined,
      status: formDataObj.get('status') || undefined,
      audience: formDataObj.get('audience') || undefined,
      batches: selectedBatches.length > 0 ? selectedBatches.map(batch => batch._id) : [],
      courses: selectedCourses.length > 0 ? selectedCourses.map(course => course._id) : [],
      interns: [], // This field is for general interns, not individual ones
      individualInterns: selectedInterns.length > 0 ? selectedInterns.map(intern => intern._id) : []
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
      setSelectedInterns([]);
      setInternSearchTerm('');
      setSelectedBatches([]);
      setBatchSearchTerm('');
      setSelectedCourses([]);
      setCourseSearchTerm('');
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task Type</th>
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
                            {task.taskType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            {task.module}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {typeof task.assignedMentor === 'object' ? task.assignedMentor.fullName : 
                           mentors.find(mentor => mentor._id === task.assignedMentor)?.fullName || task.assignedMentor || 'N/A'}
                        </td>
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
                            <button 
                              onClick={() => handleDeleteClick(task)}
                              className="text-red-600 hover:text-red-900"
                              disabled={loading}
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
                  <label className="block text-sm font-medium text-gray-700">Task Type</label>
                  <select
                    name="taskType"
                    value={formData.taskType || ''}
                    onChange={(e) => setFormData(prev => ({...prev, taskType: e.target.value}))}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Choose Task Type</option>
                    <option value="Weekly Task">Weekly Task</option>
                    <option value="Daily Task">Daily Task</option>
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
                    <option value="">Choose Mentor</option>
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
                  className="mt-1 block w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="">Choose Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {/* Task Details Section */}
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Task Details</h4>
                
                {/* Debug Information - Only show in edit mode */}
                {/* {isEditMode && editingTask && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="text-sm font-medium text-yellow-800 mb-2">Debug Information</h5>
                    <div className="text-xs text-yellow-700 space-y-1">
                      <div>Audience: {editingTask.audience}</div>
                      <div>Batches: {editingTask.batches ? editingTask.batches.length : 0} items</div>
                      <div>Courses: {editingTask.courses ? editingTask.courses.length : 0} items</div>
                      <div>Individual Interns: {editingTask.individualInterns ? editingTask.individualInterns.length : 0} items</div>
                      <div>Selected Batches: {selectedBatches.length}</div>
                      <div>Selected Courses: {selectedCourses.length}</div>
                      <div>Selected Interns: {selectedInterns.length}</div>
                    </div>
                  </div>
                )} */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Audience</label>
                    <select
                      name="audience"
                      value={formData.audience || ''}
                      onChange={(e) => {
                        setFormData(prev => ({...prev, audience: e.target.value}));
                        if (e.target.value === 'Individual interns') {
                          fetchInterns();
                        } else if (e.target.value === 'By courses') {
                          fetchCourses();
                        }
                      }}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      <option value="">Choose Audience</option>
                      <option value="All interns">All interns</option>
                      <option value="By batches">By batches</option>
                      <option value="By courses">By courses</option>
                      <option value="Individual interns">Individual interns</option>
                    </select>
                  </div>
                </div>

                {/* Intern Search Section - Only show when Individual interns is selected */}
                {formData.audience === 'Individual interns' && (
                  <div className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Search Section */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Interns</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={internSearchTerm}
                            onChange={(e) => handleInternSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        
                        {/* Search Results */}
                        <div className="mt-4 max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                          {internsLoading ? (
                            <div className="p-4 text-center text-gray-500">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-2"></div>
                              Loading interns...
                            </div>
                          ) : filteredInterns.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              {internSearchTerm ? 'No interns found matching your search.' : 'No interns available.'}
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {filteredInterns.map((intern) => {
                                const isSelected = selectedInterns.find(selected => selected._id === intern._id);
                                return (
                                  <div
                                    key={intern._id}
                                    onClick={() => handleInternSelect(intern)}
                                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                                      isSelected ? 'bg-orange-50 border-orange-200' : ''
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">{intern.fullName}</div>
                                        <div className="text-xs text-gray-500">{intern.email}</div>
                                      </div>
                                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                        isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                                      }`}>
                                        {isSelected && (
                                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                          </svg>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Selected Interns */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Selected Interns ({selectedInterns.length})
                          </label>
                          {selectedInterns.length > 0 && (
                            <button
                              type="button"
                              onClick={handleClearAllInterns}
                              className="text-xs text-red-600 hover:text-red-800 font-medium"
                            >
                              Clear All
                            </button>
                          )}
                        </div>
                        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md bg-gray-50 p-3">
                          {selectedInterns.length === 0 ? (
                            <div className="text-center text-gray-500 py-4">
                              <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                              </svg>
                              No interns selected
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {selectedInterns.map((intern) => (
                                <div key={intern._id} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-blue-600 font-medium text-sm">
                                        {intern.fullName?.charAt(0)?.toUpperCase() || 'I'}
                                      </span>
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{intern.fullName}</div>
                                      <div className="text-xs text-gray-500">{intern.email}</div>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleInternSelect(intern)}
                                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                                    title="Remove from selection"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Batch Search Section - Only show when By batches is selected */}
                {formData.audience === 'By batches' && (
                  <div className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Search Section */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Batches</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search by batch name or description..."
                            value={batchSearchTerm}
                            onChange={(e) => handleBatchSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        
                        {/* Search Results */}
                        <div className="mt-4 max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                          {batchesLoading ? (
                            <div className="p-4 text-center text-gray-500">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-2"></div>
                              Loading batches...
                            </div>
                          ) : filteredBatches.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              {batchSearchTerm ? 'No batches found matching your search.' : 'No batches available.'}
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {filteredBatches.map((batch) => {
                                const isSelected = selectedBatches.find(selected => selected._id === batch._id);
                                return (
                                  <div
                                    key={batch._id}
                                    onClick={() => handleBatchSelect(batch)}
                                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                                      isSelected ? 'bg-orange-50 border-orange-200' : ''
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">{batch.batchName}</div>
                                        <div className="text-xs text-gray-500">{batch.description || 'No description'}</div>
                                      </div>
                                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                        isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                                      }`}>
                                        {isSelected && (
                                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                          </svg>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Selected Batches */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Selected Batches ({selectedBatches.length})
                          </label>
                          {selectedBatches.length > 0 && (
                            <button
                              type="button"
                              onClick={handleClearAllBatches}
                              className="text-xs text-red-600 hover:text-red-800 font-medium"
                            >
                              Clear All
                            </button>
                          )}
                        </div>
                        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md bg-gray-50 p-3">
                          {selectedBatches.length === 0 ? (
                            <div className="text-center text-gray-500 py-4">
                              <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                              </svg>
                              No batches selected
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {selectedBatches.map((batch) => (
                                <div key={batch._id} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:bg-green-50 transition-colors">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-green-600 font-medium text-sm">
                                        {batch.batchName?.charAt(0)?.toUpperCase() || 'B'}
                                      </span>
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{batch.batchName}</div>
                                      <div className="text-xs text-gray-500">{batch.description || 'No description'}</div>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleBatchSelect(batch)}
                                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                                    title="Remove from selection"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Course Search Section - Only show when By courses is selected */}
                {formData.audience === 'By courses' && (
                  <div className="mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Search Section */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Courses</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search by course name or description..."
                            value={courseSearchTerm}
                            onChange={(e) => handleCourseSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                            </svg>
                          </div>
                        </div>
                        
                        {/* Search Results */}
                        <div className="mt-4 max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                          {coursesLoading ? (
                            <div className="p-4 text-center text-gray-500">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-2"></div>
                              Loading courses...
                            </div>
                          ) : filteredCourses.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              {courseSearchTerm ? 'No courses found matching your search.' : 'No courses available.'}
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {filteredCourses.map((course) => {
                                const isSelected = selectedCourses.find(selected => selected._id === course._id);
                                return (
                                  <div
                                    key={course._id}
                                    onClick={() => handleCourseSelect(course)}
                                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                                      isSelected ? 'bg-orange-50 border-orange-200' : ''
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">{course.courseName}</div>
                                        <div className="text-xs text-gray-500">{course.description || 'No description'}</div>
                                      </div>
                                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                        isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
                                      }`}>
                                        {isSelected && (
                                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                          </svg>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Selected Courses */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Selected Courses ({selectedCourses.length})
                          </label>
                          {selectedCourses.length > 0 && (
                            <button
                              type="button"
                              onClick={handleClearAllCourses}
                              className="text-xs text-red-600 hover:text-red-800 font-medium"
                            >
                              Clear All
                            </button>
                          )}
                        </div>
                        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md bg-gray-50 p-3">
                          {selectedCourses.length === 0 ? (
                            <div className="text-center text-gray-500 py-4">
                              <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.433 9.496 5 8 5c-4 0-8 3-8 8s4 8 8 8c.94 0 1.841-.213 2.684-.606m3.56-5.894C15.687 7.159 15.589 8 15 8s-1.5-.5-1.5-.5V5a2 2 00-2-2h-2c-1.5 0-2 1-2 2v2.5M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.402 2.572-1.065z"></path>
                              </svg>
                              No courses selected
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {selectedCourses.map((course) => (
                                <div key={course._id} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:bg-purple-50 transition-colors">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                      <span className="text-purple-600 font-medium text-sm">
                                        {course.courseName?.charAt(0)?.toUpperCase() || 'C'}
                                      </span>
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{course.courseName}</div>
                                      <div className="text-xs text-gray-500">{course.description || 'No description'}</div>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleCourseSelect(course)}
                                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                                    title="Remove from selection"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

               
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delete Task
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to delete this task? This action cannot be undone.
                </p>
                
                {taskToDelete && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-gray-900">{taskToDelete.title}</p>
                    <p className="text-xs text-gray-500">
                      {taskToDelete.taskType} • {taskToDelete.status}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Modal Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </div>
                  ) : (
                    'Delete Task'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

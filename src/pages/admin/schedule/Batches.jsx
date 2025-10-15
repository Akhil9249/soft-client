import React, { useState, useEffect } from 'react'
import Tabs from '../../../components/button/Tabs';
import { Navbar } from '../../../components/admin/AdminNavBar';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import AdminService from '../../../services/admin-api-service/AdminService';
import { axiosPrivate } from '../../../axios';

export const Batches = () => {

  // State to manage the active tab. 'batches' is the default.
  const [activeTab, setActiveTab] = useState('batches');
  const [branches, setBranches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [addedInterns, setAddedInterns] = useState([]);
  const [availableInterns, setAvailableInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState('');
  const [selectedInternData, setSelectedInternData] = useState(null);
  const [internSearchTerm, setInternSearchTerm] = useState('');
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [internAdmissionNumber, setInternAdmissionNumber] = useState('');
  const [internCourseName, setInternCourseName] = useState('');
  const [editingBatch, setEditingBatch] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [deletingBatch, setDeletingBatch] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { getBranchesData, getCoursesData, getBatchesData, getInternsData,getInternsDataSearch, postBatchesData, putBatchesData, deleteBatchesData } = AdminService();

  const tabOptions = [
    { value: "batches", label: "Batches" },
    { value: "new-batch", label: "New Batch" }
  ];

  const headData = "Batch Management"

  const fetchBranches = async () => {
    try {

      setLoading(true);
      setError('');
      // const res = await axiosPrivate.get('http://localhost:3000/api/branches');
      const res = await getBranchesData();

      setBranches(res.data || []);
    } catch (err) {
      console.error('Failed to load branches:', err);
      setError('Failed to load branches');
      // Set default branches if API fails
      setBranches([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      // const res = await axiosPrivate.get('/api/course');
      const res = await getCoursesData();
      setCourses(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    try {

      setLoading(true);
      setError('');
      // const res = await axiosPrivate.get('http://localhost:3000/api/batches');
      const res = await getBatchesData();

      setBatches(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  const fetchInterns = async () => {
    try {
      setLoading(true);
      setError('');
      // const res = await axiosPrivate.get('http://localhost:3000/api/intern');
      const res = await getInternsData();
      setAvailableInterns(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load interns');
    } finally {
      setLoading(false);
    }
  };

  const searchInterns = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredInterns([]);
      return;
    }

    try {
      setLoading(true);
      // const res = await axiosPrivate.get(`http://localhost:3000/api/intern/search?q=${encodeURIComponent(searchTerm)}`);
      const res = await getInternsDataSearch(searchTerm);
      // const res = await getInternsData(searchTerm);
      console.log("res======",res.data);
      setFilteredInterns(res.data || []);
    } catch (err) {
      console.error('Search error:', err);
      setFilteredInterns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchBatches();
    // fetchCourses();
    // fetchInterns();
  }, []);

  // Clear messages when switching tabs
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [activeTab]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (internSearchTerm.trim() !== '') {
        searchInterns(internSearchTerm);
      } else {
        setFilteredInterns([]);
      }
    }, 300); // 300ms delay

    return () => clearTimeout(timeoutId);
  }, [internSearchTerm]);


  // Filter batches based on search term
  const filteredBatches = batches.filter(batch =>
    batch.batchName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (typeof batch.branch === 'object' && batch.branch?.branchName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    batch.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addInternToList = (intern) => {
    console.log('Adding intern to list:', intern);
    console.log('Intern ID:', intern._id);
    console.log('Current filteredInterns:', filteredInterns);
    
    // Store the selected intern data separately
    setSelectedInternData(intern);
    
    // Just populate the input fields, don't add to list yet
    setInternSearchTerm('');
    setInternAdmissionNumber(intern.admissionNumber || '');
    setInternCourseName(intern.course?.courseName || '');
    setSelectedIntern(intern._id);
    
    console.log('Selected intern set to:', intern._id);
    console.log('Selected intern data stored:', intern);
  };

  const removeInternFromList = async (internId) => {
    try {
      setLoading(true);
      
      if (editingBatch && editingBatch._id) {
        // Edit mode: Make API call to remove intern from existing batch
        // await axiosPrivate.delete(`http://localhost:3000/api/batches/${editingBatch._id}/interns/${internId}`);
        await deleteBatchesData(editingBatch._id, internId);
        setSuccess('Intern removed successfully from batch.');
        
        // Update local state after successful backend removal
        setAddedInterns(addedInterns.filter(intern => intern._id !== internId));
      } else {
        // Create mode: Just remove from local list
        setAddedInterns(addedInterns.filter(intern => intern._id !== internId));
        setSuccess('Intern removed from local list.');
      }
    } catch (err) {
      console.error('Error removing intern:', err);
      setError(err?.response?.data?.message || 'Failed to remove intern.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditBatch = (batch) => {
    setEditingBatch(batch);
    setIsEditMode(true);
    
    // Handle different branch data structures
    let branchId = "";
    if (typeof batch.branch === 'object' && batch.branch) {
      branchId = batch.branch._id;
    } else if (typeof batch.branch === 'string') {
      branchId = batch.branch;
    }
    
    setFormData({
      batchName: batch.batchName || "",
      branchName: branchId,
      status: batch.status || "Active",
    });
    
    // Set existing interns if any
    if (batch.interns && batch.interns.length > 0) {
      setAddedInterns(batch.interns);
    } else {
      setAddedInterns([]);
    }
    setActiveTab('new-batch');
  };

  const handleCancelEdit = () => {
    setEditingBatch(null);
    setIsEditMode(false);
    setFormData({});
    setAddedInterns([]);
    setSelectedIntern('');
    setSelectedInternData(null);
    setInternSearchTerm('');
    setInternAdmissionNumber('');
    setInternCourseName('');
    setActiveTab('batches');
  };

  const handleDeleteBatch = (batch) => {
    setDeletingBatch(batch);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingBatch) return;

    try {
      setLoading(true);
      // await axiosPrivate.delete(`http://localhost:3000/api/batches/${deletingBatch._id}`);
      await deleteBatchesData(deletingBatch._id);
      setSuccess('Batch deleted successfully.');
      await fetchBatches();
      setShowDeleteModal(false);
      setDeletingBatch(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete batch');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingBatch(null);
  };

  const handleCreateBatch = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formDataObj = new FormData(e.currentTarget);

    const batchName = formDataObj.get('batchName');
    const branchName = formDataObj.get('branchName');
    const status = formDataObj.get('status');

    // Validate required fields
    if (!batchName || !branchName) {
      setError('Batch name and branch are required');
      return;
    }

    const payload = {
      batchName: batchName.trim(),
      branchName: branchName,
      status: status || 'Active',
      interns: addedInterns.map(intern => ({
        internId: intern._id
      }))
    };

    console.log('Creating batch with payload:', payload);
    console.log('Added interns:', addedInterns);

    try {
      setLoading(true);
      let res;
      if (isEditMode && editingBatch) {
        // Update existing batch
        // res = await axiosPrivate.put(`http://localhost:3000/api/batches/${editingBatch._id}`, payload);
        res = await putBatchesData(editingBatch._id, payload);
        setSuccess('Batch updated successfully.');
      } else {
        // Create new batch
        // res = await axiosPrivate.post('http://localhost:3000/api/batches', payload);
        res = await postBatchesData(payload);
        setSuccess('Batch created successfully.');
      }
      
      await fetchBatches();
      setActiveTab('batches');
      setEditingBatch(null);
      setIsEditMode(false);
      setFormData({});
      e.currentTarget.reset();
      setAddedInterns([]);
      setSelectedIntern('');
      setInternSearchTerm('');
      setInternAdmissionNumber('');
      setInternCourseName('');
    } catch (err) {
      setError(err?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} batch`);
    } finally {
      setLoading(false);
    }
  };
  console.log(filteredInterns,"filteredInterns");
  

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

  const SearchIcon = () => (
    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 01-14 0 7 7 0114 0z"></path></svg>
  );

  const FilterIcon = () => (
    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 01-1-1v1a1 1 0002 0V3a1 1 000-2 2zM9 4a1 1 01-1-1v1a1 1 0002 0V3a1 1 000-2 2zM15 4a1 1 01-1-1v1a1 1 0002 0V3a1 1 000-2 2zM21 4a1 1 01-1-1v1a1 1 0002 0V3a1 1 000-2 2zM3 10a1 1 01-1-1v1a1 1 0002 0V9a1 1 000-2 2zM9 10a1 1 01-1-1v1a1 1 0002 0V9a1 1 000-2 2zM15 10a1 1 01-1-1v1a1 1 0002 0V9a1 1 000-2 2zM21 10a1 1 01-1-1v1a1 1 0002 0V9a1 1 000-2 2zM3 16a1 1 01-1-1v1a1 1 0002 0v-1a1 1 000-2 2zM9 16a1 1 01-1-1v1a1 1 0002 0v-1a1 1 000-2 2zM15 16a1 1 01-1-1v1a1 1 0002 0v-1a1 1 000-2 2zM21 16a1 1 01-1-1v1a1 1 0002 0v-1a1 1 000-2 2z"></path></svg>
  );

  const EyeIcon = () => (
    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 01-6 0 3 3 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
  );

  const EditIcon = () => (
    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.232a4 4 015.657 5.657l-10 10c-.23.23-.493.385-.773.47L5 19l.711-2.133c.085-.28.24-.543.47-.773l10-10z"></path></svg>
  );

  const TrashIcon = () => (
    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0017.13 21H6.87a2 2 001.864-1.858L5 7m4 4v6m4-6v6m-4-6h.01M21 7H3M4 7h16"></path></svg>
  );

  const ArrowRightIcon = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
  );

  const ArrowLeftIcon = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
  );


  return (
    <>

      <Navbar headData={headData} activeTab={activeTab} />
      <div className="flex justify-between items-center ">
        <div className="mb-6">
          <Tabs tabs={tabOptions} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="flex justify-end ">
          {/* <button className="flex items-center py-2 px-4 bg-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
              <ExportIcon />
              Export
            </button> */}
          <button className="flex items-center px-4 py-2 bg-white text-gray-600 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">

        {/* Tab content */}
        {activeTab === 'batches' ? (
          <div id="batches-list-content">
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
                    placeholder="Search Batches"
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

            {/* Batches Table */}
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading batches...</p>
                </div>
              </div>
            ) : filteredBatches.length === 0 ? (
              <div className="flex items-center justify-center p-12">
                <p className="text-gray-500 text-lg">
                  {searchTerm ? 'No batches found matching your search.' : 'No batches available. Please add batches to view them here.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Interns</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBatches.map((batch, idx) => (
                      <tr key={batch._id || idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{idx + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <span className="text-orange-600 font-medium text-sm">
                                  {batch.batchName?.charAt(0)?.toUpperCase() || 'B'}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{batch.batchName}</div>
                              <div className="text-sm text-gray-500">ID: {batch._id?.slice(-6) || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {typeof batch.branch === 'object' && batch.branch ? batch.branch.branchName : 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            batch.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : batch.status === 'Inactive'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {batch.status}
                          </span>
                        </td>
                        <td className="px-6 py-4  whitespace-nowrap">
                          <div className="text-sm  text-gray-900">{batch.totalInterns || 0}</div>
                          {batch.interns && batch.interns.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              {/* {batch.interns.slice(0, 2).map(intern => intern.fullName).join(', ')} */}
                              {batch.interns?.length > 2 && ` +${batch.interns?.length - 2} more`}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {batch.createdAt ? new Date(batch.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditBatch(batch)}
                              className="text-orange-600 hover:text-orange-900"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteBatch(batch)}
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
        ) : (
          <div id="new-batch-content">
            <form onSubmit={handleCreateBatch} className="space-y-6">
              {error && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>
              )}
              {success && (
                <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded">{success}</div>
              )}
              <div>
                <h3 className="text-lg font-bold mb-4">
                  {isEditMode ? `Edit Batch - ${editingBatch?.batchName}` : 'Batch Details'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Batch Name</label>
                    <input 
                      name="batchName" 
                      type="text" 
                      placeholder="Enter Batch Name" 
                      value={formData.batchName || ''}
                      onChange={(e) => setFormData(prev => ({...prev, batchName: e.target.value}))}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Branch Name</label>
                    <select 
                      name="branchName" 
                      value={formData.branchName || ''}
                      onChange={(e) => setFormData(prev => ({...prev, branchName: e.target.value}))}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" 
                      required
                    >
                      <option value="">Choose Branch</option>
                      {branches.map(branch => (
                        <option key={branch._id} value={branch._id}>{branch.branchName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Interns</label>
                    <input 
                      type="text" 
                      placeholder={addedInterns.length} 
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500" 
                      readOnly 
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select 
                    name="status" 
                    value={formData.status || 'Active'}
                    onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Intern Assignment</h3>
                <div className="space-y-4">
                  {/* Three fields in same row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Search Interns</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search by name, email, or course..."
                          value={internSearchTerm}
                          onChange={(e) => setInternSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Intern Admission Number</label>
                      <input
                        type="text"
                        placeholder="Enter admission number"
                        value={internAdmissionNumber}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Intern Course Name</label>
                      <input
                        type="text"
                        placeholder="Enter course name"
                        value={internCourseName}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  
                  {/* Search Results */}
                  {internSearchTerm.trim() !== '' && (
                    <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto">
                      {loading ? (
                        <div className="p-4 text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-2"></div>
                          <p className="text-gray-500">Searching interns...</p>
                        </div>
                      ) : filteredInterns
                        .filter(intern => !addedInterns?.find(ai => ai._id === intern?._id))
                        .length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          No interns found matching your search.
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200">
                          {filteredInterns
                            .filter(intern => !addedInterns?.find(ai => ai._id === intern?._id))
                            .map(intern => (
                              <div key={intern._id} className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{intern?.fullName}</div>
                                  {/* <div className="text-sm text-gray-500">{intern.email}</div> */}
                                  <div className="text-sm text-gray-500">{intern?.course?.courseName}</div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => addInternToList(intern)}
                                  className="ml-4 px-3 py-1 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600 transition-colors"
                                >
                                  Add
                                </button>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add Intern Button */}
                  <div className="flex justify-end">
                    <button 
                      type="button" 
                      onClick={async () => {
                        if (selectedIntern) {
                          try {
                            setLoading(true);
                           
                            
                            // Prepare intern data for backend - only send internId
                            let internData;
                            if (selectedIntern) {
                              console.log(filteredInterns,"filteredInterns");
                              console.log(selectedIntern,"selectedIntern");
                              
                              // Send only the intern ID to backend
                              internData = {
                                internId: selectedIntern
                              };
                            } else {
                              // Manual entry - create a new intern first
                              setError('Please select an intern from the search results to add to the batch');
                              return;
                            }
                            
                            console.log("first");
                            
                            // Handle both edit mode and create mode
                            if (editingBatch && editingBatch._id) {
                              // Edit mode: Make API call to add intern to existing batch
                              console.log('Making API call to add intern:', internData);
                              const response = await axiosPrivate.post(`http://localhost:3000/api/batches/${editingBatch._id}/interns`, internData);
                              
                              console.log('API response:', response);
                              console.log('Response data:', response.data);
                              
                              if (response.data && response.data.message) {
                                // Add to the added interns list for display
                                if (!selectedInternData) {
                                  console.error('Selected intern data not found:', {
                                    selectedIntern,
                                    selectedInternData
                                  });
                                  setError('Selected intern data not found. Please search and select an intern again.');
                                  return;
                                }
                                
                                const displayData = {
                                  _id: internData.internId,
                                  fullName: selectedInternData.fullName,
                                  email: selectedInternData.email,
                                  course: selectedInternData.course,
                                  admissionNumber: internAdmissionNumber
                                };
                                setAddedInterns([...addedInterns, displayData]);
                                
                                // Clear the form
                                setInternAdmissionNumber('');
                                setInternCourseName('');
                                setSelectedIntern('');
                                setSelectedInternData(null);
                                setInternSearchTerm('');
                                
                                setSuccess('Intern added successfully to batch');
                              } else {
                                console.log('Invalid response structure:', response.data);
                                setError('Invalid response from server');
                              }
                            } else {
                              // Create mode: Add intern to local list (will be sent when batch is created)
                              if (!selectedInternData) {
                                console.error('Selected intern data not found (create mode):', {
                                  selectedIntern,
                                  selectedInternData
                                });
                                setError('Selected intern data not found. Please search and select an intern again.');
                                return;
                              }
                              
                              const displayData = {
                                _id: internData.internId,
                                fullName: selectedInternData.fullName,
                                email: selectedInternData.email,
                                course: selectedInternData.course,
                                admissionNumber: internAdmissionNumber
                              };
                              setAddedInterns([...addedInterns, displayData]);
                              
                              // Clear the form
                              setInternAdmissionNumber('');
                              setInternCourseName('');
                              setSelectedIntern('');
                              setSelectedInternData(null);
                              setInternSearchTerm('');
                              
                              setSuccess('Intern added to batch (will be saved when batch is created)');
                            }
                            console.log("second");
                            
                          } catch (err) {
                            console.error('Error adding intern:', err);
                            console.error('Error response:', err.response);
                            console.error('Error message:', err.message);
                            
                            // Check if it's a duplicate error
                            if (err.response?.data?.message?.includes('already in this batch')) {
                              setError('This intern is already in the batch');
                            } else if (err.response?.data?.message) {
                              setError(err.response.data.message);
                            } else if (err.message) {
                              setError(err.message);
                            } else {
                              setError('Failed to add intern to batch');
                            }
                          } finally {
                            setLoading(false);
                          }
                        }
                      }}
                      disabled={!selectedIntern || loading}
                      className="py-2 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Adding...' : 'Add Intern'}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Added Interns</h3>
                {addedInterns.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No interns added yet. Add interns using the form above.</p>
                ) : (
                  <div className="flex flex-wrap gap-2 ">
                    {addedInterns.map((intern) => (
                      <div key={intern._id} className="inline-flex items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-sm">
                        <span className="text-blue-700 font-medium">{intern.fullName}</span>
                        <button
                          type="button"
                          onClick={() => removeInternFromList(intern._id)}
                          className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                          title="Remove intern"
                        >
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                    ))}
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
                <button type="submit" disabled={loading} className="py-2 px-6 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-60">
                  {loading 
                    ? (isEditMode ? 'Updating...' : 'Creating...') 
                    : (isEditMode ? 'Update Batch' : 'Create Batch')
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Delete Batch</h3>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete the batch <strong>"{deletingBatch?.batchName}"</strong>? 
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
    </>
  )
}

import React, { useState, useEffect } from 'react'
import Tabs from '../../../components/button/Tabs';
import { Navbar } from '../../../components/admin/AdminNavBar';
import AdminService from '../../../services/admin-api-service/AdminService';


const Material = () => {
    const [activeTab, setActiveTab] = useState('materialList');
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [batches, setBatches] = useState([]);
    const [courses, setCourses] = useState([]);
    const [interns, setInterns] = useState([]);
    
    // Form data
    const [formData, setFormData] = useState({
      title: '',
      mentor: '',
      attachments: '',
      audience: 'All interns',
    });
    
    // Audience-specific selections
    const [selectedBatches, setSelectedBatches] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectedInterns, setSelectedInterns] = useState([]);
    const [selectedIndividualInterns, setSelectedIndividualInterns] = useState([]);
    
    // Search states
    const [batchSearchTerm, setBatchSearchTerm] = useState('');
    const [courseSearchTerm, setCourseSearchTerm] = useState('');
    const [internSearchTerm, setInternSearchTerm] = useState('');
    
    // Loading states
    const [batchesLoading, setBatchesLoading] = useState(false);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [internsLoading, setInternsLoading] = useState(false);
    
    // Filtered data
    const [filteredBatches, setFilteredBatches] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [filteredInterns, setFilteredInterns] = useState([]);
    
    // File upload
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState('');
    
    // Edit mode
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [notification, setNotification] = useState({
      show: false,
      type: 'success', // 'success', 'error', 'info'
      title: '',
      message: ''
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingMaterial, setDeletingMaterial] = useState(null);
    
    // Pagination state
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 5
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        audience: '',
        mentor: ''
    });
    
    const audiences = ['All interns', 'By batches', 'By courses', 'Individual interns'];
    const tabOptions = [
        { value: "materialList", label: "Material List" },
        { value: "new-material", label: "New Material" }
    ];
  
    // Initialize AdminService
    const adminService = AdminService();

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

    // Pagination handlers
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, currentPage: newPage }));
            loadMaterials(newPage, searchTerm, filters.audience, filters.mentor);
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

    // Load initial data
    useEffect(() => {
        loadMaterials(pagination.currentPage, searchTerm, filters.audience, filters.mentor);
        loadMentors();
        loadBatches();
        loadCourses();
        loadInterns();
    }, []);

    // Handle search and filter changes with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadMaterials(1, searchTerm, filters.audience, filters.mentor);
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [searchTerm, filters]);

    // Load materials
    const loadMaterials = async (page = 1, search = '', audience = '', mentor = '') => {
        try {
            setLoading(true);
            
            // Build query parameters
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: pagination.limit.toString()
            });
            
            if (search) queryParams.append('search', search);
            if (audience) queryParams.append('audience', audience);
            if (mentor) queryParams.append('mentor', mentor);
            
            const response = await adminService.getMaterialsData(queryParams.toString());
            setMaterials(response.data || []);
            
            // Update pagination state
            if (response.pagination) {
                setPagination(response.pagination);
            }
        } catch (error) {
            console.error('Error loading materials:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load mentors (staff)
    const loadMentors = async () => {
        try {
            const response = await adminService.getStaffData();
            setMentors(response.data || []);
        } catch (error) {
            console.error('Error loading mentors:', error);
        }
    };

    // Load batches
    const loadBatches = async () => {
        try {
            const response = await adminService.getBatchesData();
            setBatches(response.data || []);
            setFilteredBatches(response.data || []);
        } catch (error) {
            console.error('Error loading batches:', error);
        }
    };

    // Load courses
    const loadCourses = async () => {
        try {
            const response = await adminService.getCoursesData();
            setCourses(response.data || []);
            setFilteredCourses(response.data || []);
        } catch (error) {
            console.error('Error loading courses:', error);
        }
    };

    // Load interns
    const loadInterns = async () => {
        try {
            const response = await adminService.getInternsData();
            setInterns(response.data || []);
            setFilteredInterns(response.data || []);
        } catch (error) {
            console.error('Error loading interns:', error);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear selections when audience changes
        if (name === 'audience') {
            setSelectedBatches([]);
            setSelectedCourses([]);
            setSelectedInterns([]);
            setSelectedIndividualInterns([]);
        }
    };

    // Handle file upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
            setFormData({
                ...formData,
                attachments: file.name
            });
        }
    };

    // Batch search and selection
    const handleBatchSearch = (term) => {
        setBatchSearchTerm(term);
        const filtered = batches.filter(batch =>
            batch.batchName.toLowerCase().includes(term.toLowerCase()) ||
            (batch.description && batch.description.toLowerCase().includes(term.toLowerCase()))
        );
        setFilteredBatches(filtered);
    };

    const handleBatchSelect = (batch) => {
        const isSelected = selectedBatches.find(b => b._id === batch._id);
        if (isSelected) {
            setSelectedBatches(selectedBatches.filter(b => b._id !== batch._id));
        } else {
            setSelectedBatches([...selectedBatches, batch]);
        }
    };

    const handleClearAllBatches = () => {
        setSelectedBatches([]);
    };

    // Course search and selection
    const handleCourseSearch = (term) => {
        setCourseSearchTerm(term);
        const filtered = courses.filter(course =>
            course.courseName.toLowerCase().includes(term.toLowerCase()) ||
            (course.description && course.description.toLowerCase().includes(term.toLowerCase()))
        );
        setFilteredCourses(filtered);
    };

    const handleCourseSelect = (course) => {
        const isSelected = selectedCourses.find(c => c._id === course._id);
        if (isSelected) {
            setSelectedCourses(selectedCourses.filter(c => c._id !== course._id));
        } else {
            setSelectedCourses([...selectedCourses, course]);
        }
    };

    const handleClearAllCourses = () => {
        setSelectedCourses([]);
    };

    // Intern search and selection
    const handleInternSearch = (term) => {
        setInternSearchTerm(term);
        const filtered = interns.filter(intern =>
            intern.fullName.toLowerCase().includes(term.toLowerCase()) ||
            intern.email.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredInterns(filtered);
    };

    const handleInternSelect = (intern) => {
        const isSelected = selectedInterns.find(i => i._id === intern._id);
        if (isSelected) {
            setSelectedInterns(selectedInterns.filter(i => i._id !== intern._id));
        } else {
            setSelectedInterns([...selectedInterns, intern]);
        }
    };

    const handleClearAllInterns = () => {
        setSelectedInterns([]);
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const materialData = {
                title: formData.title,
                mentor: formData.mentor,
                attachments: formData.attachments,
                audience: formData.audience,
                batches: selectedBatches.map(b => b._id),
                courses: selectedCourses.map(c => c._id),
                interns: selectedInterns.map(i => i._id),
                individualInterns: selectedIndividualInterns.map(i => i._id)
            };

            if (editingMaterial) {
                await adminService.putMaterialsData(editingMaterial._id, materialData);
                showNotification('success', 'Success', 'Material updated successfully!');
            } else {
                await adminService.postMaterialsData(materialData);
                showNotification('success', 'Success', 'Material created successfully!');
            }

            // Reset form
            resetForm();
            await loadMaterials(pagination.currentPage, searchTerm, filters.audience, filters.mentor);
            setActiveTab('materialList');
        } catch (error) {
            showNotification('error', 'Error', error?.response?.data?.message || 'Failed to save material');
        } finally {
            setLoading(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            title: '',
            mentor: '',
            attachments: '',
            audience: 'All interns',
        });
        setSelectedBatches([]);
        setSelectedCourses([]);
        setSelectedInterns([]);
        setSelectedIndividualInterns([]);
        setSelectedFile(null);
        setFileName('');
        setEditingMaterial(null);
    };

    // Edit material
    const handleEdit = (material) => {
        setEditingMaterial(material);
        setFormData({
            title: material.title,
            mentor: material.mentor._id,
            attachments: material.attachments,
            audience: material.audience,
        });
        
        // Set selections based on material data
        setSelectedBatches(material.batches || []);
        setSelectedCourses(material.courses || []);
        setSelectedInterns(material.interns || []);
        setSelectedIndividualInterns(material.individualInterns || []);
        
        setActiveTab('new-material');
    };

    // Delete material
    const handleDelete = (material) => {
        setDeletingMaterial(material);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deletingMaterial) return;
        
        try {
            await adminService.deleteMaterialsData(deletingMaterial._id);
            await loadMaterials(pagination.currentPage, searchTerm, filters.audience, filters.mentor);
            showNotification('success', 'Success', 'Material deleted successfully!');
            setShowDeleteModal(false);
            setDeletingMaterial(null);
        } catch (error) {
            showNotification('error', 'Error', error?.response?.data?.message || 'Failed to delete material');
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeletingMaterial(null);
    };
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
                <h3 className="text-lg font-medium text-gray-900">Delete Material</h3>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete the material <strong>"{deletingMaterial?.title}"</strong>? 
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
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
    <Navbar headData="Material" activeTab={activeTab} />  
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
    
      <div className="w-full  bg-white rounded-xl shadow-2xl p-6 sm:p-8">

        {/* Content Area - Materials List */}
        {activeTab === 'materialList' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Materials List</h3>
              <button
                onClick={() => {
                  resetForm();
                  setActiveTab('new-material');
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Add New Material
              </button>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex-1 mr-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Materials"
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
                  value={filters.audience}
                  onChange={(e) => handleFilterChange('audience', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Audience</option>
                  <option value="All interns">All interns</option>
                  <option value="By batches">By batches</option>
                  <option value="By courses">By courses</option>
                  <option value="Individual interns">Individual interns</option>
                </select>
                <select 
                  value={filters.mentor}
                  onChange={(e) => handleFilterChange('mentor', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Mentors</option>
                  {mentors.map(mentor => (
                    <option key={mentor._id} value={mentor._id}>
                      {mentor.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <span className="ml-2 text-gray-600">Loading materials...</span>
              </div>
            ) : materials.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filters.audience || filters.mentor ? 'No materials found matching your search.' : 'No materials found'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filters.audience || filters.mentor ? 'Try adjusting your search or filter criteria.' : 'Get started by creating your first material.'}
                </p>
                {!searchTerm && !filters.audience && !filters.mentor && (
                  <button
                    onClick={() => {
                      resetForm();
                      setActiveTab('new-material');
                    }}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Create Material
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mentor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Audience
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attachments
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {materials.map((material) => (
                      <tr key={material._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {material.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {material.mentor?.fullName || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {material.audience}
                            </span>
                            
                            {/* Audience-specific details */}
                            {material.audience === 'By batches' && material.batches?.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {material.batches.slice(0, 2).map((batch, index) => (
                                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    {batch.batchName}
                                  </span>
                                ))}
                                {material.batches.length > 2 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    +{material.batches.length - 2} more
                                  </span>
                                )}
                              </div>
                            )}
                            
                            {material.audience === 'By courses' && material.courses?.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {material.courses.slice(0, 2).map((course, index) => (
                                  <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                    {course.courseName}
                                  </span>
                                ))}
                                {material.courses.length > 2 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    +{material.courses.length - 2} more
                                  </span>
                                )}
                              </div>
                            )}
                            
                            {material.audience === 'Individual interns' && material.individualInterns?.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {material.individualInterns.slice(0, 2).map((intern, index) => (
                                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    {intern.fullName}
                                  </span>
                                ))}
                                {material.individualInterns.length > 2 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    +{material.individualInterns.length - 2} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {material.attachments ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                                {material.attachments}
                              </span>
                            ) : (
                              <span className="text-gray-400">No attachments</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(material.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(material)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-100 transition-colors"
                              title="Edit material"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(material)}
                              className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition-colors"
                              title="Delete material"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
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
        )}

        {/* Content Area - New Material Form */}
        {activeTab === 'new-material' && (
          <form onSubmit={handleSubmit} className="space-y-8 mt-6">
            
            {/* 1. Material Details Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
                {editingMaterial ? 'Edit Material' : 'Material Details'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input 
                    name="title"
                    type="text" 
                    placeholder="Enter Material Title" 
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
                
                {/* Assigned Mentor Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned Mentor</label>
                  <select
                    name="mentor"
                    value={formData.mentor}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    required
                  >
                    <option value="">Choose Mentor</option>
                    {mentors.map(mentor => (
                      <option key={mentor._id} value={mentor._id}>
                        {mentor.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Attachments Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Attachments</label>
                  <div className="relative mt-1">
                    <input 
                      type="file" 
                      id="file-upload" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center justify-between w-full p-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-500 hover:bg-gray-50 transition-colors">
                      <span className="truncate">
                        {fileName || 'Upload Attachments'}
                      </span>
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Audience Selection Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Audience Selection</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Audience Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Audience Type</label>
                  <select
                    name="audience"
                    value={formData.audience}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    required
                  >
                    {audiences.map(audience => (
                      <option key={audience} value={audience}>{audience}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Material Details Section */}
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

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button 
                type="button" 
                onClick={() => {
                  resetForm();
                  setActiveTab('materialList');
                }}
                className="py-2 px-6 rounded-lg bg-white border border-red-400 font-medium text-red-600 hover:bg-red-50 transition-colors shadow-md"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading || !formData.title.trim() || !formData.mentor}
                className="py-2 px-6 rounded-lg bg-orange-500 text-white font-medium shadow-md hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (editingMaterial ? 'Updating...' : 'Adding...') : (editingMaterial ? 'Update Material' : 'Add Material')}
              </button>
            </div>
          </form>
        )}
      </div>

    </>
  )
}

export default Material
import React, { useState, useEffect } from 'react';
import Tabs from '../../../components/button/Tabs';
import { Navbar } from '../../../components/admin/AdminNavBar';
import AdminService from '../../../services/admin-api-service/AdminService';

export const RoleManagement = () => {
  const { getRolesData, postRolesData, putRolesData, deleteRolesData } = AdminService();
  
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    type: 'success', // 'success', 'error', 'info'
    title: '',
    message: ''
  });
  const [formData, setFormData] = useState({
    role: '',
    description: '',
    permissions: {}
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: ''
  });

  // Valid role options from the enum (excluding Super Admin for frontend)
  const roleOptions = [
    'Admin', 
    'Mentor',
    'Accountant',
    'Intern',
    'Career advisor',
    'Placement coordinator',
    'Front office staff'
  ];

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

  const tabOptions = [
    { value: "roles", label: "Roles" },
    { value: "newRole", label: "New Role" }
  ];

   const headData = "Role Management"

  // Permission structure matching the schema
  const permissionCategories = [
    {
      key: 'studentManagement',
      title: 'Student Management',
      permissions: [
        { key: 'addStudent', label: 'Add Student' },
        { key: 'viewStudent', label: 'View Student' },
        { key: 'editStudent', label: 'Edit Student' },
        { key: 'deleteStudent', label: 'Delete Student' }
      ]
    },
    {
      key: 'mentorManagement',
      title: 'Mentor Management',
      permissions: [
        { key: 'addMentor', label: 'Add Mentor' },
        { key: 'viewMentor', label: 'View Mentor' },
        { key: 'editMentor', label: 'Edit Mentor' },
        { key: 'deleteMentor', label: 'Delete Mentor' }
      ]
    },
    {
      key: 'courseManagement',
      title: 'Course Management',
      permissions: [
        { key: 'addCourse', label: 'Add Course' },
        { key: 'viewCourse', label: 'View Course' },
        { key: 'editCourse', label: 'Edit Course' },
        { key: 'deleteCourse', label: 'Delete Course' }
      ]
    },
    {
      key: 'categoryManagement',
      title: 'Category Management',
      permissions: [
        { key: 'addCategory', label: 'Add Category' },
        { key: 'viewCategory', label: 'View Category' },
        { key: 'editCategory', label: 'Edit Category' },
        { key: 'deleteCategory', label: 'Delete Category' }
      ]
    },
    {
      key: 'moduleManagement',
      title: 'Module Management',
      permissions: [
        { key: 'addModule', label: 'Add Module' },
        { key: 'viewModule', label: 'View Module' },
        { key: 'editModule', label: 'Edit Module' },
        { key: 'deleteModule', label: 'Delete Module' }
      ]
    },
    {
      key: 'topicManagement',
      title: 'Topic Management',
      permissions: [
        { key: 'addTopic', label: 'Add Topic' },
        { key: 'viewTopic', label: 'View Topic' },
        { key: 'editTopic', label: 'Edit Topic' },
        { key: 'deleteTopic', label: 'Delete Topic' }
      ]
    },
    {
      key: 'taskManagement',
      title: 'Task Management',
      permissions: [
        { key: 'addTask', label: 'Add Task' },
        { key: 'viewTask', label: 'View Task' },
        { key: 'editTask', label: 'Edit Task' },
        { key: 'deleteTask', label: 'Delete Task' }
      ]
    },
    {
      key: 'weeklySchedule',
      title: 'Weekly Schedule',
      permissions: [
        { key: 'addSchedule', label: 'Add Schedule' },
        { key: 'viewSchedule', label: 'View Schedule' },
        { key: 'editSchedule', label: 'Edit Schedule' },
        { key: 'deleteSchedule', label: 'Delete Schedule' }
      ]
    },
    {
      key: 'scheduleTiming',
      title: 'Schedule Timing',
      permissions: [
        { key: 'addTiming', label: 'Add Timing' },
        { key: 'viewTiming', label: 'View Timing' },
        { key: 'editTiming', label: 'Edit Timing' },
        { key: 'deleteTiming', label: 'Delete Timing' }
      ]
    },
    {
      key: 'staticPage',
      title: 'Static Page',
      permissions: [
        { key: 'addPage', label: 'Add Page' },
        { key: 'viewPage', label: 'View Page' },
        { key: 'editPage', label: 'Edit Page' },
        { key: 'deletePage', label: 'Delete Page' }
      ]
    }
  ];

  // API functions
  const fetchRoles = async (page = 1, search = '', role = '') => {
    try {
      setLoading(true);
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (search) queryParams.append('search', search);
      if (role) queryParams.append('role', role);
      
      const response = await getRolesData(queryParams.toString());
      setRoles(response.data);
      
      // Update pagination state
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRole = async (data) => {
    try {
      setLoading(true);
      const response = await postRolesData(data);
      await fetchRoles(pagination.currentPage, searchTerm, filters.role); // Refresh the list
      showNotification('success', 'Success', 'Role created successfully!');
      return response;
    } catch (error) {
      console.error('Error creating role:', error);
      showNotification('error', 'Error', error.response?.data?.message || 'Error creating role. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, data) => {
    try {
      setLoading(true);
      const response = await putRolesData(id, data);
      await fetchRoles(pagination.currentPage, searchTerm, filters.role); // Refresh the list
      showNotification('success', 'Success', 'Role updated successfully!');
      return response;
    } catch (error) {
      console.error('Error updating role:', error);
      showNotification('error', 'Error', error.response?.data?.message || 'Error updating role. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id) => {
    try {
      setLoading(true);
      const response = await deleteRolesData(id);
      await fetchRoles(pagination.currentPage, searchTerm, filters.role); // Refresh the list
      setShowDeleteModal(false);
      setRoleToDelete(null);
      showNotification('success', 'Success', 'Role deleted successfully!');
      return response;
    } catch (error) {
      console.error('Error deleting role:', error);
      showNotification('error', 'Error', error.response?.data?.message || 'Error deleting role. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (role) => {
    setRoleToDelete(role);
    setShowDeleteModal(true);
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (roleToDelete) {
      deleteRole(roleToDelete._id);
    }
  };

  // Handle delete cancellation
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRoleToDelete(null);
  };

  // Edit role function
  const editRole = (role) => {
    setEditingRole(role);
    setFormData({
      role: role.role,
      description: role.description || '',
      permissions: role.permissions || initializePermissions()
    });
    setActiveTab('newRole');
  };

  // Cancel edit mode
  const cancelEdit = () => {
    setEditingRole(null);
    setFormData({
      role: '',
      description: '',
      permissions: initializePermissions()
    });
    setActiveTab('roles');
  };

  // Initialize permissions structure
  const initializePermissions = () => {
    const permissions = {};
    permissionCategories.forEach(category => {
      permissions[category.key] = {};
      category.permissions.forEach(permission => {
        permissions[category.key][permission.key] = false;
      });
    });
    return permissions;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle permission changes
  const handlePermissionChange = (categoryKey, permissionKey, value) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [categoryKey]: {
          ...prev.permissions[categoryKey],
          [permissionKey]: value
        }
      }
    }));
  };

  // Handle category toggle (all permissions in a category)
  const handleCategoryToggle = (categoryKey, value) => {
    const category = permissionCategories.find(cat => cat.key === categoryKey);
    if (category) {
      const updatedPermissions = { ...formData.permissions };
      updatedPermissions[categoryKey] = {};
      category.permissions.forEach(permission => {
        updatedPermissions[categoryKey][permission.key] = value;
      });
      setFormData(prev => ({
        ...prev,
        permissions: updatedPermissions
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        permissions: formData.permissions
      };
      
      if (editingRole) {
        // Update existing role
        await updateRole(editingRole._id, dataToSubmit);
      } else {
        // Create new role
        await createRole(dataToSubmit);
      }
      
      // Reset form and go back to roles tab
      setFormData({
        role: '',
        description: '',
        permissions: initializePermissions()
      });
      setEditingRole(null);
      setActiveTab('roles');
    } catch (error) {
      console.error('Error submitting form:', error);
      // Error notification is already handled in the API functions
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
      fetchRoles(newPage, searchTerm, filters.role);
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

  // Load roles on component mount
  useEffect(() => {
    fetchRoles(pagination.currentPage, searchTerm, filters.role);
    setFormData(prev => ({
      ...prev,
      permissions: initializePermissions()
    }));
  }, []);

  // Handle search and filter changes with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRoles(1, searchTerm, filters.role);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters]);

  const renderRolesTable = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Search and Filter Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 mr-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Roles"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 text-black pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">All Roles</option>
            {roleOptions.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <button className="flex items-center px-4 py-2 bg-white text-gray-600 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : roles.length === 0 ? (
        <div className="flex items-center justify-center p-12">
          <p className="text-gray-500 text-lg">
            {searchTerm || filters.role ? 'No roles found matching your search.' : 'No roles available. Please add roles to view them here.'}
          </p>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roles.map((role, index) => (
              <tr key={role._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{role.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role.description || 'No description'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    role.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {role.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(role.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => editRole(role)}
                    className="text-orange-600 hover:text-orange-900 mr-2"
                    title="Edit Role"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(role)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete Role"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H8a1 1 0 00-1 1v3m.75 0H18"></path></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

  const renderNewRoleForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {editingRole ? 'Edit Role' : 'Create New Role'}
        </h2>
        <p className="text-gray-600 mt-1">
          {editingRole ? `Editing role: ${editingRole.role}` : 'Set permissions for a specific role'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Role</label>
            <div className="relative">
              <input 
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="Enter Role Name"
                className="block w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={editingRole} // Disable role change when editing
              />
              {editingRole && (
                <p className="text-sm text-gray-500 mt-1">Role cannot be changed when editing</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <input 
              type="text" 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter Description" 
              className="w-full px-4 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
            />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">All Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {permissionCategories.map((category) => {
            const categoryPermissions = formData.permissions[category.key] || {};
            const allChecked = category.permissions.every(permission => categoryPermissions[permission.key]);
            const someChecked = category.permissions.some(permission => categoryPermissions[permission.key]);
            
            return (
              <div key={category.key} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-800 font-semibold">{category.title}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={allChecked}
                      onChange={(e) => handleCategoryToggle(category.key, e.target.checked)}
                    />
                    <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${
                      allChecked ? 'bg-orange-500' : someChecked ? 'bg-orange-300' : 'bg-gray-200'
                    }`}></div>
                  </label>
                </div>
                <div className="space-y-2">
                  {category.permissions.map((permission) => (
                    <div key={permission.key} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                        checked={categoryPermissions[permission.key] || false}
                        onChange={(e) => handlePermissionChange(category.key, permission.key, e.target.checked)}
                      />
                      <label className="ml-2 text-sm text-gray-700">{permission.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end mt-8 space-x-4">
          <button 
            type="button"
            onClick={editingRole ? cancelEdit : () => setActiveTab('roles')}
            className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            {editingRole ? 'Cancel Edit' : 'Cancel'}
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-orange-500 text-white rounded-md font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading 
              ? (editingRole ? 'Updating...' : 'Creating...') 
              : (editingRole ? 'Update Role' : 'Create Role')
            }
          </button>
        </div>
      </form>
    </div>
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

  // Delete Confirmation Modal Component
  const DeleteConfirmationModal = () => {
    if (!showDeleteModal || !roleToDelete) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Delete Role</h3>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete the role <span className="font-semibold text-gray-900">"{roleToDelete.role}"</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone and will permanently remove all permissions associated with this role.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
    {/* Content Tabs & Actions */}
    <Navbar headData={headData} activeTab={activeTab} />

    <div className="flex justify-between items-center mb-6">
    {/* <div className="flex space-x-2">
      <button
        onClick={() => setActiveTab('roles')}
        className={`px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
          activeTab === 'roles'
            ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600'
            : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        Roles
      </button>
      <button
        onClick={() => setActiveTab('newRole')}
        className={`px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
          activeTab === 'newRole'
            ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600'
            : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        New Role
      </button>
    </div> */}

    <Tabs tabs={tabOptions} activeTab={activeTab} setActiveTab={setActiveTab} />

    {activeTab === 'roles' && (
      <div className="flex space-x-2">
        {/* <button 
          onClick={() => {
            setEditingRole(null);
            setFormData({
              role: '',
              description: '',
              permissions: initializePermissions()
            });
            setActiveTab('newRole');
          }}
          className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md font-medium shadow-md hover:bg-orange-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          New Role
        </button> */}
        <button className="flex items-center px-4 py-2 bg-white text-gray-600 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Export
        </button>
      </div>
    )}
    
  </div>

  {/* Conditional Rendering */}
  {activeTab === 'roles' ? renderRolesTable() : renderNewRoleForm()}

  {/* Notification Modal */}
  <NotificationModal />

  {/* Delete Confirmation Modal */}
  <DeleteConfirmationModal />

  </>

  );
};



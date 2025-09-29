import React, { useState } from 'react';
import Tabs from '../../../components/button/Tabs';
import { Navbar } from '../../../components/admin/AdminNavBar';

export const RoleManagement = () => {
    const [activeTab, setActiveTab] = useState('roles');
  const users = [
    {
      id: 1,
      name: 'Priyesh',
      role: 'Super Admin',
      description: 'Full access to all modules',
      email: 'priyesh@gmail.com',
      lastLogin: '13/01/25 16:25:22',
      updatedBy: 'Administrator',
    },
  ];

  const tabOptions = [
    { value: "roles", label: "Roles" },
    { value: "newRole", label: "New Role" }
  ];

   const headData = "Role Management"

  const privileges = [
    {
      title: 'Student Management',
      permissions: ['Add Student', 'View Student', 'Edit Student', 'Delete Student'],
    },
    {
      title: 'Mentor Management',
      permissions: ['Add Mentor', 'View Mentor', 'Edit Mentor', 'Delete Mentor'],
    },
    {
      title: 'Course Management',
      permissions: ['Add Course', 'View Course', 'Edit Course', 'Delete Course'],
    },
    {
      title: 'Category Management',
      permissions: ['Add Category', 'View Category', 'Edit Category', 'Delete Category'],
    },
    {
      title: 'Module Management',
      permissions: ['Add Module', 'View Module', 'Edit Module', 'Delete Module'],
    },
    {
      title: 'Topic Management',
      permissions: ['Add Topic', 'View Topic', 'Edit Topic', 'Delete Topic'],
    },
    {
      title: 'Task Management',
      permissions: ['Add Task', 'View Task', 'Edit Task', 'Delete Task'],
    },
    {
      title: 'Weekly Schedule',
      permissions: ['Add Schedule', 'View Schedule', 'Edit Schedule'],
    },
    {
      title: 'Schedule Timing',
      permissions: ['Add Timing', 'View Timing', 'Edit Timing'],
    },
    {
      title: 'Static Page',
      permissions: ['Add Page', 'View Page', 'Edit Page', 'Delete Page'],
    },
  ];
  
  const renderRolesTable = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Log In</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated by</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.updatedBy}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-orange-600 hover:text-orange-900 mr-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H8a1 1 0 00-1 1v3m.75 0H18"></path></svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-end mt-4 text-sm text-gray-500 space-x-4">
        <span>1 of 1</span>
        <div className="flex space-x-2">
          <button className="p-2 border rounded-md hover:bg-gray-100 transition-colors duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <button className="p-2 border rounded-md hover:bg-gray-100 transition-colors duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );

  const renderNewRoleForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Role</label>
          <div className="relative">
            <select className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option>Choose Role</option>
              <option>Admin</option>
              <option>User</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <input type="text" placeholder="Enter Description" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">All Privilege's</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {privileges.map((privilege) => (
          <div key={privilege.title} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-800 font-semibold">{privilege.title}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>
            <div className="space-y-2">
              {privilege.permissions.map((permission) => (
                <div key={permission} className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500" />
                  <label className="ml-2 text-sm text-gray-700">{permission}</label>
                </div>
              ))}
            </div>
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
      <button className="flex items-center px-4 py-2 bg-white text-gray-600 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        Export
      </button>
    )}
    
  </div>

  {/* Conditional Rendering */}
  {activeTab === 'roles' ? renderRolesTable() : renderNewRoleForm()}

  </>

  );
};



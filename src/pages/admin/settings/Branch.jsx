import React, { useState, useEffect } from 'react'
import { Navbar } from '../../../components/admin/AdminNavBar';
import Tabs from '../../../components/button/Tabs';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

// A single component for all SVG icons to improve code reusability and readability
const Icon = ({ path, className, viewBox = "0 0 24 24" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path}></path>
    </svg>
  );

export const Branch = () => {
    const [activeTab, setActiveTab] = useState('branches');
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        branchName: '',
        location: ''
    });
    
    const axiosPrivate = useAxiosPrivate();
    const headData = "Branch Management"

    const tabOptions = [
        { value: "branches", label: "Branches" },
        { value: "newBranch", label: "New Branch" }
    ];

    // Fetch all branches
    const fetchBranches = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axiosPrivate.get('http://localhost:3000/api/branches');
            setBranches(response.data || []);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to load branches');
        } finally {
            setLoading(false);
        }
    };

    // Create new branch
    const handleCreateBranch = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.branchName.trim() || !formData.location.trim()) {
            setError('Branch name and location are required');
            return;
        }

        try {
            setLoading(true);
            const response = await axiosPrivate.post('http://localhost:3000/api/branches', formData);
            setSuccess('Branch created successfully!');
            setFormData({ branchName: '', location: '' });
            await fetchBranches(); // Refresh the list
            setActiveTab('branches'); // Switch to branches tab
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to create branch');
        } finally {
            setLoading(false);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle cancel button
    const handleCancel = () => {
        setFormData({ branchName: '', location: '' });
        setError('');
        setSuccess('');
        setActiveTab('branches');
    };

    // Load branches when component mounts
    useEffect(() => {
        fetchBranches();
    }, []);

    // Clear messages when switching tabs
    useEffect(() => {
        setError('');
        setSuccess('');
    }, [activeTab]);
          
  return (
    <>
       <Navbar headData={headData} activeTab={activeTab} />

       <div className="mb-6">
            <Tabs tabs={tabOptions} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

    <div className="bg-white p-6 rounded-xl shadow-lg">
     
    {/* <div className="flex justify-between items-center mb-6">
      <div className="flex space-x-2">
        <button
          onClick={() => setActiveTab('branches')}
          className={`py-2 px-6 rounded-lg font-medium ${activeTab === 'branches' ? 'bg-orange-500 text-white' : 'bg-transparent text-gray-800'}`}
        >
          Branches
        </button>
        <button
          onClick={() => setActiveTab('newBranch')}
          className={`py-2 px-6 rounded-lg font-medium ${activeTab === 'newBranch' ? 'bg-orange-500 text-white' : 'bg-transparent text-gray-800'}`}
        >
          New Branch
        </button>
      </div>
      {activeTab === 'branches' && (
        <button className="flex items-center space-x-2 py-2 px-4 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">
          <Icon path="M4 16v1a3 3 000 6h16a3 3 000-6v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-5 h-5" />
          <span>Export</span>
        </button>
      )}
    </div> */}
    {activeTab === 'branches' ? (
      <div>
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

        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <button className="flex items-center space-x-2 py-2 px-4 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">
            <Icon path="M4 16v1a3 3 000 6h16a3 3 000-6v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-5 h-5" />
            <span>Export</span>
          </button>
        </div>

        {/* Branches Table */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <p className="text-gray-500 text-lg">Loading branches...</p>
          </div>
        ) : branches.length === 0 ? (
          <div className="flex items-center justify-center h-96 border border-gray-200 rounded-lg bg-gray-50">
            <p className="text-gray-500 text-center">No branch data available. Please add a new branch to view them here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 font-semibold uppercase text-sm">
                  <th className="py-3 px-4 rounded-tl-lg">#</th>
                  <th className="py-3 px-4">Branch Name</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {branches.map((branch, index) => (
                  <tr key={branch._id} className="border-b last:border-b-0 border-gray-200">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium">{branch.branchName}</td>
                    <td className="py-3 px-4">{branch.location}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        branch.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {branch.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(branch.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
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
      <div>
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

        <form onSubmit={handleCreateBranch}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Branch Name</label>
              <input 
                type="text" 
                name="branchName"
                value={formData.branchName}
                onChange={handleInputChange}
                placeholder="Enter branch name" 
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter branch location" 
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button 
              type="button"
              onClick={handleCancel}
              className="py-3 px-6 rounded-lg text-red-500 border border-red-500 hover:bg-red-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="py-3 px-6 rounded-lg text-white bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Branch'}
            </button>
          </div>
        </form>
      </div>
    )}
  </div>
  </>
  )
}

import React, { useState, useEffect } from 'react'

import { X } from 'lucide-react';
import { Navbar } from '../../../components/admin/AdminNavBar';
import Tabs from '../../../components/button/Tabs';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

export const Timings = () => {

  const [activeTab, setActiveTab] = useState('timings');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [branches, setBranches] = useState([]);
  const [timings, setTimings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [deletingTiming, setDeletingTiming] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const headData = "Settings"

  const tabOptions = [
    { value: "timings", label: "Timings" },
    { value: "new-timing", label: "New Timing" }
  ];

  const fetchBranches = async () => {
    try {
      console.log("fetchBranches");
      
      setLoading(true);
      setError('');
      const res = await axiosPrivate.get('http://localhost:3000/api/branches');
      console.log("branches==",res.data);
      
      setBranches(res.data || []);
    } catch (err) {
      console.error('Failed to load branches:', err);
      setError('Failed to load branches');
      // Set default branches if API fails
      setBranches([
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimings = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axiosPrivate.get('http://localhost:3000/api/timings');
      console.log("timings==", res.data);
      setTimings(res.data || []);
    } catch (err) {
      console.error('Failed to load timings:', err);
      setError('Failed to load timings');
      setTimings([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchBranches();
    fetchTimings();
  }, []);

  // Filter timings based on selected branch
  const filteredTimings = selectedBranch 
    ? timings.filter(timing => {
        if (typeof timing.branch === 'object' && timing.branch) {
          return timing.branch._id === selectedBranch;
        }
        return timing.branch === selectedBranch;
      })
    : timings;

  // Handle delete timing
  const handleDeleteTiming = (timing) => {
    setDeletingTiming(timing);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTiming) return;

    try {
      setLoading(true);
      await axiosPrivate.delete(`http://localhost:3000/api/timings/${deletingTiming._id}`);
      setSuccess('Timing deleted successfully.');
      await fetchTimings();
      setShowDeleteModal(false);
      setDeletingTiming(null);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete timing');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingTiming(null);
  };


  const AddedTimings = () => {
    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Added Timings</h3>
          <div className="flex items-center space-x-4">
            <label className="text-sm text-gray-600">Filter by Branch:</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Branches</option>
              {branches.map(branch => (
                <option key={branch._id} value={branch._id}>
                  {branch.branchName}
                </option>
              ))}
            </select>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-500">Loading timings...</p>
          </div>
        ) : filteredTimings.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-gray-500">
              {selectedBranch 
                ? 'No timings found for the selected branch.' 
                : 'No timings available. Please add timings to view them here.'
              }
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {filteredTimings.map((timing, index) => (
              <div
                key={timing._id || index}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full flex items-center space-x-2"
              >
                <span>{timing.timeSlot}</span>
                <span className="text-sm text-gray-500">
                  {typeof timing.branch === 'object' && timing.branch 
                    ? timing.branch.branchName 
                    : 'Unknown Branch'
                  }
                </span>
                <X 
                  className="w-4 h-4 text-gray-500 cursor-pointer hover:text-red-500" 
                  onClick={() => handleDeleteTiming(timing)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  
  const handleCreateTiming = async () => {
    setError('');
    setSuccess('');

    // Get form data
    const batchNameSelect = document.getElementById('batch-name');
    const branchNameSelect = document.getElementById('branch-name');
    
    const timeSlot = batchNameSelect.value;
    const branchId = branchNameSelect.value;

    if (!timeSlot || !branchId) {
      setError('Please select both time slot and branch');
      return;
    }

    try {
      setLoading(true);
      const response = await axiosPrivate.post('http://localhost:3000/api/timings', {
        branch: branchId,
        timeSlot: timeSlot
      });
      setSuccess('Timing created successfully!');
      // Reset form
      batchNameSelect.value = '';
      branchNameSelect.value = '';
      // Refresh timings list
      await fetchTimings();
      setActiveTab('timings'); // Switch to timings tab
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create timing');
    } finally {
      setLoading(false);
    }
  };

    // Function to handle form cancellation
    const handleCancel = () => {
      setError('');
      setSuccess('');
      setActiveTab('timings');
    };

    // Component for the "Timings" list view
    const TimingsView = () => (
      <div className="p-8 bg-white rounded-3xl h-full shadow-lg">
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
        <AddedTimings />
      </div>
    );

      // Component for the "New Timing" form view
  const NewTimingForm = () => (
    <div className="p-8 bg-white rounded-3xl h-full shadow-lg">
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
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Timings Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="batch-name" className="text-sm text-gray-600 mb-2">
              Batch Name
            </label>
            <select
              id="batch-name"
              className="p-3 bg-gray-100 text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F9A825] appearance-none"
            >
              <option value="08.30 AM - 11.30 AM">08.30 Am - 11.30 Am</option>
              <option value="11.30 AM - 02.30 PM">11.30 Pm - 02.30 Pm</option>
              <option value="02.00 PM - 05.00 PM">02.00 Pm - 05.00 Pm</option>
            </select>
          </div>
           <div className="flex flex-col">
             <label htmlFor="branch-name" className="text-sm text-gray-600 mb-2">
               Branch Name
             </label>
               <select
                 id="branch-name"
                 className="p-3 bg-gray-100 text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F9A825] appearance-none"
               >
                 <option value="">Choose Branch</option>
                 {loading ? (
                   <option disabled>Loading branches...</option>
                 ) : branches.length === 0 ? (
                   <option disabled>No branches available</option>
                 ) : (
                   branches.map((branch) => (
                     <option key={branch._id} value={branch._id}>
                       {branch.branchName}
                     </option>
                   ))
                 )}
               </select>
           </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={handleCancel}
          className="px-6 py-3 text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-200 transition-colors duration-200"
        >
          Cancel
        </button>
         <button
           onClick={handleCreateTiming}
           disabled={loading}
           className="px-6 py-3 text-white font-medium bg-[#F9A825] rounded-xl hover:bg-[#F9A825] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
         >
           {loading ? 'Creating...' : 'Create Timing'}
         </button>
      </div>
    </div>
  );

  return (
    <>
    <Navbar headData={headData} activeTab={activeTab} />
      <div className="mb-6">
        <Tabs tabs={tabOptions} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="flex-1">
              {activeTab === 'timings' && <TimingsView />}
              {activeTab === 'new-timing' && <NewTimingForm />}
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
                <h3 className="text-lg font-medium text-gray-900">Delete Timing</h3>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete the timing <strong>"{deletingTiming?.timeSlot}"</strong>?
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

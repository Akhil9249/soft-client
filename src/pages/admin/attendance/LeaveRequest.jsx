import React, { useState } from 'react'
import { Navbar } from '../../../components/admin/AdminNavBar';

const mockLeaveRequests = [
    {
      id: 1,
      name: 'John Abraham',
      batch: 'ui/ UX_JUN_RG_BI_2025',
      reason: 'Function',
      noOfDays: 1,
      leaveDate: '22/02/2025',
      status: 'Pending',
    },
    {
      id: 2,
      name: 'John Abraham',
      batch: 'ui/ UX_JUN_RG_BI_2025',
      reason: 'Exam',
      noOfDays: 1,
      leaveDate: '22/02/2025',
      status: 'Approved',
    },
    {
      id: 3,
      name: 'John Abraham',
      batch: 'ui/ UX_JUN_RG_BI_2025',
      reason: 'Family Function',
      noOfDays: 2,
      leaveDate: '22/02/2025 || 23/02/2025',
      status: 'Rejected',
    },
    {
      id: 4,
      name: 'John Abraham',
      batch: 'ui/ UX_JUN_RG_BI_2025',
      reason: 'Travel',
      noOfDays: 1,
      leaveDate: '22/02/2025',
      status: 'Approved',
    },
    {
      id: 5,
      name: 'John Abraham',
      batch: 'ui/',
      reason: 'Others',
      noOfDays: 3,
      leaveDate: '22/02/2025',
      status: 'Approved',
    },
  ];

  // Component to render Status badge with specific colors
const StatusBadge = ({ status }) => {
    let colorClass;
    switch (status) {
      case 'Approved':
        colorClass = 'text-green-600 bg-green-100 border-green-300';
        break;
      case 'Rejected':
        colorClass = 'text-red-600 bg-red-100 border-red-300';
        break;
      case 'Pending':
      default:
        colorClass = 'text-blue-600 bg-blue-100 border-blue-300';
        break;
    }
  
    return (
      <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
        {status}
      </span>
    );
  };

const LeaveRequest = () => {
    const [requests, setRequests] = useState(mockLeaveRequests);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Mocking 10 items per page based on the screenshot
  
    // Mock filter options
    const locations = ['Calicut', 'Kochi', 'Bangalore', 'Chennai'];
    const months = ['This Month', 'January', 'February', 'March'];
  
    // Handler for delete action (mock)
    const handleDelete = (id) => {
      // In a real app, this would be an API call
      console.log(`Deleting request with ID: ${id}`);
      setRequests(requests.filter(req => req.id !== id));
    };
  
    // Handler for view action (mock)
    const handleView = (id) => {
      // In a real app, this would open a modal or new view
      console.log(`Viewing details for request with ID: ${id}`);
    };
  
    // Icon for View/Eye
    const ViewIcon = () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
      </svg>
    );
  
    // Icon for Delete/Trash
    const DeleteIcon = () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
      </svg>
    );
    
    // Icon for Export
    const ExportIcon = () => (
      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
      </svg>
    );
  
    return (
        <>
        <Navbar headData="Leave Request" activeTab="Leave Request" />

        <div className="w-full  bg-white rounded-xl shadow-2xl p-6 sm:p-8">

  
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Leave Request</h1>
          
          {/* Filter and Action Bar */}
          <div className="flex flex-wrap gap-3 mb-8 items-center justify-end">
            
            {/* Location Filter */}
            <select className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:ring-orange-500 focus:border-orange-500">
              {locations.map(loc => <option key={loc}>{loc}</option>)}
            </select>
  
            {/* Month Filter */}
            <select className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 focus:ring-orange-500 focus:border-orange-500">
              {months.map(month => <option key={month}>{month}</option>)}
            </select>
            
            {/* Filter Button (Dropdown Mock) */}
            <button className="flex items-center py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors shadow-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L14 13.414V17a1 1 0 01-.293.707l-2 2A1 1 0 0110 19v-5.586L3.293 6.707A1 1 0 013 6V4z"></path>
              </svg>
              Filter
            </button>
            
            {/* Export Button */}
            <button className="flex items-center py-2 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors shadow-sm">
              Export <ExportIcon />
            </button>
          </div>
  
          {/* Data Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600 font-semibold uppercase text-xs sm:text-sm border-b border-gray-200">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Batch</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">No of Days</th>
                  <th className="py-3 px-4">Leave Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-b last:border-b-0 border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-800">{request.name}</div>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500">
                      <div className="font-medium">{request.batch.split('/')[0]}/</div>
                      <div className="text-[10px] text-gray-400">{request.batch.split('/')[1]}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{request.reason}</td>
                    <td className="py-3 px-4 text-sm text-red-500">{request.noOfDays}</td>
                    <td className="py-3 px-4 text-sm font-medium text-red-500 whitespace-nowrap">
                      {request.leaveDate.includes('||') ? (
                        <>
                          {request.leaveDate.split(' || ')[0]} 
                          <span className='text-gray-400'> || </span> 
                          {request.leaveDate.split(' || ')[1]}
                        </>
                      ) : request.leaveDate}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="py-3 px-4 flex justify-center space-x-3 text-gray-500">
                      <button 
                        onClick={() => handleView(request.id)}
                        className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors"
                        title="View Details"
                      >
                        <ViewIcon />
                      </button>
                      <button 
                        onClick={() => handleDelete(request.id)}
                        className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete Request"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          {/* Pagination */}
          <div className="flex justify-end items-center mt-6">
              <span className="text-sm text-gray-600 mr-4">
                  1 of 10
              </span>
              <div className="flex space-x-2">
                  <button
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(currentPage - 1)}
                  >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <button
                      disabled={currentPage * itemsPerPage >= requests.length}
                      className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(currentPage + 1)}
                  >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
              </div>
          </div>
  
        </div>
        </>
    );
}

export default LeaveRequest
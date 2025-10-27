import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Navbar } from '../../../components/admin/AdminNavBar'
import AdminService from '../../../services/admin-api-service/AdminService'

export const MentorBatches = () => {
  const headData = "Mentor Batches";
  const activeTab = "Mentor Batches";

  const [mentorsWithBatches, setMentorsWithBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMentors, setExpandedMentors] = useState(new Set());

  const { getAllMentorsWithBatches } = AdminService();

  const fetchMentorsWithBatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllMentorsWithBatches();
      setMentorsWithBatches(response.data || []);
    } catch (err) {
      console.error('Error fetching mentors with batches:', err);
      setError(err.response?.data?.message || 'Failed to fetch mentors with batches');
    } finally {
      setLoading(false);
    }
  }, []); // Remove getAllMentorsWithBatches from dependencies

  useEffect(() => {
    fetchMentorsWithBatches();
  }, []); // Empty dependency array - only run once on mount

  const handleRetry = useCallback(() => {
    setError(null);
    fetchMentorsWithBatches();
  }, [fetchMentorsWithBatches]);

  const toggleMentorExpansion = (mentorId) => {
    setExpandedMentors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(mentorId)) {
        newSet.delete(mentorId);
      } else {
        newSet.add(mentorId);
      }
      return newSet;
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'super admin':
        return 'bg-red-100 text-red-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'mentor':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar headData={headData} activeTab={activeTab} />
        <div className="p-6">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <span className="ml-4 text-lg text-gray-600">Loading mentors with batches...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar headData={headData} activeTab={activeTab} />
        <div className="p-6">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="text-center text-red-600">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar headData={headData} activeTab={activeTab} />
      
      <div className="p-6">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Mentor Batches</h2>
              <p className="text-gray-600 mt-1">
                View all mentors and their assigned batches
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Total: {mentorsWithBatches.length} mentors
            </div>
          </div>

          {mentorsWithBatches.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Mentors Found</h3>
              <p className="text-gray-500">
                No mentors with assigned batches found. Please check if weekly schedules are configured.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mentor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Batches
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Schedule Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mentorsWithBatches.map((mentor) => (
                    <React.Fragment key={mentor._id}>
                      {/* Main Mentor Row */}
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{mentor.fullName}</div>
                              <div className="text-sm text-gray-500">{mentor.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(mentor.role)}`}>
                            {mentor.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {mentor.batches.length} batch{mentor.batches.length !== 1 ? 'es' : ''}
                          </div>
                          {mentor.batches.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              {mentor.batches.slice(0, 2).map(batch => batch.batchName).join(', ')}
                              {mentor.batches.length > 2 && ` +${mentor.batches.length - 2} more`}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {mentor.scheduleDetails.length} time slot{mentor.scheduleDetails.length !== 1 ? 's' : ''}
                          </div>
                          {mentor.scheduleDetails.length > 0 && (
                            <div className="text-xs text-gray-500 mt-1">
                              {mentor.scheduleDetails.slice(0, 1).map(slot => slot.timeSlot).join(', ')}
                              {mentor.scheduleDetails.length > 1 && ` +${mentor.scheduleDetails.length - 1} more`}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => toggleMentorExpansion(mentor._id)}
                            className="text-orange-600 hover:text-orange-900 transition-colors"
                          >
                            {expandedMentors.has(mentor._id) ? 'Hide Details' : 'View Details'}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {expandedMentors.has(mentor._id) && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Assigned Batches */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                                  </svg>
                                  Assigned Batches ({mentor.batches.length})
                                </h4>
                                {mentor.batches.length === 0 ? (
                                  <p className="text-gray-500 text-sm">No batches assigned</p>
                                ) : (
                                  <div className="space-y-2">
                                    {mentor.batches.map((batch) => (
                                      <div key={batch._id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <h5 className="font-medium text-gray-800">{batch.batchName}</h5>
                                            <div className="flex items-center space-x-2 mt-1">
                                              <span className="text-xs text-gray-600">{batch.courseName}</span>
                                              <span className="text-xs text-gray-400">•</span>
                                              <span className="text-xs text-gray-600">{batch.branchName}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Schedule Details */}
                              <div>
                                <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                                  <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                  Schedule Details
                                </h4>
                                {mentor.scheduleDetails.length === 0 ? (
                                  <p className="text-gray-500 text-sm">No schedule details available</p>
                                ) : (
                                  <div className="space-y-3">
                                    {mentor.scheduleDetails.map((timeSlot, index) => (
                                      <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <div className="font-medium text-gray-800 mb-2">{timeSlot.timeSlot}</div>
                                        <div className="space-y-2">
                                          {timeSlot.subDetails.map((subDetail, subIndex) => (
                                            <div key={subIndex} className="text-sm">
                                              <div className="flex items-center space-x-2">
                                                <span className="font-medium text-gray-700">{subDetail.days}</span>
                                                <span className="text-gray-400">•</span>
                                                <span className="text-gray-600">
                                                  {/* {subDetail.batches.length > 0 
                                                    ? (subDetail.subject || 'Subject not specified')
                                                    : 'No class assigned'
                                                  } */}
                                                  {subDetail.batches.length > 0 
                                                    ? 'Assigned Batches'
                                                    : 'No batches assigned'
                                                  }
                                                </span>
                                              </div>
                                              {subDetail.batches.length > 0 && (
                                                <div className="mt-1 text-xs text-gray-500">
                                                  Batches: {subDetail.batches.map(b => b.batchName).join(', ')}
                                                </div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

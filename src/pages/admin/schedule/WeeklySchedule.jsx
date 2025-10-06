import React, { useState, useEffect } from 'react'
import { Navbar } from '../../../components/admin/AdminNavBar';
import AdminService from '../../../services/admin-api-service/AdminService';
import { IoEyeOutline } from "react-icons/io5";

export const WeeklySchedule = () => {

  const [activeTab, setActiveTab] = useState('weekly-schedule');
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State for the items currently on the canvas
  const [canvasItems, setCanvasItems] = useState([]);
  const [draggingItem, setDraggingItem] = useState(null);
  const [warning, setWarning] = useState('');

  // State for weekly schedule data from backend
  const [weeklySchedules, setWeeklySchedules] = useState([]);
  const [mentors, setMentors] = useState([]);

  const { getBatchesData, getWeeklySchedulesData, postWeeklySchedulesData, deleteWeeklySchedulesData } = AdminService();

  const headData = "Batch Management";

  // Fetch batches from backend
  const fetchBatches = async () => {
    try {
      setLoading(true);
      setError('');
      // const res = await axiosPrivate.get('http://localhost:3000/api/batches');
      const res = await getBatchesData();
      setBatches(res.data || []);
    } catch (err) {
      console.error('Failed to load batches:', err);
      setError('Failed to load batches');
      // Set default batches if API fails
      setBatches([
        { _id: '1', batchName: 'B11' },
        { _id: '2', batchName: 'B12' },
        { _id: '3', batchName: 'B13' },
        { _id: '4', batchName: 'B14' },
        { _id: '5', batchName: 'B15' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch weekly schedules from backend
  const fetchWeeklySchedules = async () => {
    try {
      console.log('Fetching weekly schedules...');
      setLoading(true);
      setError('');
      // const res = await axiosPrivate.get('http://localhost:3000/api/weekly-schedules');
      const res = await getWeeklySchedulesData();
      console.log('Weekly schedules response:', res.data);
      setWeeklySchedules(res.data || []);

      // Transform the data to match the expected format
      const transformedMentors = transformWeeklyScheduleData(res.data || []);
      setMentors(transformedMentors);
    } catch (err) {
      console.error('Failed to load weekly schedules:', err);
      setError('Failed to load weekly schedules');
      // Set default mentors if API fails
      setMentors([
        {
          name: 'Priyash Manu', schedule: [
            { time: '08.30 am - 11.30 am', days: 'Mon, Wen, Fri', subject: 'No class assigned', days2: 'Tue, Tur, Sat', subject2: 'No class assigned' },
            { time: '11.30 am - 02.30 pm', days: 'Mon, Wen, Fri', subject: 'No class assigned', days2: 'Tue, Tur, Sat', subject2: 'No class assigned' },
            { time: '02.30 pm - 05.00 pm', days: 'Mon, Wen, Fri', subject: 'No class assigned', days2: 'Tue, Tur, Sat', subject2: 'No class assigned' }
          ]
        },
        {
          name: 'John', schedule: [
            { time: '08.30 am - 11.30 am', days: 'Mon, Wen, Fri', subject: 'No class assigned', days2: 'Tue, Tur, Sat', subject2: 'No class assigned' },
            { time: '11.30 am - 02.30 pm', days: 'Mon, Wen, Fri', subject: 'No class assigned', days2: 'Tue, Tur, Sat', subject2: 'No class assigned' },
            { time: '02.30 pm - 05.00 pm', days: 'Mon, Wen, Fri', subject: 'No class assigned', days2: 'Tue, Tur, Sat', subject2: 'No class assigned' }
          ]
        },
        {
          name: 'Faizal', schedule: [
            { time: '08.30 am - 11.30 am', days: 'Mon, Wen, Fri', subject: 'No class assigned', days2: 'Tue, Tur, Sat', subject2: 'No class assigned' },
            { time: '11.30 am - 02.30 pm', days: 'Mon, Wen, Fri', subject: 'No class assigned', days2: 'Tue, Tur, Sat', subject2: 'No class assigned' },
            { time: '02.30 pm - 05.00 pm', days: 'Mon, Wen, Fri', subject: 'No class assigned', days2: 'Tue, Tur, Sat', subject2: 'No class assigned' }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Transform weekly schedule data to match the expected format
  const transformWeeklyScheduleData = (schedules) => {
    if (!schedules || schedules.length === 0) {
      return [];
    }

    return schedules.map(schedule => {
      const mentorName = schedule.mentor?.fullName || 'Unknown Mentor';

      // Transform schedule data to match the expected format
      const transformedSchedule = schedule.schedule.map(timeSlot => {
        const timeString = timeSlot.time?.timeSlot || 'Unknown Time';

        // Find MWF and TTS sub_details
        const mwfDetail = timeSlot.sub_details?.find(detail => detail.days === 'MWF');
        const ttsDetail = timeSlot.sub_details?.find(detail => detail.days === 'TTS');

        const mwfSubject = mwfDetail?.subject || 'No class assigned';
        const ttsSubject = ttsDetail?.subject || 'No class assigned';

        return {
          time: timeString,
          days: 'Mon, Wen, Fri',
          subject: mwfSubject,
          days2: 'Tue, Tur, Sat',
          subject2: ttsSubject
        };
      });

      return {
        name: mentorName,
        schedule: transformedSchedule
      };
    });
  };

  // Load data when component mounts
  useEffect(() => {
    fetchBatches();
    fetchWeeklySchedules();
  }, []);

  // Debug: Log canvas items whenever they change
  useEffect(() => {
    console.log('Canvas items updated:', canvasItems);
  }, [canvasItems]);

  // Debug: Log mentors data whenever it changes
  useEffect(() => {
    console.log('Mentors data updated:', mentors);
  }, [mentors]);

  // Handle drag start
  const handleDragStart = (batch) => {
    const dragItem = {
      id: batch._id || batch,
      name: batch.batchName || batch,
      color: 'bg-blue-500'
    };
    setDraggingItem(dragItem);
  };

  // Handle remove item from canvas
  const handleRemove = (itemId) => {
    setCanvasItems(canvasItems.filter(item => item.id !== itemId));
  };

  // Save weekly schedule to backend
  const saveWeeklySchedule = async (scheduleData) => {
    try {
      console.log('Saving weekly schedule:', scheduleData);
      // const response = await axiosPrivate.post('http://localhost:3000/api/weekly-schedules', scheduleData);
      const response = await postWeeklySchedulesData(scheduleData);
      console.log('Weekly schedule saved:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error saving weekly schedule:', error);
      setError('Failed to save weekly schedule');
      throw error;
    }
  };

  // Remove batch from database
  const handleRemoveBatchFromDatabase = async (scheduleId, timeIndex, days, batchId) => {
    try {
      console.log('Removing batch from database:', { scheduleId, timeIndex, days, batchId });

      // Find the sub-detail index for the specific days
      const schedule = weeklySchedules.find(ws => ws._id === scheduleId);
      if (!schedule) return;

      const timeSlot = schedule.schedule[timeIndex];
      if (!timeSlot) return;

      const subDetailIndex = timeSlot.sub_details.findIndex(detail => detail.days === days);
      if (subDetailIndex === -1) return;

      // const response = await axiosPrivate.delete(`http://localhost:3000/api/weekly-schedules/${scheduleId}/batch`, {
      const response = await deleteWeeklySchedulesData(scheduleId, {
        data: {
          timeIndex,
          subDetailIndex,
          batchId
        }
      });

      console.log('Batch removed from database:', response.data);

      // Refresh the data
      await fetchWeeklySchedules();
    } catch (error) {
      console.error('Error removing batch from database:', error);
      setError('Failed to remove batch');
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    // Clear any existing warnings
    setWarning('');

    if (draggingItem) {
      try {
        // Get the row and cell indices for zone identification
        const row = e.target.closest('tr');
        const cell = e.target.closest('td');

        // Get mentor and slot indices from the row's data attribute (most reliable method)
        const rowData = row.getAttribute('data-mentor-slot');
        if (!rowData) {
          setWarning('Unable to identify mentor and slot!');
          setDraggingItem(null);
          return;
        }

        const [mentorIndex, slotIndex] = rowData.split('-').map(Number);

        // Determine if it's MWF or TTS column by checking the cell's data-zone-id
        const dataZoneId = cell.getAttribute('data-zone-id');
        const isMWF = dataZoneId?.includes('-2');
        const isTTS = dataZoneId?.includes('-4');

        console.log('Drop detected:', {
          rowData,
          mentorIndex,
          slotIndex,
          cellIndex: Array.from(row.children).indexOf(cell),
          mentorName: mentors[mentorIndex]?.name,
          isMWF,
          isTTS,
          dataZoneId,
          hasDropZoneClass: cell.classList.contains('drop-zone')
        });

        if (!isMWF && !isTTS) {
          setWarning('Invalid drop zone! Only MWF and TTS columns are drop zones.');
          setDraggingItem(null);
          return;
        }

        // Find the mentor schedule
        const mentorSchedule = weeklySchedules.find(ws =>
          ws.mentor?.fullName === mentors[mentorIndex]?.name
        );

        if (!mentorSchedule) {
          setWarning('Mentor schedule not found!');
          setDraggingItem(null);
          return;
        }

        // Check if batch already exists in this slot
        const timeSlot = mentorSchedule.schedule[slotIndex];
        if (timeSlot) {
          const targetDetail = timeSlot.sub_details?.find(detail =>
            detail.days === (isMWF ? 'MWF' : 'TTS')
          );

          if (targetDetail?.batch?.some(batch => batch._id === draggingItem.id)) {
            setWarning('This batch is already assigned to this slot!');
            setDraggingItem(null);
            return;
          }
        }

        // Check if the same batch is already assigned to a different mentor at the same time and day
        const targetDays = isMWF ? 'MWF' : 'TTS';
        const batchConflict = weeklySchedules.some(schedule => {
          // Skip the current mentor
          if (schedule._id === mentorSchedule._id) return false;

          // Check if this schedule has the same time slot
          const conflictTimeSlot = schedule.schedule[slotIndex];
          if (!conflictTimeSlot) return false;

          // Check if the same batch exists in the same day (MWF or TTS)
          const conflictDetail = conflictTimeSlot.sub_details?.find(detail =>
            detail.days === targetDays
          );

          return conflictDetail?.batch?.some(batch => batch._id === draggingItem.id);
        });

        if (batchConflict) {
          setWarning(`This batch is already assigned to another mentor at the same time on ${targetDays} days!`);
          setDraggingItem(null);
          return;
        }

        // Find the correct sub-detail index based on days (MWF or TTS)
        const subDetailIndex = timeSlot.sub_details?.findIndex(detail => detail.days === targetDays);

        if (subDetailIndex === -1) {
          setWarning(`No ${targetDays} sub-detail found for this time slot!`);
          setDraggingItem(null);
          return;
        }

        // Add batch to database
        // const response = await axiosPrivate.post(`http://localhost:3000/api/weekly-schedules/${mentorSchedule._id}/batch`, {
        const response = await postWeeklySchedulesData(mentorSchedule._id, {
          timeIndex: slotIndex,
          subDetailIndex: subDetailIndex,
          batchId: draggingItem.id
        });

        console.log('Batch added to database:', response.data);

        // Refresh the data
        await fetchWeeklySchedules();

      } catch (error) {
        console.error('Error adding batch to database:', error);
        setError('Failed to add batch to schedule');
      }

      // Reset the dragging item state after the drop
      setDraggingItem(null);
    }
  };



  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // A single component for all SVG icons to improve code reusability and readability
  const Icon = ({ path, className, viewBox = "0 0 24 24" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path}></path>
    </svg>
  );

  const EyeIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.5C7.94 4.5 4.14 7.22 2.5 12c1.64 4.78 5.44 7.5 9.5 7.5s7.86-2.72 9.5-7.5c-1.64-4.78-5.44-7.5-9.5-7.5zM12 17a5 5 010-10 5 5 010 10zM12 14.5a2.5 2.5 010-5 2.5 2.5 010 5z" />
    </svg>
  );

  const Sidebar = () => (
    <div className="w-64 bg-white shadow-xl min-h-screen p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-2 mb-8">
          <img src="https://placehold.co/40x40" alt="Softronics Logo" className="rounded-lg" />
          <span className="text-xl font-bold">Softronics.</span>
        </div>
        <nav className="space-y-2">
          <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100">
            <Icon path="M3 12h18M3 6h18M3 18h18" className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a href="#" className="flex items-center p-3 rounded-lg text-orange-500 bg-orange-100 font-bold">
            <Icon path="M9 5H7a2 2 000-2v2a2 2 000 2h2zM9 9H7a2 2 000-2v2a2 2 000 2h2zM9 13H7a2 2 000-2v2a2 2 000 2h2zM9 17H7a2 2 000-2v2a2 2 000 2h2zM17 5h-2a2 2 000-2v2a2 2 000 2h2zM17 9h-2a2 2 000-2v2a2 2 000 2h2zM17 13h-2a2 2 000-2v2a2 2 000 2h2zM17 17h-2a2 2 000-2v2a2 2 000 2h2z" className="w-5 h-5 mr-3" />
            Administration
            <Icon path="M9 5l7 7-7 7" className="w-4 h-4 ml-auto" />
          </a>
          <div className="pl-6 space-y-2">
            <a href="#" className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100">Role Management</a>
            <a href="#" className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100">Mentor Module</a>
            <a href="#" className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100">Student Management</a>
          </div>
          <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100">
            <Icon path="M10 21h7a2 2 000-2V9a2 2 000-2H7a2 2 000-2v11zM7 21a2 2 010-2h2a2 2 001 2v2a2 2 001-2v-2h-2z" className="w-5 h-5 mr-3" />
            Course management
            <Icon path="M9 5l7 7-7 7" className="w-4 h-4 ml-auto" />
          </a>
          <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100">
            <Icon path="M12 6.25a.75.75 001.5 0v-4.5a.75.75 00-1.5 0v4.5zM12 12.25a.75.75 001.5 0v-4.5a.75.75 00-1.5 0v4.5zM12 18.25a.75.75 001.5 0v-4.5a.75.75 00-1.5 0v4.5z" className="w-5 h-5 mr-3" />
            Syllabus Management
            <Icon path="M9 5l7 7-7 7" className="w-4 h-4 ml-auto" />
          </a>
          <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100">
            <Icon path="M4 6h16M4 12h16M4 18h16" className="w-5 h-5 mr-3" />
            Task Management
            <Icon path="M9 5l7 7-7 7" className="w-4 h-4 ml-auto" />
          </a>
          <a href="#" className="flex items-center p-3 rounded-lg text-orange-500 bg-orange-100 font-bold">
            <Icon path="M9 5l7 7-7 7" className="w-5 h-5 mr-3" />
            Schedule
            <Icon path="M9 5l7 7-7 7" className="w-4 h-4 ml-auto" />
          </a>
          <div className="pl-6 space-y-2">
            <a href="#" className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100">Batches</a>
            <a href="#" className="flex items-center p-2 rounded-lg text-gray-700 hover:bg-gray-100">Timings</a>
            <a href="#" className="flex items-center p-2 rounded-lg text-orange-500 bg-orange-100 font-bold">Weekly Schedule</a>
          </div>
          <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100">
            <Icon path="M12 6.25a.75.75 001.5 0v-4.5a.75.75 00-1.5 0v4.5zM12 12.25a.75.75 001.5 0v-4.5a.75.75 00-1.5 0v4.5zM12 18.25a.75.75 001.5 0v-4.5a.75.75 00-1.5 0v4.5z" className="w-5 h-5 mr-3" />
            Settings
            <Icon path="M9 5l7 7-7 7" className="w-4 h-4 ml-auto" />
          </a>
        </nav>
      </div>
      <div className="border-t pt-4">
        <a href="#" className="flex items-center p-3 rounded-lg text-red-500 hover:bg-red-50">
          <Icon path="M9 5l7 7-7 7" className="w-5 h-5 mr-3" />
          Log Out
        </a>
      </div>
    </div>
  );


  const renderContent = () => {
    return (
      <div className="p-6 bg-gray-100 min-h-screen font-sans flex-1">
        <Navbar headData={headData} activeTab={activeTab} />
        <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6">
          <div className="lg:w-1/6 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">Batch's</h3>
            <p className="text-sm text-gray-500 mb-4">Drag batches to the weekly live schedule (classes.)</p>
            <div className="relative mb-4">
              <input type="text" placeholder="Search Batch" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500" />
              <Icon path="M21 21l-6-6m2-5a7 7 01-14 0 7 7 0114 0z" className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {/* <div className="space-y-2 max-h-96 overflow-y-auto"> */}
            <div className="space-y-2 overflow-y-auto">
              {loading ? (
                <p className="text-center text-gray-500 py-4">Loading batches...</p>
              ) : error ? (
                <p className="text-center text-red-500 py-4">{error}</p>
              ) : batches.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No batches available</p>
              ) : (
                batches.map((batch, index) => (
                  <div
                    key={batch._id || index}
                    draggable
                    onDragStart={() => handleDragStart(batch)}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-grab hover:bg-gray-100 transition-colors"
                  >
                    <span>{batch.batchName || batch}</span>
                    {/* <EyeIcon className="w-5 h-5 text-gray-500" /> */}
                    <IoEyeOutline />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="lg:flex-1 bg-white p-6 rounded-xl shadow-lg">
            {/* Warning Message */}
            {warning && (
              <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                {warning}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between mb-6 space-y-4 sm:space-y-0">
              <div className="flex-1 min-w-[200px] mb-4 sm:mb-0">
                <h2 className="text-2xl font-bold">Weekly Schedule</h2>
                <p className="text-sm text-gray-500">Total scheduled items: {canvasItems.length}</p>
              </div>
              <div className="flex flex-wrap items-center space-x-2 sm:space-x-4">
                <select className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500">
                  <option>Calicut</option>
                </select>
                <select className="p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500">
                  <option>Alternative</option>
                </select>
                <input type="text" className="p-2 border border-gray-300 rounded-lg shadow-sm" placeholder="25/08/25 - 30/08/25" />
                <button className="flex items-center space-x-2 py-2 px-4 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">
                  <Icon path="M4 16v1a3 3 000 6h16a3 3 000-6v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-5 h-5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full">
                <thead className="bg-orange-500 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Mentors</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Mon, Wen, Fri</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Subject</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Tue, Tur, Sat</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Subject</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mentors.map((mentor, mentorIndex) => (
                    <React.Fragment key={mentorIndex}>
                      {mentor.schedule.map((slot, slotIndex) => (
                        <tr key={`${mentorIndex}-${slotIndex}`} data-mentor-slot={`${mentorIndex}-${slotIndex}`}>
                          {slotIndex === 0 && (
                            <td rowSpan={mentor.schedule.length} className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200 align-top">
                              {mentor.name}
                            </td>
                          )}
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {slot.time}
                          </td>
                          <td
                            className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 relative group drop-zone min-h-[60px] border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            data-zone-id={`${mentorIndex * 3 + slotIndex}-2`}
                          >
                            {/* ====================== */}
                            {/* Get batches from database for this specific mentor and time slot */}
                            {(() => {
                              const mentorSchedule = weeklySchedules.find(ws =>
                                ws.mentor?.fullName === mentor.name
                              );

                              if (!mentorSchedule) {
                                return (
                                  <span className="cursor-pointer">No batches assigned</span>
                                );
                              }

                              const timeSlot = mentorSchedule.schedule[slotIndex];
                              if (!timeSlot) {
                                return (
                                  <span className="cursor-pointer">No batches assigned</span>
                                );
                              }

                              // Find MWF batches for this time slot
                              const mwfDetail = timeSlot.sub_details?.find(detail => detail.days === 'MWF');
                              const mwfBatches = mwfDetail?.batch || [];

                              if (mwfBatches.length === 0) {
                                return (
                                  <span className="cursor-pointer">No batches assigned</span>
                                );
                              }

                              return (
                                <div className="space-y-1">
                                  {mwfBatches.map((batch, index) => (
                                    <div
                                      key={batch._id || index}
                                      className="bg-blue-500 text-white p-2 rounded-lg shadow-md transition-all duration-200 text-xs w-full flex items-center justify-between"
                                    >
                                      <span>{batch.batchName}</span>
                                      {/* Remove button */}
                                      <button
                                        onClick={() => handleRemoveBatchFromDatabase(mentorSchedule._id, slotIndex, 'MWF', batch._id)}
                                        className="bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold text-xs leading-none transition-transform duration-200 hover:scale-110"
                                      >
                                        &times;
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              );
                            })()}

                            <div className="absolute inset-y-0 right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4 text-red-500 cursor-pointer" />
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            <select className="p-1 border border-gray-300 rounded-md shadow-sm text-xs">
                              <option>Choose</option>
                            </select>
                          </td>
                          <td
                            className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 relative group drop-zone min-h-[60px] border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            data-zone-id={`${mentorIndex * 3 + slotIndex}-4`}
                          >
                            {/* Get batches from database for this specific mentor and time slot (TTS) */}
                            {(() => {
                              const mentorSchedule = weeklySchedules.find(ws =>
                                ws.mentor?.fullName === mentor.name
                              );

                              if (!mentorSchedule) {
                                return (
                                  <span className="cursor-pointer">No batches assigned</span>
                                );
                              }

                              const timeSlot = mentorSchedule.schedule[slotIndex];
                              if (!timeSlot) {
                                return (
                                  <span className="cursor-pointer">No batches assigned</span>
                                );
                              }

                              // Find TTS batches for this time slot
                              const ttsDetail = timeSlot.sub_details?.find(detail => detail.days === 'TTS');
                              const ttsBatches = ttsDetail?.batch || [];

                              if (ttsBatches.length === 0) {
                                return (
                                  <span className="cursor-pointer">No batches assigned</span>
                                );
                              }

                              return (
                                <div className="space-y-1">
                                  {ttsBatches.map((batch, index) => (
                                    <div
                                      key={`${batch._id}-2` || index}
                                      className="bg-green-500 text-white p-2 rounded-lg shadow-md transition-all duration-200 text-xs w-full flex items-center justify-between"
                                    >
                                      <span>{batch.batchName}</span>
                                      <button
                                        onClick={() => handleRemoveBatchFromDatabase(mentorSchedule._id, slotIndex, 'TTS', batch._id)}
                                        className="bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold text-xs leading-none transition-transform duration-200 hover:scale-110"
                                      >
                                        &times;
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              );
                            })()}

                            <div className="absolute inset-y-0 right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Icon path="M6 18L18 6M6 6l12 12" className="w-4 h-4 text-red-500 cursor-pointer" />
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            <select className="p-1 border border-gray-300 rounded-md shadow-sm text-xs">
                              <option>Choose</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderContent()}
    </>
  )
}

import React, { useState } from 'react'
import {
    BellRing
  } from 'lucide-react';
import Tabs from '../../../components/button/Tabs';
import { Navbar } from '../../../components/admin/AdminNavBar';

export const Notification = () => {

    const [activeTab, setActiveTab] = useState('notifications');

    
    const tabOptions = [
        { value: "notifications", label: "Notifications" },
        { value: "new-notification", label: "New Notification" }
      ];
      const headData = "Notification";
        // Function to handle form submission
  const handlePublish = () => {
    setModalMessage('Notification published!');
    setShowModal(true);
    // In a real app, you would handle API calls or state updates here.
  };

  // Function to handle form cancellation
  const handleCancel = () => {
    setModalMessage('Notification creation cancelled.');
    setShowModal(true);
    // In a real app, you might clear the form or navigate away.
  };

    // Component for the "Notifications" list view
    const NotificationsView = () => (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl h-full shadow-lg">
            <div className="text-center text-gray-400">
                <BellRing className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-gray-800">No data available.</h2>
                <p className="text-lg text-gray-600">Please add notification to view them here.</p>
            </div>
        </div>
    );

    // Component for the "New Notification" form view
    const NewNotificationForm = () => (
        <div className="p-8 bg-white rounded-3xl h-full shadow-lg">
            <div className="space-y-6">
                {/* Notification Title Input */}
                <div className="flex flex-col">
                    <label htmlFor="notification-title" className="text-sm text-gray-600 mb-2">
                        Notification Title
                    </label>
                    <input
                        type="text"
                        id="notification-title"
                        placeholder="Enter Notification Title"
                        className="p-3 bg-gray-100 text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F9A825]"
                    />
                </div>

                {/* Notification Content Textarea */}
                <div className="flex flex-col">
                    <label htmlFor="notification-content" className="text-sm text-gray-600 mb-2">
                        Notification Content
                    </label>
                    <textarea
                        id="notification-content"
                        placeholder="Enter The Details Of The Notification"
                        rows="5"
                        className="p-3 bg-gray-100 text-gray-800 rounded-xl resize-none border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F9A825]"
                    ></textarea>
                </div>

                {/* Type and Audience Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                        <label htmlFor="notification-type" className="text-sm text-gray-600 mb-2">
                            Type of Notification
                        </label>
                        <select
                            id="notification-type"
                            className="p-3 bg-gray-100 text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F9A825] appearance-none"
                        >
                            <option disabled selected>Choose Type</option>
                            <option>Type 1</option>
                            <option>Type 2</option>
                        </select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="audience" className="text-sm text-gray-600 mb-2">
                            Select Audience
                        </label>
                        <select
                            id="audience"
                            className="p-3 bg-gray-100 text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#F9A825] appearance-none"
                        >
                            <option disabled selected>Choose Audience</option>
                            <option>Audience 1</option>
                            <option>Audience 2</option>
                        </select>
                    </div>
                </div>

                {/* Push Notification Checkbox */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="push-notification"
                        className="w-4 h-4 text-[#F9A825] bg-gray-100 rounded border-gray-300 focus:ring-[#F9A825]"
                    />
                    <label htmlFor="push-notification" className="text-sm text-gray-600">
                        Push Notification
                    </label>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
                <button
                    onClick={handleCancel}
                    className="px-6 py-3 text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-200 transition-colors duration-200"
                >
                    Cancel
                </button>
                <button
                    onClick={handlePublish}
                    className="px-6 py-3 text-white font-medium bg-[#F9A825] rounded-xl hover:bg-[#F9A825] transition-colors duration-200"
                >
                    Publish
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
            {activeTab === 'notifications' && <NotificationsView />}
            {activeTab === 'new-notification' && <NewNotificationForm />}
        </div>
        </>
    )
}

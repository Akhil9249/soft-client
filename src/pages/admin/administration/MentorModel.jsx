// import React from 'react'

import { useState, useEffect } from "react";
import api from "../../../axios";
import Tabs from "../../../components/button/Tabs";
import { Navbar } from "../../../components/admin/AdminNavBar";

export const MentorModel = () => {
    const [activeTab, setActiveTab] = useState('mentorsList');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [mentors, setMentors] = useState([]);
    const [branches, setBranches] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingMentor, setEditingMentor] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        // Basic Details
        fullName: "",
        dateOfBirth: "",
        gender: "",
        email: "",
        mentorPhoneNumber: "",
        mentorWhatsAppNumber: "",
        mentorPermanentAddress: "",
        district: "",
        state: "",
        photo: "",

        // Professional Details
        department: "",
        branch: "",
        yearsOfExperience: "",
        dateOfJoining: "",
        employmentStatus: "",
        resignationDate: "",
        resume: "",
        remarks: "",

        // Login & Access
        officialEmail: "",
        password: "",
        confirmPassword: "",
    });
    const [openSections, setOpenSections] = useState({
        administration: true,
        course: false,
        syllabus: false,
        task: false,
        schedule: false,
        settings: false,
    });

    const toggleSection = (section) => {
        setOpenSections(prevState => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    const headData = "Mentor Management"

    // Fetch mentors from backend
    const fetchMentors = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await api.get('http://localhost:3000/api/mentor');
            // Handle different response structures
            const mentorsData = res.data?.data || res.data || [];
            setMentors(Array.isArray(mentorsData) ? mentorsData : []);
        } catch (err) {
            console.error('Failed to load mentors:', err);
            setError('Failed to load mentors');
            setMentors([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch branches from backend
    const fetchBranches = async () => {
        try {
            const res = await api.get('http://localhost:3000/api/branches');
            // Handle different response structures
            const branchesData = res.data?.data || res.data || [];
            setBranches(Array.isArray(branchesData) ? branchesData : []);
        } catch (err) {
            console.error('Failed to load branches:', err);
            setBranches([]);
        }
    };

    // Load mentors and branches when component mounts
    useEffect(() => {
        fetchMentors();
        fetchBranches();
    }, []);

    // Clear messages when switching tabs
    useEffect(() => {
        setError('');
        setSuccess('');
    }, [activeTab]);

    // Filter mentors based on search term
    const filteredMentors = (mentors || []).filter(mentor =>
        mentor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tabOptions = [
        { value: "mentorsList", label: "Mentors List" },
        { value: "newMentor", label: isEditMode ? "Edit Mentor" : "New Mentor" }
    ];

    const departments = ['Choose Department', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering'];
    const employmentStatus = ['Choose Employment Status', 'Active', 'Inactive'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetMessages = () => {
        setError("");
        setSuccess("");
    };

    // Helper function to format date for input field
    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        return date.toISOString().split('T')[0];
    };

    const handleEditMentor = (mentor) => {
        setEditingMentor(mentor);
        setIsEditMode(true);
        setFormData({
            fullName: mentor.fullName || "",
            dateOfBirth: formatDateForInput(mentor.dateOfBirth),
            gender: mentor.gender || "",
            email: mentor.email || "",
            mentorPhoneNumber: mentor.mentorPhoneNumber || "",
            mentorWhatsAppNumber: mentor.mentorWhatsAppNumber || "",
            mentorPermanentAddress: mentor.mentorPermanentAddress || "",
            district: mentor.district || "",
            state: mentor.state || "",
            photo: mentor.photo || "",
            department: mentor.department || "",
            branch: mentor.branch?._id || mentor.branch || "",
            yearsOfExperience: mentor.yearsOfExperience || "",
            dateOfJoining: formatDateForInput(mentor.dateOfJoining),
            employmentStatus: mentor.employmentStatus || "",
            resignationDate: formatDateForInput(mentor.resignationDate),
            resume: mentor.resume || "",
            remarks: mentor.remarks || "",
            officialEmail: mentor.officialEmail || "",
            password: "",
            confirmPassword: "",
        });
        setActiveTab('newMentor');
    };

    const handleCancelEdit = () => {
        setEditingMentor(null);
        setIsEditMode(false);
        setFormData({
            fullName: "",
            dateOfBirth: "",
            gender: "",
            email: "",
            mentorPhoneNumber: "",
            mentorWhatsAppNumber: "",
            mentorPermanentAddress: "",
            district: "",
            state: "",
            photo: "",
            department: "",
            branch: "",
            yearsOfExperience: "",
            dateOfJoining: "",
            employmentStatus: "",
            resignationDate: "",
            resume: "",
            remarks: "",
            officialEmail: "",
            password: "",
            confirmPassword: "",
        });
        setActiveTab('mentorsList');
    };

    const handleCreateMentor = async (e) => {
        e.preventDefault();
        resetMessages();

        // Basic validation - only check password matching if password is provided
        if (formData.password && formData.password.trim() !== '' && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        // Different validation for create vs edit
        const requiredFields = isEditMode 
            ? [
                'fullName', 'dateOfBirth', 'gender', 'email', 'mentorPhoneNumber',
                'department', 'branch', 'dateOfJoining', 'employmentStatus',
                'officialEmail'
              ]
            : [
                'fullName', 'dateOfBirth', 'gender', 'email', 'mentorPhoneNumber',
                'department', 'branch', 'dateOfJoining', 'employmentStatus',
                'officialEmail', 'password'
              ];

        const missing = requiredFields.filter((f) => !String(formData[f] || '').trim());
        if (missing.length) {
            setError(`Please fill required fields: ${missing.join(', ')}`);
            return;
        }

        // Build payload matching backend schema (omit confirmPassword)
        const payload = {
            fullName: formData.fullName,
            dateOfBirth: formData.dateOfBirth || null,
            gender: formData.gender,
            email: formData.email,
            mentorPhoneNumber: formData.mentorPhoneNumber,
            mentorWhatsAppNumber: formData.mentorWhatsAppNumber || "",
            mentorPermanentAddress: formData.mentorPermanentAddress || "",
            district: formData.district || "",
            state: formData.state || "",
            photo: formData.photo || "",
            department: formData.department,
            branch: formData.branch,
            yearsOfExperience: formData.yearsOfExperience ? Number(formData.yearsOfExperience) : 0,
            dateOfJoining: formData.dateOfJoining || null,
            employmentStatus: formData.employmentStatus,
            resignationDate: formData.resignationDate || null,
            resume: formData.resume || "",
            remarks: formData.remarks || "",
            officialEmail: formData.officialEmail,
        };

        // Only include password if it's provided (for new mentors or password updates)
        if (formData.password && formData.password.trim() !== '') {
            payload.password = formData.password;
        }

        try {
            setLoading(true);
            let res;
            if (isEditMode && editingMentor) {
                // Update existing mentor
                res = await api.put(`http://localhost:3000/api/mentor/${editingMentor._id}`, payload);
                setSuccess('Mentor updated successfully.');
            } else {
                // Create new mentor
                res = await api.post('http://localhost:3000/api/mentor', payload);
                setSuccess('Mentor created successfully.');
            }
            
            // Refresh mentors list
            await fetchMentors();
            // Switch tab and reset form
            setActiveTab('mentorsList');
            setEditingMentor(null);
            setIsEditMode(false);
            setFormData({
                fullName: "",
                dateOfBirth: "",
                gender: "",
                email: "",
                mentorPhoneNumber: "",
                mentorWhatsAppNumber: "",
                mentorPermanentAddress: "",
                district: "",
                state: "",
                photo: "",
                department: "",
                branch: "",
                yearsOfExperience: "",
                dateOfJoining: "",
                employmentStatus: "",
                resignationDate: "",
                resume: "",
                remarks: "",
                officialEmail: "",
                password: "",
                confirmPassword: "",
            });
        } catch (err) {
            console.error('Mentor operation error:', err);
            console.error('Error response:', err?.response?.data);
            const msg = err?.response?.data?.message || err?.message || `Failed to ${isEditMode ? 'update' : 'create'} mentor`;
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const renderMentorsList = () => (
        <div className="bg-white p-6 rounded-lg shadow-md flex-grow">
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
                            placeholder="Search Mentor"
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

            {/* Mentors Table */}
            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading mentors...</p>
                    </div>
                </div>
            ) : filteredMentors.length === 0 ? (
                <div className="flex items-center justify-center p-12">
                    <p className="text-gray-500 text-lg">
                        {searchTerm ? 'No mentors found matching your search.' : 'No mentors available. Please add mentors to view them here.'}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredMentors.map((mentor) => (
                                <tr key={mentor._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                                    <span className="text-orange-600 font-medium text-sm">
                                                        {mentor.fullName?.charAt(0)?.toUpperCase() || 'M'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{mentor.fullName}</div>
                                                <div className="text-sm text-gray-500">{mentor.mentorPhoneNumber}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{mentor.email}</div>
                                        <div className="text-sm text-gray-500">{mentor.officialEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mentor.department}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{mentor.branch?.branchName || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            mentor.employmentStatus === 'Active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {mentor.employmentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => handleEditMentor(mentor)}
                                                className="text-orange-600 hover:text-orange-900"
                                            >
                                                Edit
                                            </button>
                                            <button className="text-red-600 hover:text-red-900">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const renderNewMentorForm = () => (
        <form onSubmit={handleCreateMentor} className="bg-white p-6 rounded-lg shadow-md flex-grow ">
        {/* <form onSubmit={handleCreateMentor} className="bg-white p-6 rounded-lg shadow-md flex-grow overflow-auto max-h-[calc(100vh-200px)]"> */}
            {/* <form onSubmit={handleCreateMentor} className="bg-white p-6 rounded-lg shadow-md flex-grow"> */}
            {error && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">{error}</div>
            )}
            {success && (
                <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded">{success}</div>
            )}
            <h2 className="text-xl font-bold text-gray-800 mb-6">
                {isEditMode ? `Edit Mentor - ${editingMentor?.fullName}` : 'Create New Mentor'}
            </h2>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 ">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                    <input name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" placeholder="Enter full name" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
                    <input name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} type="date" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option value="">Choose Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Enter Email Address" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Mentor Phone Number</label>
                    <input name="mentorPhoneNumber" value={formData.mentorPhoneNumber} onChange={handleInputChange} type="tel" placeholder="Enter Mentor Phone Number" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Mentor WhatsApp Number</label>
                    <input name="mentorWhatsAppNumber" value={formData.mentorWhatsAppNumber} onChange={handleInputChange} type="tel" placeholder="Enter Mentor WhatsApp Number" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Mentor Permanent Address</label>
                    <input name="mentorPermanentAddress" value={formData.mentorPermanentAddress} onChange={handleInputChange} type="text" placeholder="Enter Mentor Permanent Address" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">District</label>
                    <input name="district" value={formData.district} onChange={handleInputChange} type="text" placeholder="Enter Mentor District" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">State</label>
                    <input name="state" value={formData.state} onChange={handleInputChange} type="text" placeholder="Enter Mentor State" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Photo <span className="text-gray-400">(Photo format: JPG/PNG only)</span></label>
                    <div className="flex items-center w-full px-4 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent">
                        <span className="text-gray-500 flex-1">Upload Photo</span>
                        <input onChange={(e) => setFormData((p) => ({ ...p, photo: e.target.files?.[0]?.name || "" }))} type="file" className="sr-only" id="photo-upload" />
                        <label htmlFor="photo-upload" className="cursor-pointer text-gray-500 hover:text-orange-500">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm3-4a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1v-2z" clipRule="evenodd"></path>
                            </svg>
                        </label>
                    </div>
                </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Department</label>
                    <select name="department" value={formData.department} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        {departments.map((dept) => <option key={dept} value={dept === 'Choose Department' ? '' : dept}>{dept}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Branch</label>
                    <select name="branch" value={formData.branch} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option value="">Choose Branch</option>
                        {branches.map((branch) => (
                            <option key={branch._id} value={branch._id}>
                                {branch.branchName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Years of Experience</label>
                    <input name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleInputChange} type="number" min="0" placeholder="Enter years of experience" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Date of Joining</label>
                    <input name="dateOfJoining" value={formData.dateOfJoining} onChange={handleInputChange} type="date" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Employment Status</label>
                    <select name="employmentStatus" value={formData.employmentStatus} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        {employmentStatus.map((status) => <option key={status} value={status === 'Choose Employment Status' ? '' : status}>{status}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Resignation Date <span className="text-gray-400">(Only If Inactive)</span></label>
                    <input name="resignationDate" value={formData.resignationDate} onChange={handleInputChange} type="date" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Resume <span className="text-gray-400">(Upload PDF only Max 5MB)</span></label>
                    <div className="flex items-center w-full px-4 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent">
                        <span className="text-gray-500 flex-1">Upload resume</span>
                        <input onChange={(e) => setFormData((p) => ({ ...p, resume: e.target.files?.[0]?.name || "" }))} type="file" className="sr-only" id="resume-upload" />
                        <label htmlFor="resume-upload" className="cursor-pointer text-gray-500 hover:text-orange-500">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm3-4a1 1 0 011-1h6a1 1 0 011 1v2a1 1 0 01-1 1H7a1 1 0 01-1-1v-2z" clipRule="evenodd"></path>
                            </svg>
                        </label>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Remarks/Notes <span className="text-gray-400">(Optional)</span></label>
                    <input name="remarks" value={formData.remarks} onChange={handleInputChange} type="text" placeholder="Enter Any Remarks or notes" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Login & Access</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Mentor's Official Email Address</label>
                    <input name="officialEmail" value={formData.officialEmail} onChange={handleInputChange} type="email" placeholder="Enter Mentor's Official Email Address" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        {isEditMode ? 'Update Password' : 'Create Password'}
                        {isEditMode && <span className="text-red-400 text-[12px] ml-1">(Leave blank to keep current password)</span>}
                    </label>
                    <input 
                        name="password" 
                        value={formData.password} 
                        onChange={handleInputChange} 
                        type="password" 
                        placeholder={isEditMode ? "Enter new password (optional)" : "Create A Password"} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        {isEditMode ? 'Confirm New Password' : 'Confirm Password'}
                        {isEditMode && <span className="text-red-400 text-[12px] ml-1">(Only if updating password)</span>}
                    </label>
                    <input 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleInputChange} 
                        type="password" 
                        placeholder={isEditMode ? "Re-enter new password (optional)" : "Re-Enter The Password"} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                    />
                </div>
            </div>
            <div className="flex justify-end mt-8 space-x-4">
                <button 
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                    Cancel
                </button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-orange-500 text-white rounded-md font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 disabled:opacity-60">
                    {loading 
                        ? (isEditMode ? 'Updating...' : 'Creating...') 
                        : (isEditMode ? 'Update Mentor' : 'Create Mentor')
                    }
                </button>
            </div>
        </form>
    );


    return (
        <div>

            <Navbar headData={headData} activeTab={activeTab} />

            <div className="mb-6">
                <Tabs tabs={tabOptions} activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Conditional Rendering */}
            {activeTab === 'mentorsList' ? renderMentorsList() : renderNewMentorForm()}

        </div>
    )
}

// export default MentorModel
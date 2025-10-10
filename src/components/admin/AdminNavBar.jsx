import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RxPerson } from "react-icons/rx";

import {
  BellRing,
  Settings,
  User,
  LayoutDashboard,
  Users,
  Book,
  FileText,
  Calendar,
  LogOut,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  SquarePen,
  Download,
  X,
  Send
} from 'lucide-react';

const Icon = ({ path, className, viewBox = "0 0 24 24" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path}></path>
  </svg>
);

const Sidebar = () => {
  // const [isOpen, setIsOpen] = useState(false);
  // const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    administration: true,
    course: false,
    syllabus: false,
    task: false,
    schedule: false,
    attendance: false,
    settings: false,
  });

  const toggleSection = (section) => {
    setOpenSections(prevState => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <aside className="w-64 bg-white p-6 shadow-md flex flex-col justify-between rounded-r-2xl ">
    {/* <aside className="w-64 bg-white p-6 shadow-md flex flex-col justify-between rounded-r-2xl max-h-screen  overflow-y-auto"> */}
      <div>
        <div className="flex items-center mb-8">
          <svg
            className="w-8 h-8 text-orange-500 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15L4 12l6-5 6 5-6 5z" />
          </svg>
          <span className="text-xl font-bold text-gray-800">Softronics</span>
        </div>
        <nav className="space-y-4">
          <a href="#" className="flex items-center text-gray-600 hover:text-orange-500 font-medium p-2 rounded-lg transition-colors duration-200">
            {/* <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7-8v8m14-8v8"></path></svg> */}
            <LayoutDashboard className="w-5 h-5 mr-3" />
            
            
            Dashboard
          </a>

          <div className={`font-medium ${openSections.administration ? 'text-orange-500' : 'text-gray-600'}`}>
            <div onClick={() => toggleSection('administration')} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              {/* <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h6z"></path></svg> */}
              <Users className="w-5 h-5 mr-3" />
              Administration
              <svg className={`ml-auto w-4 h-4 transform transition-transform duration-200 ${openSections.administration ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
            {openSections.administration && (
              <ul className="pl-8 mt-2 space-y-2 text-sm text-gray-500">
                <li> <Link to="/" className="block py-1 text-orange-500 font-semibold">Role Management</Link></li>
                <li><Link to="/staff-management" className="block py-1 hover:text-orange-500">Staff Management</Link></li>
                <li><Link to="/student-management" className="block py-1 hover:text-orange-500">Intern Management</Link></li>
              </ul>
            )}
          </div>

          <div className={`font-medium ${openSections.course ? 'text-orange-500' : 'text-gray-600'}`}>
            <div onClick={() => toggleSection('course')} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              {/* <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h6z"></path></svg> */}
              <Book className="w-5 h-5 mr-3" />
              Course management
              <svg className={`ml-auto w-4 h-4 transform transition-transform duration-200 ${openSections.course ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
            {openSections.course && (
              <ul className="pl-8 mt-2 space-y-2 text-sm text-gray-500">
                <li><Link to="/category" className="block py-1 hover:text-orange-500">Categories</Link></li>
                <li><Link to="/courses" className="block py-1 hover:text-orange-500">Courses</Link></li>
              </ul>
            )}
          </div>

          <div className={`font-medium ${openSections.syllabus ? 'text-orange-500' : 'text-gray-600'}`}>
            <div onClick={() => toggleSection('syllabus')} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              {/* <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h6z"></path></svg> */}
              <FileText className="w-5 h-5 mr-3" />

              Syllabus Management
              <svg className={`ml-auto w-4 h-4 transform transition-transform duration-200 ${openSections.syllabus ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
            {openSections.syllabus && (
              <ul className="pl-8 mt-2 space-y-2 text-sm text-gray-500">
                <li><Link to="/modules" className="block py-1 hover:text-orange-500">Modules</Link></li>
                <li><Link to="/topics" className="block py-1 hover:text-orange-500">Topics</Link></li>
              </ul>
            )}
          </div>

          <div className={`font-medium ${openSections.task ? 'text-orange-500' : 'text-gray-600'}`}>
            <div onClick={() => toggleSection('task')} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <SquarePen className="w-5 h-5 mr-3" />
              Task Management
              <svg className={`ml-auto w-4 h-4 transform transition-transform duration-200 ${openSections.task ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
            {openSections.task && (
              <ul className="pl-8 mt-2 space-y-2 text-sm text-gray-500">
                <li><Link to="/task-management" className="block py-1 hover:text-orange-500">Task</Link></li>
                <li><Link to="/material" className="block py-1 hover:text-orange-500">Material</Link></li>
              </ul>
            )}
          </div>

          <div className={`font-medium ${openSections.schedule ? 'text-orange-500' : 'text-gray-600'}`}>
            <div onClick={() => toggleSection('schedule')} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              {/* <Icon path="M12 6V4m0 2a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h6z" className="w-5 h-5 mr-3" /> */}
              <Calendar className="w-5 h-5 mr-3" />

              Schedule
              <svg className={`ml-auto w-4 h-4 transform transition-transform duration-200 ${openSections.schedule ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
            {openSections.schedule && (
              <ul className="pl-8 mt-2 space-y-2 text-sm text-gray-500">
                <li><Link to="/batches" className="block py-1 hover:text-orange-500">Batches</Link></li>
                <li><Link to="/timings" className="block py-1 hover:text-orange-500">Timings</Link></li>
                {/* <li><a href="#" onClick={() => setActiveTab('timings')} className={`block py-1 ${activeTab === 'timings' ? 'text-orange-500 font-semibold' : 'hover:text-orange-500'}`}>Timings</a></li> */}
                <li><Link to="/weekly-schedule" className="block py-1 hover:text-orange-500">Weekly Schedule</Link></li>
              </ul>
            )}
          </div>

          <div className={`font-medium ${openSections.attendance ? 'text-orange-500' : 'text-gray-600'}`}>
            <div onClick={() => toggleSection('attendance')} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <Calendar className="w-5 h-5 mr-3" />
              Attendance
              <svg className={`ml-auto w-4 h-4 transform transition-transform duration-200 ${openSections.attendance ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
            {openSections.attendance && (
              <ul className="pl-8 mt-2 space-y-2 text-sm text-gray-500">
                <li><Link to="/student-attendance" className="block py-1 hover:text-orange-500">Student Attendance</Link></li>
                <li><Link to="/leave-request" className="block py-1 hover:text-orange-500">Leave Request</Link></li>
              </ul>
            )}
          </div>

          <div className={`font-medium ${openSections.settings ? 'text-orange-500' : 'text-gray-600'}`}>
            <div onClick={() => toggleSection('settings')} className="flex items-center cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              {/* <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h6z"></path></svg> */}
              <Settings className="w-5 h-5 mr-3" />

              Settings
              <svg className={`ml-auto w-4 h-4 transform transition-transform duration-200 ${openSections.settings ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </div>
            {openSections.settings && (
              <ul className="pl-8 mt-2 space-y-2 text-sm text-gray-500">
                <li><Link to="/static-pages" className="block py-1 hover:text-orange-500">Static Page</Link></li>
                <li><Link to="/notification" className="block py-1 hover:text-orange-500">Notification</Link></li>
              </ul>
            )}
          </div>

        </nav>

        <div className="mt-8">
        <a href="#" className="flex items-center text-red-500 font-medium p-2 rounded-lg transition-colors duration-200">
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Log Out
        </a>
      </div>
      </div>
      
    </aside>
  );
};

export default Sidebar;

const Navbar = ({headData , activeTab}) => {

  return (
    <header className="flex justify-between items-center mb-6 ">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-gray-800">{headData}</h1>
        <p className="text-sm text-gray-500">{headData} &gt; {activeTab}</p>
      </div>
      <div className="flex items-center space-x-4 border border-[50px] rounded-lg p-2 border-red-500">
        {/* <div className="flex flex-col items-end"> */}
        <div className="w-10 h-10 rounded-full bg-gray-300  flex items-center justify-center">
          <RxPerson />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">Priyesh</span>
          <span className="text-sm text-gray-500">Super Admin</span>
        </div>
        
      </div>
    </header>
  );
};

export { Navbar }; 

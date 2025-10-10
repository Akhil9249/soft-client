import React from 'react'

import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const AdminService = () => {

    const axiosPrivate = useAxiosPrivate()

    // ======================================== register and login ========================================

    const postRegister = async (data) => {
        const response = await axiosPrivate.post("/api/signup",data);
        return response;
    };

    const postLogin = async (data) => {
        const response = await axiosPrivate.post("/api/login",data);
        return response;
    };

    // ======================================== staff management ========================================

    const getStaffData = async () => {
        const response = await axiosPrivate.get("/api/staff");
        return response.data;
    };

    const postStaffData = async (data) => {
        const response = await axiosPrivate.post("/api/staff",data);
        return response.data;
    };

    const putStaffData = async (staffId, data) => {

        const response = await axiosPrivate.put(`/api/staff/${staffId}`, data)
        return response?.data?.data
    };

    const deleteStaffData = async (staffId) => {
        const response = await axiosPrivate.delete(`/api/staff/${staffId}`);
        return response?.data?.data
    };



    // ======================================== branch management ========================================

    const getBranchesData = async () => {
        const response = await axiosPrivate.get("/api/branches");
        return response.data;
    };

    const postBranchesData = async (data) => {
        const response = await axiosPrivate.post("/api/branches",data);
        return response.data;
    };
    const putBranchesData = async (branchId, data) => {
        const response = await axiosPrivate.put(`/api/branches/${branchId}`, data);
        return response.data;
    };
    const deleteBranchesData = async (branchId) => {
        const response = await axiosPrivate.delete(`/api/branches/${branchId}`);
        return response.data;
    };

    // ======================================== intern management ========================================

    const getInternsData = async () => {
        const response = await axiosPrivate.get("/api/intern");
        return response.data;
    };

    const postInternsData = async (data) => {
        const response = await axiosPrivate.post("/api/intern",data);
        return response.data;
    };

    const putInternsData = async (internId, data) => {
        const response = await axiosPrivate.put(`/api/intern/${internId}`, data);
        return response.data;
    };

    const deleteInternsData = async (internId) => {
        const response = await axiosPrivate.delete(`/api/intern/${internId}`);
        return response.data;
    };

    // ======================================== batch management ========================================

    const getBatchesData = async () => {
        const response = await axiosPrivate.get("/api/batches");
        return response.data;
    };
    const postBatchesData = async (data) => {
        const response = await axiosPrivate.post("/api/batches",data);
        return response.data;
    };
    const putBatchesData = async (batchId, data) => {
        const response = await axiosPrivate.put(`/api/batches/${batchId}`, data);
        return response.data;
    };
    const deleteBatchesData = async (batchId) => {
        const response = await axiosPrivate.delete(`/api/batches/${batchId}`);
        return response.data;
    };  

    // ======================================== course management ========================================

    const getCoursesData = async () => {
        const response = await axiosPrivate.get("/api/course");
        return response.data;
    };

    const postCoursesData = async (data) => {
        const response = await axiosPrivate.post("/api/course",data);
        return response.data;
    };
    
    const putCoursesData = async (courseId, data) => {
        const response = await axiosPrivate.put(`/api/course/${courseId}`, data);
        return response.data;
    };
    const deleteCoursesData = async (courseId) => {
        const response = await axiosPrivate.delete(`/api/course/${courseId}`);
        return response.data;
    };

    // ======================================== category management ========================================

    const getCategoriesData = async () => {
        const response = await axiosPrivate.get("/api/category");
        return response.data;
    };
    
    const postCategoriesData = async (data) => {
        const response = await axiosPrivate.post("/api/category",data);
        return response.data;
    };
    
    const putCategoriesData = async (categoryId, data) => {
        const response = await axiosPrivate.put(`/api/category/${categoryId}`, data);
        return response.data;
    };

    const deleteCategoriesData = async (categoryId) => {
        const response = await axiosPrivate.delete(`/api/category/${categoryId}`);
        return response.data;
    };

    // ======================================== module management ========================================

    const getModulesData = async () => {
        const response = await axiosPrivate.get("/api/module");
        return response.data;
    };
    
    const postModulesData = async (data) => {
        const response = await axiosPrivate.post("/api/module",data);
        return response.data;
    };
    
    const putModulesData = async (moduleId, data) => {
        const response = await axiosPrivate.put(`/api/module/${moduleId}`, data);
        return response.data;
    };
    
    const deleteModulesData = async (moduleId) => {
        const response = await axiosPrivate.delete(`/api/module/${moduleId}`);
        return response.data;
    };

    // ======================================== topic management ========================================

    const getTopicsData = async () => {
        const response = await axiosPrivate.get("/api/topics");
        return response.data;
    };
    
    const postTopicsData = async (data) => {
        const response = await axiosPrivate.post("/api/topics",data);
        return response.data;
    };
    
    const putTopicsData = async (topicId, data) => {
        const response = await axiosPrivate.put(`/api/topics/${topicId}`, data);
        return response.data;
    };
    
    const deleteTopicsData = async (topicId) => {
        const response = await axiosPrivate.delete(`/api/topics/${topicId}`);
        return response.data;
    };

    // ======================================== task management ========================================

    const getTasksData = async () => {
        const response = await axiosPrivate.get("/api/tasks");
        return response.data;
    };

    const postTasksData = async (data) => {
        const response = await axiosPrivate.post("/api/tasks",data);
        return response.data;
    };
    
    const putTasksData = async (taskId, data) => {
        const response = await axiosPrivate.put(`/api/tasks/${taskId}`, data);
        return response.data;
    };
    
    const deleteTasksData = async (taskId) => {
        const response = await axiosPrivate.delete(`/api/tasks/${taskId}`);
        return response.data;
    };

    // ======================================== timing management ========================================

    const getTimingsData = async () => {
        const response = await axiosPrivate.get("/api/timings");
        return response.data;
    };
    
    const postTimingsData = async (data) => {
        const response = await axiosPrivate.post("/api/timings",data);
        return response.data;
    };
    
    const putTimingsData = async (timingId, data) => {
        const response = await axiosPrivate.put(`/api/timings/${timingId}`, data);
        return response.data;
    };
    
    const deleteTimingsData = async (timingId) => {
        const response = await axiosPrivate.delete(`/api/timings/${timingId}`);
        return response.data;
    };
    // ======================================== weekly schedule management ========================================
    const getWeeklySchedulesData = async () => {
        const response = await axiosPrivate.get("/api/weekly-schedules");
        return response.data;
    };
    const postWeeklySchedulesData = async (data) => {
        const response = await axiosPrivate.post("/api/weekly-schedules",data);
        return response.data;
    };
    const putWeeklySchedulesData = async (scheduleId, data) => {
        const response = await axiosPrivate.post(`/api/weekly-schedules/${scheduleId}/batch`, data);
        return response.data;
    };
    const deleteWeeklySchedulesData = async (scheduleId, data) => {
        const response = await axiosPrivate.delete(`/api/weekly-schedules/${scheduleId}/batch`, {data});
        return response.data;
    };

    // ======================================== interns attendance management ========================================
    const getInternsAttendanceData = async (params = {}) => {
        const response = await axiosPrivate.get("/api/interns-attendance", { params });
        return response;
    };

    const postInternsAttendanceData = async (data) => {
        const response = await axiosPrivate.post("/api/interns-attendance", data);
        return response;
    };

    const putInternsAttendanceData = async (attendanceId, data) => {
        const response = await axiosPrivate.put(`/api/interns-attendance/${attendanceId}`, data);
        return response;
    };

    const deleteInternsAttendanceData = async (attendanceId) => {
        const response = await axiosPrivate.delete(`/api/interns-attendance/${attendanceId}`);
        return response;
    };

    const getInternsAttendanceByDateRange = async (startDate, endDate, intern = null) => {
        const params = { startDate, endDate };
        if (intern) params.intern = intern;
        const response = await axiosPrivate.get("/api/interns-attendance/date-range/range", { params });
        return response;
    };

    const getInternsAttendanceSummary = async (params = {}) => {
        const response = await axiosPrivate.get("/api/interns-attendance/summary/overview", { params });
        return response;
    };

    // ======================================== automatic attendance system ========================================
    const createDailyAttendanceForAllInterns = async () => {
        const response = await axiosPrivate.post("/api/interns-attendance/create-daily");
        return response;
    };

    const updateSingleInternAttendance = async (data) => {
        const response = await axiosPrivate.put("/api/interns-attendance/update-single", data);
        return response;
    };

    const getAttendanceSummaryReport = async (startDate, endDate) => {
        const response = await axiosPrivate.get("/api/interns-attendance/summary-report", { 
            params: { startDate, endDate } 
        });
        return response;
    };

    const getInternsByAttendanceDate = async (date, branchId = null) => {
        const params = { date };
        if (branchId) {
            params.branchId = branchId;
        }
        const response = await axiosPrivate.get("/api/interns-attendance/interns-by-date", { 
            params 
        });
        return response;
    };

    return {

        postRegister,
        postLogin,
        getStaffData,
        putStaffData,
        postStaffData,
        deleteStaffData,
        getBranchesData,
        postBranchesData,
        putBranchesData,
        deleteBranchesData,
        getInternsData,
        putInternsData,
        postInternsData,
        deleteInternsData,
        getBatchesData,
        postBatchesData,
        putBatchesData,
        deleteBatchesData,
        getCategoriesData,
        putCategoriesData,
        postCategoriesData,
        deleteCategoriesData,
        getCoursesData,
        postCoursesData,
        putCoursesData,
        deleteCoursesData,
        getModulesData,
        postModulesData,
        putModulesData,
        deleteModulesData, 
        getTopicsData,
        postTopicsData,
        putTopicsData,
        deleteTopicsData,
        getTasksData,
        postTasksData,
        putTasksData,
        deleteTasksData,
        getTimingsData,
        postTimingsData,
        putTimingsData,
        deleteTimingsData,
        getWeeklySchedulesData,
        postWeeklySchedulesData,
        putWeeklySchedulesData,
        deleteWeeklySchedulesData,
        
        // ======================================== interns attendance management ========================================
        getInternsAttendanceData,
        postInternsAttendanceData,
        putInternsAttendanceData,
        deleteInternsAttendanceData,
        getInternsAttendanceByDateRange,
        getInternsAttendanceSummary,
        createDailyAttendanceForAllInterns,
        updateSingleInternAttendance,
        getAttendanceSummaryReport,
        getInternsByAttendanceDate

    };
};

export default AdminService
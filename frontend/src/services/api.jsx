// Create a basic Axios instance pointing to our Spring Boot server
import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:8081/api",
    headers: {
        "Content-Type": "application/json"
    }
});

// The Axios Interceptor
apiClient.interceptors.request.use(
    (config) => {
        // Look for the token in the browser's local Storage
        const token = localStorage.getItem('jwt_token');
        if(token) {
            // If found, attach it as a Bearer token
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// We map out our backend endpoints here

// ---- USER ENDPOINTS ----
export const registerUser = (userData) => apiClient.post("/users/register", userData)
export const loginUser = (credentials) => apiClient.post("/users/login", credentials)

// ---- DEPARTMENT ENDPOINTS ----
export const getAllDepartments = () => apiClient.get("/departments/all")
export const getMyDepartments = () => apiClient.get("/departments/mine")

// ---- ADMIN ENDPOINTS ----
export const getAdminAnalytics = () => apiClient.get('/admin/analytics');
export const createDepartment = (departmentData) => apiClient.post("/admin/departments", departmentData)
export const registerOfficer = (officerData) => apiClient.post("/admin/officers", officerData)

// ---- COMPLAINT ENDPOINTS ----
export const submitComplaint = (complaintData) => apiClient.post("/complaints/submit", complaintData)
export const uploadComplaintAttachments = (complaintId, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return apiClient.post(`/complaints/${complaintId}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};
export const submitComplaintRating = (complaintId, ratingData) => apiClient.post(`/complaints/${complaintId}/rating`, ratingData);
// GET methods for different dashboard views
export const getAllComplaints = () => apiClient.get("/complaints/all")
export const getCitizenComplaints = (citizenId) => apiClient.get(`/complaints/citizen/${citizenId}`)
export const getDepartmentComplaints = (departmentId) => apiClient.get(`/complaints/department/${departmentId}`)
// PATCH method for updating complaint status
export const updateComplaintStatus = (id, status) => apiClient.patch(`/complaints/${id}/status`, {status})
export const addComplaintRemark = (id, remark) => apiClient.post(`/complaints/${id}/remarks`, { remark })

// ---- AI CHAT ENDPOINTS ----
export const askLokMitra = (message) => apiClient.post('/chat', { message });

// ---- COMMUNITY POST ENDPOINTS ----
// Fetch the live community feed
export const getCommunityFeed = (ward) => apiClient.get(`/community/feed?ward=${ward}`);
// Submit a poll vote
export const submitPollVote = (optionId) => apiClient.post(`/community/poll/vote/${optionId}`);
// Publish a new post to the community feed
export const createCommunityPost = (postData) => apiClient.post('/community/create', postData);

// ---- NOTIFICATION ENDPOINTS ----
export const getNotifications = () => apiClient.get('/notifications');
export const getUnreadNotificationCount = () => apiClient.get('/notifications/unread-count');
export const markNotificationAsRead = (id) => apiClient.patch(`/notifications/${id}/read`);
export const markAllNotificationsAsRead = () => apiClient.patch('/notifications/read-all');

export default apiClient;

import axios from 'axios';



export const axiosInstance = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials: true
})

// Add Authorization Header
axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken"); // Get token from localStorage
    const adminAccessToken = localStorage.getItem("adminAccessToken");
    config.headers = config.headers || {};
    if (accessToken) {
        
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if(adminAccessToken){
        
        // config.headers.AdminAutorization = `Bearer ${adminAccessToken}`;
        config.headers["Admin-Authorization"] = `Bearer ${adminAccessToken}`; 
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
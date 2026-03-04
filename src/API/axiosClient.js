import axios from "axios";

const baseUrl = "http://127.0.0.1:8000/api";

const axiosClient = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": 'application/json'
    }
});

axiosClient.interceptors.request.use((configs) => {
    const token = localStorage.getItem('access-token');
    if (token) {
        configs.headers.Authorization = `Bearer ${token}`;
    }
    return configs;

},(error)=>{
    return Promise.reject(error);
})

axiosClient.interceptors.response.use((response)=>{
    return response;
},(error)=>{
    if (error.response && error.response.status === 401){
        console.error("Token expired or invalid. Redirecting to login...");
    }

    return Promise.reject(error);
})

export default axiosClient


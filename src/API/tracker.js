import axiosClient from "./axiosClient";

export const jobPost=(data)=>{
    return axiosClient.post('/jobs/',data);
}

export const jobList=()=>{
    return axiosClient.get('/jobs/');
}

export const jobUpdate=(pk,data)=>{
    return axiosClient.patch(`/jobs/${pk}`,data);
}
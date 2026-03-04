import axiosClient from "./axiosClient";


export const registerUser=(data) => {
    return axiosClient.post("/register/",data)
}

export const loginUser=(data)=>{
    return axiosClient.post('/token/',data)
}
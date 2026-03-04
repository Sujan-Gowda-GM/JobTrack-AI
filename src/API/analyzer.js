import axiosClient from "./axiosClient";


export const analyzeResume=(formdata)=>{
    return axiosClient.post('/analyze/',formdata,{
        headers:{
            "Content-Type":"multipart/form-data"
        }
    })
}
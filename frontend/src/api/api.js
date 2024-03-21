import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:5500/",
    withCredentials:true,
    headers: {
        "Content-type": "multipart/form-data"
    }
});
const config={
    headers:{
        'authorization':`Bearer ${localStorage.getItem("token")}`
    }
}

// create users APi
export const registerApi=(data)=> api.post("api/user/create",data);

export const loginApi=(data)=> api.post("api/user/login",data);

// add jobs to database
export const addJobApi=(data)=> api.post("api/jobs/create",data,config);

export const getAllJobsApi=()=> api.get("api/jobs/getjobs");

export const getAllJobsWithoutSavedApi=(userId)=> api.get(`api/jobs/getjobsWithoutSaved/${userId}`);

export const getAllJobsAdminApi=()=> api.get("api/jobs/getJobsAdmin");
// get jobs form backend user wise
export const getJobsByuserIdApi = (userId) => api.get(`api/jobs/getalljobsbyadmin/${userId}`);


export const postLikedJobsApi=(data)=> api.post("api/saved/likedjobs",data);

export const getLikedJobsApi = (userId) => api.get(`api/saved/likedjobs/${userId}`);

// delete jobs
export const deleteJobsApi=(id)=> api.delete(`api/jobs/deleteJobs/${id}`,config);

export const getJobsbyId=(id)=> api.get(`api/jobs/getSingleJobs/${id}`);

export const updateJobsApi=(id,formData)=> api.put(`api/jobs/updateJobs/${id}`,formData,config);

// change password  Api
export const updatePassword=(formData)=> api.put(`api/user/changepassword`,formData);

export const updateUserDetail=(id,formData)=> api.put(`api/user/updateUser/${id}`,formData);

// add user details
export const addUserdetailApi=(data)=> api.post("api/userdetails/updateUserdata",data);

// get recommended JObs
export const getRecommendedJobsApi= (userId) => api.get(`api/jobs/recommendations/${userId}`);

// apply application jobs

export const applyJobsApi=(data)=> api.post("api/application/apply",data);

// get all user count
export const getAllUserCountApi=()=> api.get("api/user/countUsers",config);
// count users in past 7 days
export const getUserCountin7daysApi=()=> api.get("api/user/countNewUsersInPast7Days",config);
// get all verified users
export const getAllVerifiedUserApi=()=> api.get("api/user/countVerifiedUsers",config);
// count the user growth rate 
export const getUserGrowthRateApi=()=> api.get("api/user/getUserGrowthInPast7Days",config);

// get all jobs count
export const getAllJobsCountApi=()=> api.get("api/jobs/countJobs");
// get all jobs count in past 7 days
export const getJobsCountIn7daysApi=()=> api.get("api/jobs/countNewJobsInPast7Days");
// get all application count 
export const getAllApplicationCountApi=()=> api.get("api/application/countApplication");
// get all application count in past 7 days
export const getApplicationCountIn7daysApi=()=> api.get("api/application/countNewApplicationInPast7Days");
// get all application growth rate
export const getApplicationGrowthRateApi=()=> api.get("api/application/getApplicationGrowthInPast7Days");
// get all application list
export const getAllApplicationListApi=()=> api.get("api/application/getAllApplication");

export const getApplicationByAdminApi = (userId) => api.get(`api/application/getallapplicationbyadmin/${userId}`);

// get and update status of updateApplication
export const updateApplicationStatusApi=(id,formData)=> api.put(`api/application/updateApplication/${id}`,formData);
export const rejectApplicationStatusApi=(id,formData)=> api.put(`api/application/rejectApplication/${id}`,formData);
// get notification
export const getNotificationApi=(data)=> api.post("api/application/sendNotification",data);

// save comments
export const saveCommentsApi=(data)=> api.post("api/comment/create",data);
// get comment by job id
export const getCommentByJobIdApi=(jobId)=> api.get(`api/comment/getComment/${jobId}`);

// get all jobs near me
export const getAllJobsNearMeApi=(useId)=> api.get(`api/jobs/getJobsNearMe/${useId}`);
// get filtered job
export const getFilteredJobsApi=(worktype)=> api.get(`api/jobs/getFilter/${worktype}`);
// get searched job
export const getSearchedJobsApi=(worktype)=> api.get(`api/jobs/getSearch/${worktype}`);
// get applied jobs by user id
export const getAppliedJobsApi=(userId)=> api.get(`api/application/getApplicationByUserId/${userId}`);

// forget password
export const forgetpasswordApi=(data)=> api.post("api/user/forgetpassword",data);
export const verifyOtpApi=(data)=> api.post("api/user/verifyOtp",data);
export const resetpasswordApi=(data)=> api.post("api/user/resetPassword",data);

// contact imformation

export const userMessageApi=(data)=> api.post("/api/contact/create",data);
export const getMessageApi=()=> api.get("/api/contact/getAllContact");
export const replyMessageApi=(data)=> api.post("/api/contact/replyMessage",data);


// upload cv
export const uploadCv=(formData)=> api.put(`api/user/uploadCv`,formData);

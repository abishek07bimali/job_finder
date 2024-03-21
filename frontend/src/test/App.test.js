import axios from "axios";
import login_mock from "../mock/Login_mock";
import jobs_mock from "../mock/jobs_mock";
import application_mock from "../mock/applications_mock";
import comment_mock from "../mock/comments_mock";
import listContact_mock from "../mock/contact_list_mock";
import add_application_mock from "../mock/add_application_mock";
import contact_mock from "../mock/add_contact_mock";

const baseURL="http://localhost:5000"

describe("API Testing",()=>{
  
        it("Login Should Work", async () => {
        const response = await axios.post(`${baseURL}/api/user/login`,login_mock);
        expect( response.status).toEqual(200);
        expect( response.data.success).toEqual(true);
      });

       it("GET all jobs | Fetch all jobs", async () => {
        const response = await axios.get(`${baseURL}/api/jobs/getJobs`);
        // expect(response.status).toEqual(200);
        expect(response.data.jobs).toBeDefined();
        response.data.jobs.forEach((individualJObs,index)=>{
          expect(individualJObs.jobTitle).toEqual(jobs_mock[index].jobTitle)
        })
      });


      //  add applications      
      it("post application", async () => {
        const response = await axios.post(`${baseURL}/api/application/apply`,add_application_mock);
        expect( response.status).toEqual(200);
        // expect( response.data.success).toEqual(true);
        });



      it("GET all application | Fetch all application", async () => {
        const response = await axios.get(`${baseURL}/api/application/getAllApplication`);
        expect(response.data.application).toBeDefined();
        response.data.application.forEach((individualApplication,index)=>{
        expect (individualApplication.isRejected).toEqual(application_mock[index].isRejected)
        })
      });


      it("post all contact | add all contact", async () => {
        const response = await axios.post(`${baseURL}/api/contact/create`,contact_mock);
        expect( response.status).toEqual(200);
        expect( response.data.success).toEqual(true);
        });



      it("GET all contact | Fetch all contact", async () => {
        const response = await axios.get(`${baseURL}/api/contact/getAllContact`);
        expect(response.data.contact).toBeDefined();
        response.data.contact.forEach((contact,index)=>{
        expect (contact.message).toEqual(listContact_mock[index].message)
        })
      });

      it("GET countApplication | Fetch count of application", async () => {
        const response = await axios.get(`${baseURL}/api/users/countApplication`);
        expect(response.statusCode).toBe(200);
      });

            
      it("GET all comment | Fetch all comment", async () => {
        const response = await axios.get(`${baseURL}/api/comment/getComment/658e7535c70b3004fbab6d99`);
        expect(response.data.comment).toBeDefined();
        response.data.comment.forEach((commentIndi,index)=>{
        expect (commentIndi.comment).toEqual(comment_mock[index].comment)
        })
      });


})

const request = require("supertest");

// shpuld export the app in index.js to use it in other pages
//  calling index page
const app = require("../index");

describe("API Testings", () => {

  // 1
  it("POST /api/user/create | Response with valid valid json", async () => {
    const response = await request(app).post("/api/user/create").send({
      firstName: "test",
      lastName: "test",
      email: "test@gmail.com",
      password: "test",
      address: "test",
      phone: "0980980980",
    });
    console.log(response.body);

    if (response.body.success) {
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("user created successfully.");
    } else {
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("User Already exist.");
    }
  });


  // 2
  // login testing
  it("POST /api/user/login | Response with valid valid json", async () => {
    const response = await request(app).post("/api/user/login").send({
      email: "test@gmail.com",
      password: "test",
    });
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined;
    expect(response.body.message).toBe("Login Successfully.");
  });


  // 3
  // create job
  it("POST /api/jobs/create | Response with valid valid json", async () => {
    const response = await request(app).post("/api/jobs/create").send({
      jobTitle: "test",
      companyName: "test",
      location: "test",
      jobType: "test",
      experianceLevel: "test",
      educationLevel: "test",
      jobDescription: "test",
      jobResponsibility: "test",
      salary: "test",
      companyOverview: "test",
      contact: "test",
      workType: "test",
      jobTags: "test",
      courseType: "test",
      userId: "0980980980",
    });
    console.log(response.body);

    if (response.body.success) {
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Jobs has been posted successfully.");
    }
  });



  // 4
  //  testing get all jobs route
  it("GET /api/jobs/getJobs | Response with valid valid json", async () => {
    const response = await request(app).get("/api/jobs/getJobs");
    expect(response.statusCode).toBe(200);
  });


  // 5
  it("GET getSingleJobs | Fetch single jobs", async () => {
    const response = await request(app).get(
      "/api/jobs/getSingleJobs/65e2e0e944586d16fbf3e6e3"
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("jobs");
  });


  // 6
  // get all application
  it("GET /api/application/getAllApplication | Response with valid valid json", async () => {
    const response = await request(app).get(
      "/api/application/getAllApplication"
    );
    expect(response.statusCode).toBe(200);
  });

  // 7
  // get application by respective user
  it("GET getApplicationByUserId | Fetch single application", async () => {
    const response = await request(app).get(
      "/api/application/getApplicationByUserId/658dac154559284d80d5bb36"
    );
    expect(response.statusCode).toBe(200);
  });

  // 8
  // get application count
  it("GET countApplication | Fetch count of application", async () => {
    const response = await request(app).get(
      "/api/application/countApplication"
    );
    expect(response.statusCode).toBe(200);
  });

  // 9
  // get user count
  it("GET count users | Fetch count of users", async () => {
    const response = await request(app).get("/api/user/countUsers");
    expect(response.statusCode).toBe(200);
  });

  // 10
  // post application for jobs
  it("POST /api/application/apply | Response with valid valid json", async () => {
    const response = await request(app).post("/api/application/apply").send({
      userId: "658dac154559284d80d5bb36",
      jobsId: "65e2e0e944586d16fbf3e6e3",
    });
    console.log(response.body);

    if (response.body.success) {
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Application saved successfully.");
    }
  });


  // 11
  // create contact
  // post application for jobs
  it("POST /api/contact/create | Response with valid valid json", async () => {
    const response = await request(app).post("/api/contact/create").send({
      fullName: "test",
      email: "test@gmail.com",
      phone: "1234567890",
      address: "test",
      message: "test",
    });
    console.log(response.body);

    if (response.body.success) {
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Contact saved successfully.");
    }
  });

  // 12
  it("POST /api/application/apply | Response with valid json", async () => {
    const response = await request(app).post("/api/application/apply").send({
      userId: "658dac154559284d80d5bb36",
      jobsId: "65e2e0e944586d16fbf3e6e3",
    });
    if (response.body.success) {
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Application saved successfully.");
    } else {
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "You have already applied for this job."
      );
    }
  });
  
  // 13
  it("POST /api/saved/likedjobs | Response with valid json", async () => {
    const response = await request(app).post("/api/saved/likedjobs").send({
      userId: "658dac154559284d80d5bb36",
      likedJobsId: "65e2e0e944586d16fbf3e6e3",
    });
    if (response.body.success) {
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Jobs have been saved.");
    } 
  });

});

const router=require('express').Router();
const application_controller=require('../controllers/application_controller')


// apply appliation for jobs
router.post('/apply',application_controller.applyJobs);
// get all application list
router.get('/getAllApplication',application_controller.getAllApplication);
// get all application and update the status
router.put('/updateApplication/:id',application_controller.updateApplicationStatus);
router.put('/rejectApplication/:id',application_controller.rejectApplication);

// get application count
router.get('/countApplication',application_controller.countTotalApplication);
// get new application count
router.get('/countNewApplicationInPast7Days',application_controller.countNewApplication);
// get application growth in past 7 days
router.get('/getApplicationGrowthInPast7Days',application_controller.getApplicationGrowthInPast7Days);

// get application by user id 
router.get('/getApplicationByUserId/:userId',application_controller.getApplicationByUserId);

// get application for respective jobs by admin
router.get('/getallapplicationbyadmin/:id',application_controller.getAllApplicationByAdmin)

// send the application user notification
router.post('/sendNotification', application_controller.sendNotification);
module.exports=router;

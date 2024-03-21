const router=require('express').Router();
const jobs_controllers=require('../controllers/jobs_controller')
const authGuardAdmin = require('../middleware/authGuard');
const recommendationController = require('../controllers/recommendationController');



router.post('/create',authGuardAdmin,jobs_controllers.addJobs)

router.get('/getJobs',jobs_controllers.getAllJobs)
router.get('/getjobsWithoutSaved/:userId',jobs_controllers.getJobsWithoutSaved)

router.get('/getJobsAdmin',jobs_controllers.getAllJobsForAdmin)
// get all jobs by user id
router.get('/getalljobsbyadmin/:id',jobs_controllers.getAllJobsByUserId)

router.delete('/deleteJobs/:id',authGuardAdmin,jobs_controllers.deleteJobs)

router.get('/getSingleJobs/:id',jobs_controllers.getSingleJobs)

// update peoduct
router.put('/updateJobs/:id',authGuardAdmin,jobs_controllers.UpdateJobs)



// API endpoint for job recommendations
router.get('/recommendations/:id', recommendationController.recommendJobs);
// count jobs
router.get('/countJobs',jobs_controllers.countJobs)
// count new jobs in last 7 days
router.get('/countNewJobsInPast7Days',jobs_controllers.countNewJobs)

// get jobs near me
router.get('/getJobsNearMe/:id',jobs_controllers.getJobsNearMe)
// get jobs by filter
router.get('/getFilter/:workType',jobs_controllers.getFilteredJobs)
// get search jobs
router.get('/getSearch/:searchQuery',jobs_controllers.getSearchJobs)


module.exports=router;

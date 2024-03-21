const router=require('express').Router();
const user_controllers=require('../controllers/user_controllers')
const authguarduser= require('../middleware/authGuard')

router.post('/create',user_controllers.createUser)
router.post('/login',user_controllers.loginUser)

router.put('/updateUser/:userId',user_controllers.updateUser)
router.put('/updateUsermob/:userId',user_controllers.updateUserMob)
router.put('/changepassword',user_controllers.changePassword)

// count total users
router.get('/countUsers',user_controllers.countUsers)
// count new users
router.get('/countNewUsersInPast7Days',authguarduser,user_controllers.countNewUsersInPast7Days)
// count verified users
router.get('/countVerifiedUsers',authguarduser,user_controllers.countVerifiedUsers)
// user growth in past 7 days
router.get('/getUserGrowthInPast7Days',authguarduser,user_controllers.getUserGrowthInPast7Days)

router.post('/forgetpassword',user_controllers.forgetPassword)
router.post('/verifyOtp',user_controllers.verifyOtp)
router.post('/resetPassword',user_controllers.resetPassword)
// upload cv
router.put('/uploadCv',user_controllers.uploadCV)

module.exports=router;

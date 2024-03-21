const router=require('express').Router();
const liked_controllers=require('../controllers/likedJobs_controller')

router.post('/likedjobs',liked_controllers.likedJobs)
router.get('/likedjobs/:userId', liked_controllers.getLikedJobsByUserId);

module.exports=router;

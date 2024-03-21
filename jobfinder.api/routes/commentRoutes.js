const router=require('express').Router();
const comment_controller=require('../controllers/comment_controller')

router.post('/create',comment_controller.AddComment)
router.get('/getComment/:id',comment_controller.getCommentByJobId)

module.exports=router;

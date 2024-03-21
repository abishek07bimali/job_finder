const router=require('express').Router();
const userdetail_controllers=require('../controllers/userdetail_controller')

router.post('/updateUserdata',userdetail_controllers.updateUserDetail)

module.exports=router;

const router=require('express').Router();
const Contact_controller=require('../controllers/contact_controller')

router.post('/create',Contact_controller.AddContact)
router.get('/getAllContact',Contact_controller.getAllContact)
router.post('/replyMessage',Contact_controller.replyMessage)

module.exports=router;

const ContactModel = require("../model/contactmodel");
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "merojagir0@gmail.com",
      pass: "bsbi tqzn xcga akqg",
      // user: 'learnadvert9@gmail.com',
      // pass: 'ncof ghpg lzrp klmr',
    },
  });

  // Send mail with defined transport object
  let info = await transporter.sendMail({
    from: "merojagir0@gmail.com",
    to: to,
    subject: subject,
    text: text,
  });
  console.log('Email sent: %s', info.messageId);
}

const AddContact = async (req, res) => {
    console.log(req.body)
  const { fullName, email, phoneNum, address, message } = req.body;
  try {
    const newContact = new ContactModel({
      fullName: fullName,
      email: email,
      phone: phoneNum,
      address: address,
      message: message,
    });
    const savedContact = await newContact.save();
    res.json({
      success: true,
      message: "Contact saved successfully.",
      data: savedContact,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Contact not saved.",
      errorMessage: err.message,
    });
  }
};

const getAllContact= async (req, res) => {
    try {
        const allcontact = await ContactModel.find() 
            .sort({ createdAt: -1 });
        
       return res.json({
            success: true,
            contact: allcontact,
        });
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "Error in fetching all application.",
            errorMessage: err.message,
        });
    }
}


// send reply in email 
const replyMessage = async (req, res) => {
    const { message,email } = req.body;
     console.log(req.body)
    try {
      // Send email to the user
      if (email) {
        const emailSubject = 'Reply to the message you send  throught our website.';
        const emailText = `
        This is an auto generated email by admin so please do not replay in this mail.
             If you have any query then please fell free to contact in the number 
                          that we have provided in the site.

        Reply:
        
        ${message}

        Thank you!!
      `;
            
        await sendEmail(email, emailSubject, emailText);
      }
  
      res.json({
        success: true,
        message: 'Reply sent successfully.',
      });
    } catch (err) {
      console.error(err);
      res.json({
        success: false,
        message: 'Error in sending reply.',
        errorMessage: err.message,
      });
    }
  };

  
module.exports={
    AddContact,
    getAllContact,
    replyMessage
}
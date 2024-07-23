const nodeMail=require("nodemailer")
const {senderEmail,emailPassword}=require("../keys")
const sendMail=async({emailTo,subject,code,content})=>{
const transporter=nodeMail.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth:{
        user:senderEmail,
        pass:emailPassword
    }
});
const message={
    to:emailTo,
    subject,
    html:`
    <div>
        <h3>Use the below code to ${content}</h3>
        <p><strong>Code: </strong> ${code}</p>
        </div>
    `,
}
await transporter.sendMail(message)
}
module.exports=sendMail
const {PORT,Blog_url,JWT_SECRET,SENDER_EMAIL,EMAIL_PASSWORD}=process.env

module.exports={port:PORT,mongo_url:Blog_url,jwtSecret:JWT_SECRET,
    senderEmail:SENDER_EMAIL,
    emailPassword:EMAIL_PASSWORD,
}
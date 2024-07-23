const validateEmail = (email) => {
    const result = email.match(/^([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)$/);
    return result;
};
module.exports=validateEmail;
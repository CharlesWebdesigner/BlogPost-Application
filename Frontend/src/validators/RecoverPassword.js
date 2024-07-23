const recoverPassword=({code, password})=>{
    const errors={
        code:"",
        password:""
    };
    if(!code){
        errors.code="code is required"
    }
    if(!password){
        errors.password="password is required"
    }else if(password.length< 6){
        errors.password="Password must be at least 6 characters"
    }
    return errors
}
export default recoverPassword
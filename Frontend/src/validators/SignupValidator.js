const isEmail=(email)=>{
    String(email).toLowerCase().match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
}
const signUpValidator=({name,email,password,confirmPassword})=>{
    const errors={
        name:'',
        email:'',
        password:'',
        confirmPassword:''
    };
    if(!name){
        errors.name='Name is required'; 
        }
        if(!email){
            errors.email='Email is required';
            }else if(isEmail(email)){
                errors.email='Email is not valid'
            }
            if(!password){
                errors.password='Password is required';
                }else if(password.length<6){
                    errors.password='Password must be at least 6 characters long'
                }
                if(password !== confirmPassword){
                    errors.confirmPassword='Password must match'
                }
                return errors;
}
export default signUpValidator;
const isEmail=(email)=>{
    String(email).toLowerCase().match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
}
const ProfileValidator=({name,email})=>{
    const errors={
        name:'',
        email:'',
    };
    if(!name){
        errors.name='Name is required'; 
        }
        if(!email){
            errors.email='Email is required';
            }else if(isEmail(email)){
                errors.email='Email is not valid'
            }
                return errors;
}
export default ProfileValidator;
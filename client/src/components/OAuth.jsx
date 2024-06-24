import {GoogleAuthProvider,getAuth, signInWithPopup} from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signinSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {

    const dispatch=useDispatch();
    const navigate=useNavigate();
    const handelGoogleClick=async()=>{
        try{
            const provider=new GoogleAuthProvider();
            const auth=getAuth(app);
            const result=await signInWithPopup(auth,provider);
            // console.log(result);
            const res=await fetch('api/auth/google',{
                method:'POST',
                headers:{
                    'content-Type':'application/json',
                },
                body:JSON.stringify({name:result.user.displayName
                    ,email:result.user.email
                    ,photo:result.user.photoURL})
            })
            const data=await res.json();
            dispatch(signinSuccess(data));
            navigate('/');
        }catch(error){
                console.log("error foundd" ,error)
        }
    }


  return (
    <button type='button' onClick={handelGoogleClick} className='bg-red-600 text-white p-3 rounded-lg uppercase hover:opacity-85' >
      Continue with google
    </button>
  )
}


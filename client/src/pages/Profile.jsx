import React,{useEffect, useRef,useState} from 'react'
import { useSelector } from 'react-redux'
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { updateUserFailure,updateUserSuccess,updateUserStart,deleteUserFailure,deleteUserStart,deleteUserSuccess,signOutUserFailure,signOutUserStart,signOutUserSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';

function Profile() {
   
  const {currentUser,loading,error}=useSelector((state)=>state.user)
  const fileRef=useRef(null);
  const[file,setFile]=useState(undefined);
  const[filePerc,setFilePerc]=useState(0);
  const[fileUploadError,setfileUploadError]=useState(false);
  const[formData,setFormData]=useState({});
  const [updateSuccess,setUpdateSuccess]=useState(false);
  const[showListingsError,setShowListingsError]=useState(false);
  const[userListings,setUserListings]=useState([])

  const dispatch=useDispatch();
  // console.log(formData)
  
  //for profile image
  useEffect(()=>{
    if(file){
      handelFileUpload(file);
    }
  },[file]);

  const handelFileUpload=(file)=>{
    const storage=getStorage(app);
    const fileName=new Date().getTime()+file.name;
    const storageRef=ref(storage,fileName);
    const uploadTask=uploadBytesResumable(storageRef,file)
    
    uploadTask.on('state_changed',
      (snapshot)=>{
        const progress=(snapshot.bytesTransferred / snapshot.totalBytes)*100;
        setFilePerc(Math.round(progress));
      },
    (error)=>{
      setfileUploadError(true);
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then
      ((downloadURL)=>{
        setFormData({...formData,avatar:downloadURL})
      })
    }
  );
  }

  const handelChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  }

  const handelSubmit=async(e)=>{
    e.preventDefault();
    try{

      dispatch(updateUserStart());
      const res=await fetch (`/api/user/update/${currentUser._id}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),

      })
      const data=await res.json();
    if(data.success===false){
      dispatch(updateUserFailure(data.message));
      return;
    }
    dispatch(updateUserSuccess(data));
    setUpdateSuccess(true);

    }catch(error){
      dispatch(updateUserFailure(error.message))
    }

  }

  const handelDeleteUser=async()=>{
    try{
      dispatch(deleteUserStart());
      const res=await fetch(`api/user/delete/${currentUser._id}`,{
        method:'DELETE',

      })
      const data=await res.json();
      if(data.success===false){
        dispatch(deleteUserFailure(data.message));
        return ;
      }
      dispatch(deleteUserSuccess(data));


    }
    catch(error){
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handelSignOut=async()=>{
    try{
      dispatch(signOutUserStart());
      const res=await fetch('/api/auth/signOut')
      const data=await res.json();
      if(data.success===false){
        dispatch(signOutUserFailure(data.message))
      }
      dispatch(signOutUserSuccess(data));
    }
    catch(error){
      dispatch(signOutUserFailure(error.message));

    }
  }

  const handeshowListings=async()=>{
    try{
      setShowListingsError(false);
      const res=await fetch(`/api/user/listings/${currentUser._id}`)
      const data=await res.json();
      if(data.success===false){
        setShowListingsError(true);
        return ;
      }
      setUserListings(data);
    }
    catch (error){
      setShowListingsError(true);
    }

  }

  const handelListingDelete= async (listingId)=>{
    try{
      const res=await fetch(`/api/listing/delete/${listingId}`,{
        method:'DELETE',

      })
      const data=await res.json();
      if(data.success===false){
        console.log(data.message);
        return ;
      }
      setUserListings((prev)=>prev.filter((listing)=> listing._id!==listingId))

    }catch(error){
      console.log(error.message);
    }
  }

  return (
  <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl font-semibold text-center my-7'>
      Profile
    </h1>
    <form onSubmit={handelSubmit} className='flex flex-col gap-4'>
      <input 
      //for image uploading functionality
      onChange={(e)=>setFile(e.target.files[0])}
      type='file' ref={fileRef} hidden accept='image/*' />

      <img onClick={()=>fileRef.current.click()} 
      src={formData.avatar || currentUser.avatar} alt='profile'
      className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
     
      <p className='text-sm self-center'> {
        fileUploadError ? 
       (<span className='text-red-700'>Error image upload</span>)
       :
       filePerc > 0 && filePerc < 100 ? (
        <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
       ):
       filePerc===100 ?(
        <span className='text-green-700'>Image Successfuly Uploaded</span>
       ):(
        ''
       )}
  </p>

      <input type="text" 
      placeholder='username' 
      id='username'
      className='border p-3 rounded-lg'
      defaultValue={currentUser.username}
       onChange={handelChange}
      />

       <input type="email" 
      placeholder='email' 
      id='email'
      className='border p-3 rounded-lg'
      defaultValue={currentUser.email}
      onChange={handelChange}
      />

       <input type="password" 
      placeholder='password' 
      id='password'
      className='border p-3 rounded-lg'
      onChange={handelChange}
      />

      <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 
      uppercase hover:opacity-90'>
        {loading ? 'loading..' : 'Update'}
        </button>
       <Link to='/create-listing' className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>
       Create Listing</Link>

    </form>

    <div className='flex justify-between mt-5 '>
      <span onClick={handelDeleteUser} className='text-red-7-- cursor-pointer'>Delete Account</span>
      <span onClick={handelSignOut} className='text-red-7-- cursor-pointer'>Sign Out</span>

    </div>
    {error && <p className='text-red-700 mt-5'>{error}</p> }
    {updateSuccess && <p className='text-green-800 mt-5'> User Updated Successfully</p>}
    <button type='button' onClick={handeshowListings} className='text-green-800 w-full'> Show Listings</button>
    {showListingsError && <p className='text-red-700 mt-5'>Error occured</p>}
      
      {/* show listings */}

      {userListings && 
      userListings.length>0  &&
      <div className='flex flex-col gap-4'>
        <h1 className='text-center mt-7 text-2xl font-semibold '>Your Listings</h1>
        {userListings.map((listing)=>( 
      
      <div key={listing._id} className='border border-gray-500 p-3 flex rounded-lg justify-between items-center mt-3'>

        <Link to={`/listing/${listing._id}` }>
        <img src={listing.imageUrls[0]}  alt='listing cover' className='h-16 w-16 object-contain  '/>
        </Link>

        <Link className='text-slate-700 font-semibold  hover:underline truncate flex-1 ml-5 ' to={`/listing/${listing._id}`} >
        <p >{listing.name}</p>
        </Link>
        
        <div className='flex flex-col items-center'>
          <button onClick={()=>handelListingDelete(listing._id)} className='text-red-700'>Delete</button>
          <Link to={`/update-listing/${listing._id}`}>
          <button  className='text-blue-900'>Edit</button>
          </Link>
        </div>

      </div>  
      )
    )
  }

      </div>
      
  }



  </div> 
  )
}

export default Profile

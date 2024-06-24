import { createSlice } from "@reduxjs/toolkit";

const initialState={
    currentUser:null,
    error:null,
    loading:false
}

const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{

        signinStart:(state)=>{
            state.loading=true;
        },
        signinSuccess:(state,action)=>{
            console.log('signinSuccess payload:', action.payload);   
           state.currentUser=action.payload;
           state.loading=false
           state.error=null
        },
        signinFaliure:(state,action)=>{
            state.error=action.payload
            state.loading=false
        }

    }
})

export const {signinFaliure,signinStart,signinSuccess}=userSlice.actions;
export default userSlice.reducer
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  error:null,
  loading:false,
  loginType: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signinStart:(state)=>{
        state.loading = true
    },
    signinSuccess :(state,action)=>{
        state.currentUser = action.payload;
        state.userRole = action.payload.role;
        state.error = false;
        state.loading = false;
    },
    signinFailure:(state,action)=>{
        state.error = action.payload,
        state.loading= false
        },
    updateUserStart:(state)=>{
        state.loading = true
    },
    updateUserSuccess :(state,action)=>{
        state.currentUser = action.payload,
        state.error = false,
        state.loading = false
    },
    updateUserFailure:(state,action)=>{
        state.error = action.payload,
        state.loading= false
    },
    deleteUserStart:(state)=>{
        state.loading = true
    },
    deleteUserSuccess :(state,action)=>{
        state.currentUser = null,
        state.error = false,
        state.loading = false
    },
    deleteUserFailure:(state,action)=>{
        state.error = action.payload,
        state.loading= false
},
    signoutUserStart:(state)=>{
        state.loading = true
    },
    signoutUserSuccess :(state,action)=>{
        state.currentUser = action.payload,
        state.error = false,
        state.loading = false
        state.loginType = null
    },
    logoutUserSuccess :(state,action)=>{
        state.error = false,
        state.loading = false
        state.loginType = null
    },
    signoutUserFailure:(state,action)=>{
        state.error = action.payload,
        state.loading= false
        
},
resetError: (state) => {
  state.error = null;
},
 loginSuccess: (state, action) => {
      state.currentUser = action.payload.currentUser
      state.loginType = action.payload.loginType
    },

  }}
)
export const {signinStart,signinSuccess,signinFailure,updateUserSuccess,updateUserStart,updateUserFailure, resetError,
  deleteUserFailure,deleteUserStart,deleteUserSuccess,signoutUserFailure,signoutUserStart,signoutUserSuccess,loginSuccess,logoutUserSuccess

} = userSlice.actions;
export default userSlice.reducer
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  error:null,
  loading:false
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
        state.currentUser = null,
        state.error = false,
        state.loading = false
    },
    signoutUserFailure:(state,action)=>{
        state.error = action.payload,
        state.loading= false
},
resetError: (state) => {
  state.error = null;
}

  }}
)
export const {signinStart,signinSuccess,signinFailure,updateUserSuccess,updateUserStart,updateUserFailure, resetError,
  deleteUserFailure,deleteUserStart,deleteUserSuccess,signoutUserFailure,signoutUserStart,signoutUserSuccess

} = userSlice.actions;
export default userSlice.reducer
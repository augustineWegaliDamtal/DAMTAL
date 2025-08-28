import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import {
  deleteUserFailure, deleteUserStart, deleteUserSuccess,
  signoutUserFailure, signoutUserSuccess,
  updateUserFailure, updateUserStart, updateUserSuccess
} from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const fileRef = useRef();
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (file) storeImage(file);
  }, [file]);

  const storeImage = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`progress: ${progress}%`);
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, avatar: downloadURL }));
        });
      }
    );
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok || data.success === 'false') {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleFormDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok || data.success === 'false') {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate('/signup');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok || data.success === 'false') {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess(data));
      navigate('/signin');
    } catch (error) {
      dispatch(signoutUserFailure(error.message));
    }
  };

  return (
           <div style={{ backgroundImage: 'url(/bg3.png)' }}
            className=" bg-cover bg-no-repeat h-screen  bg-amber-300 p-6 rounded shadow-xl w-full mt-8 ">

      <h1 className='text-slate-700 text-center font-bold text-xl  uppercase'>Profile</h1>
      <form onSubmit={handleUpdate} className='flex flex-col mx-auto max-w-sm gap-4'>
        <div className='flex flex-col items-center'>
          <img
            className='rounded-full w-24 h-24 cursor-pointer'
            src={formData.avatar || currentUser.avatar}
            alt='Avatar'
            onClick={() => fileRef.current.click()}
          />
          <input type='file' hidden onChange={(e) => setFile(e.target.files[0])} ref={fileRef} />
        </div>
        <input type='text' id='username' defaultValue={currentUser.username} onChange={handleFormChange} className='border p-2 bg-white rounded-sm border-gray-300 ' placeholder='Username' />
        <input type='text' id='email' defaultValue={currentUser.email} onChange={handleFormChange} className='border bg-white p-2 rounded-sm border-gray-300 ' placeholder='Email' />
        <input type='text' id='phone' defaultValue={currentUser.phone} onChange={handleFormChange} className='border p-2 bg-white rounded-sm border-gray-300 ' placeholder='Phone' />
        <input type='text' id='password' defaultValue={currentUser.password} onChange={handleFormChange} className='border bg-white border-gray-300 p-2 rounded-sm' placeholder='Password' />
        <button className='bg-blue-900 text-white p-2 rounded hover:opacity-80'>Update User Credentials</button>
        <div className='flex justify-between'>
          <button type='button' onClick={handleFormDelete} className='text-red-600 hover:underline font-bold'>Delete Account</button>
          <button type='button' onClick={handleSignOut} className='text-slate-600 hover:underline font-bold'>Sign Out</button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

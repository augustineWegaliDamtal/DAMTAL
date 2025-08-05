import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [tapCount, setTapCount] = useState(0);
  const [showSignin, setShowSignin] = useState(false);

  const handleSecretTap = () => {
    setTapCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setShowSignin(true);
        return 0;
      }
      return newCount;
    });
  };

  return (

      <div className="p-2.5 relative top-0">
      <div className="fixed top-0 left-0 w-full z-50  text-black shadow-md bg-amber-300 ">
      <ul className="flex justify-between items-center font-bold text-slate-800 p-2">
     
        {currentUser?.role === 'admin' && (
          <Link to="/admin">
            <li>
              <img className="w-8 h-8" src="/home.png" alt="Admin Home" />
            </li>
          </Link>
        )}
 <Link to="/about">
       <div className='flex items-center ml-9'><img className='w-10 h-10 slow-bounce' src='Co.png'/></div>
       </Link>
        {currentUser?.role === 'agent' && (
          <Link to="/agent">
            <li>
              <img className="w-8 h-8" src="/home.png" alt="Agent Home" />
            </li>
          </Link>
        )}

        {currentUser?.role === 'admin' && (
          <Link to="/registerAgent">
            <li>Registeration</li>
          </Link>
        )}

        {(currentUser?.role === 'agent' || currentUser?.role === 'admin') && (
          <Link to="/registerClient">
            <li>Register Client</li>
          </Link>
        )}

        {currentUser ? (
          <Link to="/profile">
            <img
              src={currentUser.avatar}
              className="w-10 h-10 rounded-full"
              alt="Profile"
            />
          </Link>
        ) : (
          showSignin && (
            <Link to="/signin">
              Signin
            </Link>
          )
        )}
        <div
        onClick={handleSecretTap}
        style={{
          backgroundColor: "red",
          position: 'absolute',
          bottom: 10,
          top:5,
          left: 5,
          width: 40,
          height: 30,
          opacity: 0.0 ,
          zIndex: 100,
          
        }}
      ></div>
      </ul>

      {/* 🔐 Invisible tap area to reveal Signin */}
      
    </div>
</div>
  );
};

export default Header;


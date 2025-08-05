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
    <div className="p-2.5 relative">
      <ul className="flex justify-between items-center">
        {currentUser?.role === 'admin' && (
          <Link to="/admin">
            <li>
              <img className="w-8 h-8" src="/home.png" alt="Admin Home" />
            </li>
          </Link>
        )}

        {currentUser?.role === 'agent' && (
          <Link to="/agent">
            <li>
              <img className="w-8 h-8" src="/home.png" alt="Agent Home" />
            </li>
          </Link>
        )}

        {currentUser && (
          <Link to="/about">
            <li>About</li>
          </Link>
        )}

        {currentUser?.role === 'admin' && (
          <Link to="/registerAgent">
            <li>Register Agent</li>
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
          opacity: 0.03 ,
          zIndex: 100,
          
        }}
      ></div>
      </ul>

      {/* 🔐 Invisible tap area to reveal Signin */}
      
    </div>
  );
};

export default Header;


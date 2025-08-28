import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const BackButton = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  return (
    <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer' }}>
      <FaArrowLeft />
      <span>Back</span>
    </button>
  );
};

export default BackButton;

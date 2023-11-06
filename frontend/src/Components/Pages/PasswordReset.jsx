import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

function OTP() {
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/resetPassword", { otp, newPassword, email });
      console.log(response.data);
      if (response.data.success) {
        setMessage('Password changed successfully.');
        // You can navigate to a login page or another page on success
        navigate('/');
      } else {
        setMessage(response.data); // Display the error message from the server
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Password does not match requirements');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="otp">Enter OTP</label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={(e) => setOTP(e.target.value)}
        />

        <label htmlFor="newPassword">Enter New Password</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button type="submit">Reset Password</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default OTP;

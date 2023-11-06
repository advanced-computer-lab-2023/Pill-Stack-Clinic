import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Initialize navigate from React Router

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/sendOTP", { email });
      console.log(response);
      if (response.data === "password reset otp sent to your email account") {
        setMessage('OTP sent successfully. Check your email for the OTP.');
        // Navigate to the "OTP" page on successful OTP send
        navigate(`/PasswordReset?email=${email}`);
      } else {
        setMessage('Failed to send OTP. Please check your email address.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setMessage('An error occurred while sending OTP.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Send Reset Email</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default ForgotPassword;

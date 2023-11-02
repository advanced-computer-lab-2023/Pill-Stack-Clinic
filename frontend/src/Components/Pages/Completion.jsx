import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Completion() {
  // Use the useParams hook to access the route parameters
  const { doctorUsername, appointmentId, amount, memberID } = useParams();

  useEffect(() => {
    // Perform a POST request to the backend here, if needed
    // You can use libraries like Axios or the built-in Fetch API
    // Example with Axios:
    axios.post('http://localhost:8000/stripe/pay/confirm', {
      doctorUsername,
      appid: appointmentId,
      amount,
      member: memberID,
    }, { withCredentials: true })
      .then(response => {
        console.log(response.data);
        // Do additional handling here
      })
      .catch(error => {
        console.error(error);
      });
  }, [doctorUsername, appointmentId, amount, memberID]);

  return (
    <div>
      <h1>Appointment booked successfully</h1>
    </div>
  );
}


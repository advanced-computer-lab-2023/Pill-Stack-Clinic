import React, { Component } from 'react';
import axios from "axios";

class Completion extends Component {
  constructor() {
    super();
    this.state = {
      message: 'Appointment booked successfully',
    };
  }

  componentDidMount() {
    // Perform a POST request to the backend here, if needed
    // You can use libraries like Axios or the built-in Fetch API
    // Example with Axios:
    fetch('http://localhost:8000/stripe/pay/confirm', {
      method: 'POST',
      credentials: 'include', // Pass credentials
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  render() {
    return (
      <div>
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default Completion;

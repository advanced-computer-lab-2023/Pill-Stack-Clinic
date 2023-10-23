import { useState, useEffect } from "react";
import axios from 'axios';

import { loadStripe } from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js"
import CheckoutForm from "../UI/Payment";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
//const stripePromise = loadStripe("pk_test_51O3yL5I39njhw9EQbNUhiBjpOIiumwTdlgMLVwNx8e69uOiitybCgCIckh6rTt1XQMvqgFcoFFBbN3RUjLvtyIcO00i72iHKYH");

export default function Appointments(props) {
    const[stripePromise,setStripePromise]=useState(null);
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        // Fetch publishableKey using Axios
        axios.get("http://localhost:8000/stripe/config")
          .then((response) => {
            const { publishableKey } = response.data;
            console.log(publishableKey);
            setStripePromise(loadStripe(publishableKey));
          })
          .catch((error) => {
            // Handle errors here
          });
      }, []);
      
      useEffect(() => {
        // Create PaymentIntent as soon as the page loads using Axios
        axios.post("http://localhost:8000/stripe/pay", { doctor: 'Nada' },{ withCredentials: true }, {
          headers: { 'Content-Type': 'application/json' }
        })
          .then((response) => {
            console.log(response.data);

            setClientSecret(response.data.clientSecret);
          })
          .catch((error) => {
            // Handle errors here
          });
      }, []);
  

      return (
        <>
          <h1>React Stripe and the Payment Element</h1>
          {clientSecret && stripePromise && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm />
            </Elements>
          )}
        </>
      );
}

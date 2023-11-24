import React from "react";
import { useState, useEffect } from 'react';
import axios from "axios";
import { Buffer } from 'buffer';
import '../../index.css'
import { useNavigate } from "react-router-dom";
import '../UI/button.css'
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import {
    Box,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Input,
    Button,
    Select,
    FormControl,
    FormLabel,
    Flex,
    HStack,
  } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
  } from '@chakra-ui/react'
export const Cart = () => {
    const navigate = useNavigate();
    const back =()=>  navigate(-1);
    const [cart, setCart] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [selectedAddress, setSelectedAddress] = useState('');
    const [isErrorPayment, setIsErrorPayment] = useState(null);
    const [isSucessPayment, setIsSucessPayment] = useState(null);
    const [isFailPayment, setIsFailPayment] = useState(null);
    const [isSucessMessage, setIsSucessMessage] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);




    const [address, setAddress] = useState([]);

    const handleCheckout =  async () => {
        setErrorMessage('');
        setIsModalOpen(true);
        const response = await axios.get(
            'http://localhost:8000/patient/Address',
            { withCredentials: true }
          );
        setAddress(response.data);

    }

    useEffect(() => {
        const getCart = async () => {
            try {
                const response = await axios.get('http://localhost:8000/cart', { withCredentials: true });
                setCart(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        getCart();
    }, [cart]);
    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            // Display an error message or prevent the update action here.
            setErrorMessage('Quantity cannot be less than 1');
            return;
        }
        try{
        setErrorMessage('');
        const response= await axios.post('http://localhost:8000/cart/update',{productId:productId,quantity:newQuantity },  { withCredentials: true });
        setCart(response.data);
        }catch (err) {
            console.log(err);
        }
        // Send an API request to update the quantity of the item in the cart
        // You will need to implement this API on the server side
    };
    const handleDelete= async (productId,itemPrice,itemQuantity) => {
      setIsDeleting(true);
        try{
      
        const response= await axios.delete(`http://localhost:8000/cart/${productId}`, { withCredentials: true });
        if (response.status === 200) {
          // Item was successfully deleted
          setCart(response.data);

        }

      
        }catch (err) {
            console.log(err);
            setIsDeleting(false);

        }finally{
          setIsDeleting(false);

        }
        // Send an API request to update the quantity of the item in the cart
        // You will need to implement this API on the server side
    };
    const handlePay=async(selectedAddress,selectedPayment)=>{
        if(selectedPayment=='' | selectedAddress===''){
          setIsErrorPayment(true);
          return;
        }else{
            if(selectedPayment==='cash'){
                const response= await axios.post('http://localhost:8000/order/orderCash',{address:selectedAddress},  { withCredentials: true });
                setIsSucessPayment(true);
                setIsModalOpen(false);
                setCart(null);

            }else{
                if(selectedPayment==='wallet'){
                    const response= await axios.post('http://localhost:8000/order/orderWallet',{address:selectedAddress},  { withCredentials: true });
                    if(response.data==='You do not have enough money in wallet'){
                        setErrorMessage('Not enough balance in Wallet.Please top up your wallet or pick a different payment method.')
                        setIsModalOpen(false);

                    }else{
                        setIsSucessPayment(true);
                        setIsModalOpen(false);
                        setCart(null);
                    }

                }else{
                    navigate(`/home/creditPayment/${selectedAddress}`);


                }
            }
        }


    }

    return (
      <><Box bg={'#4bbbf3'} p={5} boxShadow='2xl' mb={10}>
        <Text fontSize={'3xl'} color={'white'}>My Cart</Text>
        <button className="btn" onClick={back}>back</button>
      </Box><div className="cart-container">
          {isSucessPayment && (
            <Alert status="success">
              <AlertIcon />
              <AlertTitle>Confirmation</AlertTitle>
              <AlertDescription>Order has been placed successfully</AlertDescription>
            </Alert>
          )}
          {errorMessage && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
           {isDeleting && (
       <CircularProgress isIndeterminate value={80} />
      ) }
          <h1>Your Cart</h1>

          {cart ? (
            <ul>
              {cart.items.map((item) => (
                <li key={item.productId}>
                  <div className="cart-item">
                    <img
                      className="product-image"
                      src={`data:${item.image.contentType};base64, ${Buffer.from(item.image.data).toString('base64')}`}
                      alt={item.name} />
                    <div className="product-details">
                      <p className="product-name">{item.name}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.price}</p>
                      <div>
                        <button onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}>-</button>
                        <span>Quantity: {item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>+</button>
                      </div>
                      <button onClick={() => handleDelete(item.productId)} className="remove-button">Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>Add items to your cart..</p>
          )}
          {cart && (
            <div className="cart-summary">
              <p>Total Bill: ${cart.bill}</p>
              <button onClick={() => handleCheckout()} className="checkout-button">Checkout</button>
            </div>
          )}
          <Modal isOpen={isModalOpen} onClose={() => {
            setIsModalOpen(false);
            setSelectedPayment('');
            setSelectedAddress('');
            setIsErrorPayment(false);
          } }>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Select Payment Option</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {isErrorPayment && (<Alert status='error'>
                  <AlertIcon />
                  <AlertTitle>Missing information</AlertTitle>
                  <AlertDescription>Please select address and payment method.</AlertDescription>
                </Alert>)}
                <FormControl>
                  <FormLabel>Select Address</FormLabel>
                  <Select
                    value={selectedAddress}
                    onChange={(e) => { setSelectedAddress(e.target.value); } }
                  >
                    <option value="">Select</option>


                    {(

                      address.map((add) => (
                        <option key={add} value={add}>
                          {add}
                        </option>
                      ))
                    )}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Select Payment Method</FormLabel>
                  <Select
                    value={selectedPayment}
                    onChange={(e) => {
                      setSelectedPayment(e.target.value);

                    } }

                  >
                    <option value="">Select payment</option>
                    <option value="wallet">Wallet</option>
                    <option value="cash">Cash on delivery</option>
                    <option value="credit">Credit</option>
                    {/* Add more options as needed */}
                  </Select>
                </FormControl>

              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={() => handlePay(selectedAddress, selectedPayment)}>
                  Pay
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div></>

    );
}

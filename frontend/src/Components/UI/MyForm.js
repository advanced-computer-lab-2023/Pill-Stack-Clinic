import React, { useState } from 'react'
import {  Button, Input } from "@chakra-ui/react"
import axios from 'axios';

function MyForm( 
    {inWidth = '25%'}
    ) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const checkCredentials = (username, password) => {
       
    }
  return (
    <>
    
        <h1>Username</h1>
        <Input w={'25%'}
            key={"user"} placeholder='Basic usage'
            onChange={(e) => setUsername(e.target.value)}
        />
        <h1>Password</h1>
        <Input w={inWidth} 
        key={"pass"} placeholder='Basic usage'
            onChange={(e) => setPassword(e.target.value)}
        />
        <Button colorScheme="blue" variant="solid" m={2}
        onClick={
            () => {
                checkCredentials(username, password);
            }
        }>
            Submit
        </Button>
    </>
  )
}

export default MyForm;

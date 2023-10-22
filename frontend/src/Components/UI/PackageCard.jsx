import React from 'react'
import { Box,
    Text,
    Button
 } from '@chakra-ui/react'

function PackageCard( {pack}) {
    //     Family_Discount
// : 
// 10
// Package_Name
// : 
// "Silver"
// Pharmacy_Discount
// : 
// 20
// Price
// : 
// 3600
// Session_Discount
// : 
// 40
    const { Package_Name, Price, Family_Discount,Pharmacy_Discount , Session_Discount } = pack;
    const handleEdit = () => {
        console.log("Edit");
    }
    

  return (

    <Box bg={'grey'} p={10}>
        <Text fontSize={'3xl'} color={'white'} textAlign={'center'}>
            Name:
            {Package_Name}
        </Text>
        <Text fontSize={'3xl'} color={'white'} textAlign={'center'}>
            Price:
            {Price}
        </Text>
        <Text fontSize={'3xl'} color={'white'} textAlign={'center'}>
            Family Discount:
            {Family_Discount}
        </Text>
        <Text fontSize={'3xl'} color={'white'} textAlign={'center'}>
            Pharmacy Discount:
            {Pharmacy_Discount}
        </Text>
        <Text fontSize={'3xl'} color={'white'} textAlign={'center'}>
            Session Discount:
            {Session_Discount}
        </Text>

        <Button  size="md" onClick={handleEdit}>
            Edit
        </Button>
    </Box>
  )
}


export default PackageCard
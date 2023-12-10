import React from 'react'
import { Box,
    Text,
    Button,
    Stack,
    Flex,
    Card,
    CardHeader,
    CardFooter,
    CardBody,
    Popover,
    PopoverTrigger,
    PopoverArrow,
    PopoverContent,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody
 } from '@chakra-ui/react'
import { useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function PackCardBuy( {pack,
    walletCallback,
    creditCallback,
    key
}) {
    
    const { Package_Name, Price, Family_Discount,Pharmacy_Discount , Session_Discount } = pack;
    let message='A';
    const Navigate=useNavigate();






  return (
    <>
    <Card variant={'elevated'}  rounded={10} >
        <CardHeader m={0} bg={'#10f17760'}  rounded={10}>
        <Flex alignItems={'center'}>
            <Text color='blue.600' fontSize='2xl'>${Price}</Text>
            <Text as={'sub'} ml={1}>  per year </Text>
        </Flex>
        </CardHeader>
        <CardBody pt={0}>
        <Text fontSize={'5xl'} textAlign={'center'} fontWeight={'light'}  mb={5} > {Package_Name}</Text>
        <Stack spacing={6} >
        <Flex alignItems={'center'} flexWrap="nowrap" >
            <Text color='blue.600' fontSize='2xl'>{Family_Discount}% Off</Text>
            <Text fontSize={'xl'} ml={2}> for family members Discount </Text>
        </Flex>
        <Flex alignItems={'center'}>
            <Text color='blue.600' fontSize='2xl'>{Pharmacy_Discount}% Off</Text>
            <Text fontSize={'xl'} ml={2}> on pharmacy products </Text>
        </Flex>
        <Flex alignItems={'center'}>
            <Text color='blue.600' fontSize='2xl'>{Session_Discount}% Off</Text>
            <Text fontSize={'xl'} ml={2}> on sessions </Text>
        </Flex>
        </Stack>
        </CardBody>
        <CardFooter p={2}  as={'Flex'} justifyContent={'center'}>
        <Popover>
        <PopoverTrigger>
            <Button variant={'outline'} colorScheme='green' w={'100%'}>Subscribe</Button>
        </PopoverTrigger>
        <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Payment Method</PopoverHeader>
            <PopoverBody>
                <Flex p={1}>
                    <Button colorScheme='green' w={'50%'} m={1}
                    onClick={() =>walletCallback(pack._id)}
                    >
                        Wallet
                    </Button>
                    <Button colorScheme='green' w={'50%'} m={1}
                    onClick={() => creditCallback(pack._id)}
                    >
                        Credit Card
                    </Button>
                </Flex>
            </PopoverBody>
        </PopoverContent>
        </Popover>
        </CardFooter>
    </Card>

    </>

  )
}


export default PackCardBuy
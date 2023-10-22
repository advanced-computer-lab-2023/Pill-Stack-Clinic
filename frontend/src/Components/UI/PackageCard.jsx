import React from 'react'
import { Box,
    Text,
    Button,
    HStack,
    Heading,
    useColorModeValue,
    Stack,
    Flex,
    useDisclosure,
    Card,
    CardHeader,
    CardFooter,
    CardBody,
    CardTitle,

 } from '@chakra-ui/react'
import { useEffect } from "react";
import axios from 'axios';

function PackageCard( {pack}) {
    
    const { Package_Name, Price, Family_Discount,Pharmacy_Discount , Session_Discount } = pack;

    const handleEdit = () => {
        console.log("Edit");
    }
    //backend
    // const deletePack=async(req,res)=>{
    //     const { id } = req.params;
         
    //     try {
    //       const pack = await packageModel.findById(id);
    //       if (!pack) {
    //         return res.status(404).send('Profile not found');
    //       }
      
    //       await pack.delete();
      
    //       // Redirect back to the profile view or show a success message
    //       res.send('Pacakge Deleted');
    //     } catch (error) {
    //       console.error(error);
    //       res.status(500).send('Internal Server Error');
    //     }
    // }
    const handleDelete = () => {
        const ID = pack._id;
        try {
            axios.post("http://localhost:8000/admin/deletePack/"+ ID, null, {
                withCredentials: true,
            }); 
        }
        catch (err) {
            console.log(err);
        }
    }
    

  return (

    <Card variant={'elevated'} boxShadow='inner' p={3}>
        <CardHeader>
        <Heading size='md' textAlign={'center'}> {Package_Name}</Heading>
        </CardHeader>
        <CardBody px={3}>
        <Text fontSize={'xl'}> Price: ${Price}</Text>
        <Text fontSize={'xl'} >
             Family Discount:
             {Family_Discount}
        </Text>
         <Text fontSize={'xl'} >
             Pharmacy Discount:
             {Pharmacy_Discount}
         </Text>
         <Text fontSize={'xl'} >
             Session Discount:
             {Session_Discount}
         </Text>
        </CardBody>
        <CardFooter p={2}  >
            <HStack mt={5} justifyContent="flex-end">
                <Button  size="md" onClick={handleEdit}>
                    Should Edit?
                </Button>
                <Button  size="md" onClick={handleDelete}>
                    Delete
                </Button>
            </HStack>
        </CardFooter>
    </Card>

    // <Box bg={'grey'} p={10} rounded={10} boxShadow={'inner'}>
    //     <Text fontSize={'3xl'} color={'white'} textAlign={'center'}>
    //         {Package_Name}
    //     </Text>
    //     <Text fontSize={'xl'} color={'white'} textAlign={'center'}>
    //         Price:
    //         {Price}
    //     </Text>
    //     <Text fontSize={'xl'} color={'white'} textAlign={'center'}>
    //         Family Discount:
    //         {Family_Discount}
    //     </Text>
    //     <Text fontSize={'xl'} color={'white'} textAlign={'center'}>
    //         Pharmacy Discount:
    //         {Pharmacy_Discount}
    //     </Text>
    //     <Text fontSize={'xl'} color={'white'} textAlign={'center'}>
    //         Session Discount:
    //         {Session_Discount}
    //     </Text>
    //     <HStack mt={10}>
    //     <Button  size="md" onClick={handleEdit}>
    //        Should Edit?
    //     </Button>
    //     <Button  size="md" onClick={handleDelete}>
    //         Delete
    //     </Button>
    //     </HStack>
    // </Box>
  )
}


export default PackageCard
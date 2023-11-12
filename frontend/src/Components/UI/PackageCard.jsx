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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Input,

 } from '@chakra-ui/react'
import { useEffect } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function PackageCard( {pack,count}) {
    
    const { Package_Name, Price, Family_Discount,Pharmacy_Discount , Session_Discount } = pack;
    
    const { isOpen, onOpen, onClose } = useDisclosure();
    let message='A';
    const Navigate=useNavigate();
    
    const handleEdit = () => {
        const ID = pack._id;
        const Price = document.getElementById('Price').value;
        const Family_Discount = document.getElementById('Family_Discount').value;
        const Pharmacy_Discount = document.getElementById('Pharmacy_Discount').value;
        const Session_Discount = document.getElementById('Session_Discount').value;
        let test=true;
        
        if(Price<0){
            test=false;
            toast.error("Price can not be negative");
            message="Price can not be negative";
        }
        if(Family_Discount>100 || Family_Discount<0){
            test=false;
            toast.error("Family Discount must be between [0,100]");
            message="Family Discount must be between [0,100]";
        }
        if(Session_Discount>100 || Session_Discount<0){
            test=false;
            toast.error("Session Discount must be between [0,100]");
            message="Session Discount must be between [0,100]";
        }
        if(Pharmacy_Discount>100 || Pharmacy_Discount<0){
            test=false;
            toast.error("Pharmacy Discount must be between [0,100]");
            message="Pharmacy Discount must be between [0,100]";
        }
        if(test){
        try {
            axios.post("http://localhost:8000/admin/editPack/"+ ID, {
                Price,
                Family_Discount,
                Pharmacy_Discount,
                Session_Discount
            }, {
                withCredentials: true,
            }); 
        }
        catch (err) {
            console.log(err);
        }
        onClose();

    }
}

    const openModal = () => {
        onOpen()
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
    <>
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
                <Button  size="md" onClick={openModal}>
                    Edit
                </Button>
                <Button  size="md" onClick={handleDelete}>
                    Delete
                </Button>
            </HStack>
        </CardFooter>
    </Card>

    <Modal onClose={onClose} size={'xl'} isOpen={isOpen}>
            <ModalOverlay/>
            <ModalContent>
            <ModalHeader>Edit {Package_Name} Package</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Box display='flex' flexDirection='column' alignItems='center' w='100%' h='100%'>
                <Flex p={5} w='100%'>
                    <Box display='flex' alignItems='center'>
                    <Text display='inline-block' width='150px' mr={2}>Price:</Text>
                    <Input type='Number' placeholder='Price' id='Price' />
                    <Text display='inline-block' as='sub' ml={2}>Current(${Price})</Text>
                    </Box>
                </Flex>
                <Flex p={5} w='100%'>
                    <Box display='flex' alignItems='center'>
                    <Text display='inline-block' width='150px' mr={2}>Family Discount:</Text>
                    <Input type='Number' placeholder='Family Discount' id='Family_Discount' />
                    <Text display='inline-block' as='sub' ml={2}>Current(${Family_Discount})</Text>
                    </Box>
                </Flex>
                <Flex p={5} w='100%'>
                    <Box display='flex' alignItems='center'>
                    <Text display='inline-block' width='150px' mr={2}>Pharmacy Discount:</Text>
                    <Input type='Number' placeholder='Pharmacy Discount' id='Pharmacy_Discount' />
                    <Text display='inline-block' as='sub' ml={2}>Current(${Pharmacy_Discount})</Text>
                    </Box>
                </Flex>
                <Flex p={5} w='100%'>
                    <Box display='flex' alignItems='center'>
                    <Text display='inline-block' width='150px' mr={2}>Session Discount:</Text>
                    <Input type='Number' placeholder='Session Discount' id='Session_Discount' />
                    <Text display='inline-block' as='sub' ml={2}>Current(${Session_Discount})</Text>
                    </Box>
                </Flex>
                </Box>

            </ModalBody>
            <ModalFooter>
                <Button colorScheme="blue" mr={3}
                onClick={handleEdit}>
                    Save Changes
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </>

  )
}


export default PackageCard
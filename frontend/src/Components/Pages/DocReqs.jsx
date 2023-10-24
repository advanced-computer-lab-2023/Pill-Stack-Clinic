import React from 'react'
import { useEffect, useState } from "react";
import {
    Box,
    Text,
    Button,
    Center,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Flex,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Avatar,
    Tag,
    TagLabel,
    Stack,
    Badge,
    Divider,
    useDisclosure,
    AbsoluteCenter,




    
} from "@chakra-ui/react";
import axios from 'axios';

function DocReqs() {
    const [reqs, setReqs] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [viewReq, setViewReq] = useState({});

    // use effect to fetch data from backend

    useEffect(() => {
        const getReqs = async () => {
            try {
            const { data } = await axios.get("http://localhost:8000/admin/applications", {
                withCredentials: true,
            });
            // sort by date
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setReqs(data);
            } catch (error) {
            console.log(error);
            }
        };
        getReqs();
    }, [reqs]);

    const onClose = () => setIsOpen(false);

  return (
    <>
        <Box bg={'#4bbbf3'} p={5} boxShadow='2xl' mb={10}>
            <Text fontSize={'3xl'} color={'white'} > Doctor Requests </Text>
        </Box>
        <Center>
        <TableContainer w={'90%'}>
            <Table size='lg'> 
              <Thead>
                <Tr bg={'#2d2d2e'}>
                    <Th color={'white'}>Name</Th>
                    <Th color={'white'}>Userame</Th>
                    <Th color={'white'}><Center>Request Date </Center></Th>
                    <Th color={'white'}> </Th>
                </Tr>
              </Thead>
                <Tbody>
                    {
                        reqs &&
                        reqs.map((req) => {
                            // Check if user.createdAt is a valid date
                            const createdAtDate = req.createdAt instanceof Date
                              ? req.createdAt.toLocaleDateString()
                              : new Date(req.createdAt).toLocaleDateString();
                            return (
                              <Tr key={req._id}>
                                <Td w={'20%'}> {req.Name} </Td>
                                <Td w={'20%'} >
                                    <Text fontSize={'lg'} ml={5}>{req.Username}</Text> 
                                </Td>
                                <Td w={'20%'}> <Center>{createdAtDate}  </Center></Td>
                                <Td w={'20%'}>
                                    <Center>
                                     <Button colorScheme='blue' variant='outline' size='sm'
                                        onClick={() => {
                                            setIsOpen(true);
                                            setViewReq(req);
                                        }}
                                     >
                                     View Detais</Button>
                                    </Center>
                                </Td>
                              </Tr>
                            );
                          })
                    }
                </Tbody>
            </Table>
        </TableContainer>
        </Center>

        <Drawer onClose={onClose} isOpen={isOpen} size={'sm'}>
        <DrawerOverlay />
        <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
            <Flex>
            <Avatar src='https://bit.ly/sage-adebayo' />
            <Box ml='3'>
                <Text fontWeight='bold'>
                {viewReq.Name}
                <Badge ml='1' colorScheme='green'>
                    PENDING
                </Badge>
                </Text>
                <Text fontSize='sm'> {viewReq.Username }</Text>
            </Box>
            </Flex>
                
            </DrawerHeader>
            <DrawerBody>
            {/* Username: {
    type: String,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true,
  },
  DateOfBirth:{
    type: Date,
    required: true,
  },
    HourlyRate: {
        type: Number,
        required: true,
    },
    Affiliation: {
        type: String,
        required: true,
    },
    EducationalBackground: {
        type: String,
        required: true,
    } */}
            <Flex justifyContent={'center'}  alignItems={'center'} >
            <Stack spacing={10}>
            <Box position='relative' >
            <Divider />
            <AbsoluteCenter bg='white' px='4'>
                Email
            </AbsoluteCenter>
            </Box>
            <Text fontSize={'3xl'}> <Center> {viewReq.Email} </Center> </Text>
            <Box position='relative' >
            <Divider />
            <AbsoluteCenter bg='white' px='4'>
                Hourly Rate
            </AbsoluteCenter>
            </Box>
            <Text fontSize={'3xl'}> <Center> ${viewReq.HourlyRate} </Center></Text>
            <Box position='relative' >
            <Divider />
            <AbsoluteCenter bg='white' px='4'>
                Affiliation
            </AbsoluteCenter>
            </Box>
            <Text fontSize={'3xl'}>  <Center> {viewReq.Affiliation}</Center></Text>
            <Box position='relative' >
            <Divider />
            <AbsoluteCenter bg='white' px='4'>
                Educational Background
            </AbsoluteCenter>
            </Box>
            <Text fontSize='3xl'>  <Center> {viewReq.EducationalBackground} </Center></Text>
      </Stack>
            </Flex>
            
            </DrawerBody>
            <DrawerFooter>
            <Button colorScheme='green' m={1}>Accept</Button>
            <Button variant='outline' colorScheme='red' m={1} onClick={onClose}>
                Reject
            </Button>

            </DrawerFooter>

        </DrawerContent>
        </Drawer>
    </>

  )
}

export default DocReqs

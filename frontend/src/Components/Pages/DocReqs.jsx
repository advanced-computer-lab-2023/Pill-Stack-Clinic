import React from 'react'
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../UI/button.css'
import { Buffer } from 'buffer';
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
    const [available,setAvailable]=useState(false);
    const [ID,SetID]=useState(false);
    const [Degree,SetDegree]=useState(false);
    const [License,SetLicense]=useState(false);
    const navigate = useNavigate();

    // use effect to fetch data from backend

    useEffect(() => {
        const getReqs = async () => {
            try {
            const { data } = await axios.get("http://localhost:8000/admin/applications", {
                withCredentials: true,
            });
            setTimeout(() => {
              setAvailable(true);
            }, 5000);
            
           setReqs(data);
            
            // sort by date
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } catch (error) {
            console.log(error);
            }
        };
        getReqs();
    }, [reqs]);

    const onClose = () => setIsOpen(false);
    const back =()=>  navigate(-1);
    const handleClose= ()=> {
      SetDegree(false);
      SetLicense(false);
      SetID(false);
    }
    
    const handleAccept = async () => {
      try {
        // router.post('/applications/accept-registeration/:id',acceptRegRequest);
        
        await axios.post(
          `http://localhost:8000/admin/applications/accept-registeration/${viewReq._id}`,
          {},
          {
            withCredentials: true,
          }
        );
        setReqs(reqs.filter((req) => req._id !== viewReq._id));
        onClose();
      } catch (error) {
        console.log(error);
      }
    };

    const handleReject = async () => {
      try {        
        await axios.post(
          `http://localhost:8000/admin/applications/reject-registeration/${viewReq._id}`,
          {},
          {
            withCredentials: true,
          }
        );
        setReqs(reqs.filter((req) => req._id !== viewReq._id));
        onClose();
      } catch (error) {
        console.log(error);
      }
    };
    const handleView1 =async ()=>{
  
      SetID(true);
      SetDegree(false);
      SetLicense(false);
    };
    const handleView2 =async ()=>{
      SetID(false);
      SetDegree(true);
      SetLicense(false);
    };
    const handleView3 =async ()=>{
      SetID(false);
      SetDegree(false);
      SetLicense(true);
    };

  return (
    <>
        <Box bg={"linear-gradient(45deg, #1E9AFE, #60DFCD)"} p={5} boxShadow='2xl' mb={10}>
            <Text fontSize={'3xl'} color={'white'} > Doctor Requests </Text>
            <button className="btn" onClick={back}>back</button>
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
        <Center>
        <div position='Center'>
           <Box alignContent='Left' width= '750px' height= '1000px' padding= '10' overflow= 'hidden'>
             {available &&ID&& <Button float='right' onClick={handleClose}>close</Button>}
             {available && ID && viewReq.idDocument.contentType=="application/pdf" &&<iframe width='100%' height='100%'
              src={`data:${viewReq.idDocument.contentType};base64, ${Buffer.from(viewReq.idDocument.data).toString('base64')}`}  />}
             {available && ID  && viewReq.idDocument.contentType!="application/pdf"  &&<img width='100%' height='100%'
              src={`data:${viewReq.idDocument.contentType};base64, ${Buffer.from(viewReq.idDocument.data).toString('base64')}`}  />}
              {available && Degree&& <Button float='right' onClick={handleClose}>close</Button>}
             {available && Degree && viewReq.medicalLicenseDocument.contentType=="application/pdf" &&<iframe width='100%' height='100%'
              src={`data:${viewReq.medicalLicenseDocument.contentType};base64, ${Buffer.from(viewReq.medicalLicenseDocument.data).toString('base64')}`}  />}
             {available && Degree && viewReq.medicalLicenseDocument.contentType!="application/pdf" &&<img width='100%' height='100%'
              src={`data:${viewReq.medicalLicenseDocument.contentType};base64, ${Buffer.from(viewReq.medicalLicenseDocument.data).toString('base64')}`}  />}
              {available && License&& <Button float='right' onClick={handleClose}>close</Button>}
             {available && License && viewReq.medicalDegreeDocument.contentType=="application/pdf" &&<iframe width='100%' height='100%'
              src={`data:${viewReq.medicalDegreeDocument.contentType};base64, ${Buffer.from(viewReq.medicalDegreeDocument.data).toString('base64')}`}  />}
             {available && License &&viewReq.medicalDegreeDocument.contentType!="application/pdf" &&<img width='100%' height='100%'
              src={`data:${viewReq.medicalDegreeDocument.contentType};base64, ${Buffer.from(viewReq.medicalDegreeDocument.data).toString('base64')}`}  />}
         </Box>
         <br></br>
         
       </div>
       <br></br>
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
            
            <Box position='relative' >
            <Divider />
            <AbsoluteCenter bg='white' px='4'>
                Speciality
            </AbsoluteCenter>
            </Box>
            <Text fontSize={'3xl'}> <Center> {viewReq.Speciality} </Center> </Text>
             <Button onClick={handleView1}>View ID Doc</Button>
            <Button onClick={handleView2}>View Degree</Button>
            <Button onClick={handleView3}>View License</Button>
      </Stack>
            </Flex>
            
            </DrawerBody>
            <DrawerFooter>
            <Button colorScheme='green' m={1} onClick={handleAccept}>Accept</Button>
            <Button variant='outline' colorScheme='red' m={1} onClick={handleReject}>
                Reject
            </Button>

            </DrawerFooter>

        </DrawerContent>
        </Drawer>
    </>

  )
}

export default DocReqs

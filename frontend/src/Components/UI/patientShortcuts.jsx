import React from 'react';
import { Card, CardHeader, CardBody } from '@chakra-ui/react';
import { Heading, Stack, StackDivider, Box, Text} from '@chakra-ui/react';
import { Grid, GridItem } from '@chakra-ui/react'
import { Divider } from '@chakra-ui/react'
import { Center,AbsoluteCenter , Square, Circle } from '@chakra-ui/react'
import { SimpleGrid } from '@chakra-ui/react'
import { DeleteIcon, AddIcon, EmailIcon ,EditIcon,ViewIcon,AttachmentIcon} from '@chakra-ui/icons'
import { Link } from 'react-router-dom'; // Import the Link component
import { LinkBox, LinkOverlay } from '@chakra-ui/react'
import { useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'


function PatientShortcuts(props) {
  const {openSecondModal,openAddFamilyModal,openViewFamilyModal,openUploadDocModal, navigate, username,name, setTab, setInputs,openAddDeliveryModal } = props;
  
  
  return (
    <Card>
<CardHeader h='80px'>
          <Heading size='md'>Shortcuts</Heading>
          </CardHeader>
<Grid
  h='452px'
  w='800px'  
  templateRows='repeat(4, 1fr)'
  templateColumns='repeat(4, 1fr)'  
  gap={1}
>
<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md' onClick={openViewFamilyModal}
_hover={{ bg: '#353535',  color: 'white' , cursor: "pointer"}}>
  <LinkOverlay onClick={openViewFamilyModal}></LinkOverlay>
  <AbsoluteCenter>
    
      <Box fontSize="16px" mb="10px">ViewFam</Box>
    
    <Center>
      <a onClick={openViewFamilyModal} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ViewIcon boxSize={5} />
       
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>

<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md' onClick={openAddFamilyModal}
_hover={{ bg: '#353535',  color: 'white' , cursor: "pointer"}}>
  <LinkOverlay onClick={openAddFamilyModal}></LinkOverlay>
  <AbsoluteCenter>
    
      <Box fontSize="16px" mb="10px">AddFam</Box>
    
    <Center>
      <a onClick={openAddFamilyModal} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AddIcon boxSize={5} />
       
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>
<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md' href='home/viewDoctors'
_hover={{ bg: '#353535',  color: 'white' }}>
  <LinkOverlay href='home/viewDoctors'></LinkOverlay>
  <AbsoluteCenter>
    
      <Box fontSize="16px" mb="10px">viewDoctors</Box>
    
    <Center>
      <a href='home/viewDoctors' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <EmailIcon boxSize={5} />
       
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>
<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md' href="home/bookAppointments"
_hover={{ bg: '#353535',  color: 'white', cursor: "pointer"  }}>
  <LinkOverlay href="home/bookAppointments"></LinkOverlay>
  <AbsoluteCenter>
    
      <Box fontSize="16px" mb="10px">BookAppointment</Box>
    
    <Center>
      <a href="home/bookAppointments" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <EditIcon boxSize={5} />
       
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>
<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md' onClick={openUploadDocModal}
  _hover={{ bg: '#353535',  color: 'white', cursor: "pointer" }}>
  <LinkOverlay onClick={openUploadDocModal}></LinkOverlay>
  <AbsoluteCenter>
    <Box fontSize="16px" mb="10px">Upload/Remove</Box>
    <Center>
      <a onClick={openUploadDocModal} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AttachmentIcon boxSize={5} />
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>
<LinkBox
  as="article"
  w="197px"
  h="148px"
  maxW="sm"
  p="1"
  borderWidth="1px"
  rounded="md"
  _hover={{ bg: "#353535", color: "white", cursor: "pointer" }} // Add cursor: pointer here
  onClick={openSecondModal}
>
  <LinkOverlay onClick={openSecondModal}></LinkOverlay>
  <AbsoluteCenter>
    <Box fontSize="16px" mb="10px">MyPackages</Box>
    <Center>
      <a
        onClick={openSecondModal}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <ViewIcon boxSize={5} />
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>
<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md' href="home/familyAppointments"
_hover={{ bg: '#353535',  color: 'white', cursor: "pointer"  }}>
  <LinkOverlay href="home/familyAppointments"></LinkOverlay>
  <AbsoluteCenter>
    
      <Box fontSize="16px" mb="10px">FamAppointments</Box>
    
    <Center>
      <a href="home/familyAppointments" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <EditIcon boxSize={5} />
       
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>
<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md' href="home/apptsP"
_hover={{ bg: '#353535',  color: 'white', cursor: "pointer"  }}>
  <LinkOverlay href="home/apptsP"></LinkOverlay>
  <AbsoluteCenter>
    
      <Box fontSize="16px" mb="10px">MyAppointments</Box>
    
    <Center>
      <a href="home/apptsP" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <EditIcon boxSize={5} />
       
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>
<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md' href="home/prescriptions"
_hover={{ bg: '#353535',  color: 'white', cursor: "pointer"  }}>
  <LinkOverlay href="home/prescriptions"></LinkOverlay>
  <AbsoluteCenter>
    
      <Box fontSize="16px" mb="10px">MyPrescriptions</Box>
    
    <Center>
      <a href="home/prescriptions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <EditIcon boxSize={5} />
       
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>
<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md'  onClick={() => navigate(`/home/viewPackages/${username}`)}
_hover={{ bg: '#353535',  color: 'white', cursor: "pointer" }}>
  <LinkOverlay  onClick={() => navigate(`/home/viewPackages/${username}`)}></LinkOverlay>
  <AbsoluteCenter>
    
      <Box fontSize="16px" mb="10px">SubscribePackages</Box>
    
    <Center>
      <a  onClick={() => navigate(`/home/viewPackages/${username}`)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <EditIcon boxSize={5} />
       
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>
<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md'  onClick={() => navigate(`/my-health-records/${username}/${name}`)}
_hover={{ bg: '#353535',  color: 'white', cursor: "pointer" }}>
  <LinkOverlay  onClick={() => navigate(`/my-health-records/${username}/${name}`)}></LinkOverlay>
  <AbsoluteCenter>
    
      <Box fontSize="16px" mb="10px">HealthRecords</Box>
    
    <Center>
      <a  onClick={() => navigate(`/my-health-records/${username}/${name}`)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <EditIcon boxSize={5} />
       
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>
<LinkBox as='article' w='197px' h='148px' maxW='sm' p='1' borderWidth='1px' rounded='md' onClick={openAddDeliveryModal}
_hover={{ bg: '#353535',  color: 'white' , cursor: "pointer"}}>
  <LinkOverlay onClick={openAddDeliveryModal}></LinkOverlay>
  <AbsoluteCenter>
    
      <Box fontSize="16px" mb="10px">AddDeliveryAddress</Box>
    
    <Center>
      <a onClick={openAddDeliveryModal} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AddIcon boxSize={5} />
       
      </a>
    </Center>
  </AbsoluteCenter>
</LinkBox>




</Grid>
</Card>
  );
}

export default PatientShortcuts;

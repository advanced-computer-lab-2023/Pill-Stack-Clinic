import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  ChakraProvider,
  Container,
  Text,
  VStack,
  extendTheme,
  CSSReset,
  useColorMode,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { FaFileContract } from 'react-icons/fa';

const theme = extendTheme({
  styles: {
    global: (props) => ({
      'html, body': {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
});

const Contract = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate('/');
      }
      const { data } = await axios.post('http://localhost:8000', {}, { withCredentials: true });
      const { status, user } = data;
      setUsername(user);
      return status
        ? toast(`Hello ${user}`, {
            position: 'top-right',
          })
        : (removeCookie('token'), navigate('/'));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);

  const [accepted, setAccepted] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState('');

  const handleAccept = async () => {
    setConfirmationAction('accept');
    setConfirmationOpen(true);
    const doctorUsername = username;
    try {
      // Send a request to update the contract status
      await axios.post('http://localhost:8000/doctor/updateContractStatus', {
      username: doctorUsername,
      },{withCredentials:true});
      // Update the local state
      setAccepted(true);
      setRejected(false);
    } catch (error) {
      console.error('Error updating contract status:', error);
      // Handle the error as needed
    }
  };

  const handleReject = () => {
    setConfirmationAction('reject');
    setConfirmationOpen(true);
  };

  const handleConfirmation = (action) => {
    if (action === 'accept') {
      setAccepted(true);
      setRejected(false);
      // Navigate to the doctor's home page route
      navigate('/doctor-home'); // Replace with your actual route
    } else if (action === 'reject') {
      setAccepted(false);
      setRejected(true);
    }
    setConfirmationOpen(false);
  };

  return (
    <Container centerContent>
      <VStack spacing={8}>
        <Box
          padding={8}
          borderRadius="md"
          boxShadow="md"
          bg="white"
          borderWidth="1px"
          borderColor="gray.200"
          position="relative" // Add a relative position to the contract box
        >
          <HStack spacing={4}>
            <FaFileContract fontSize="2rem" color="primary" />
            <Text fontSize="xl" fontWeight="bold" mb={4}>
              Doctor Contract
            </Text>
          </HStack>
          <Text>
            {/* Your contract text goes here */}
            Dear [Name of Clinic] Management,

This Contract ("Contract") is entered into on this [Date].

1. Engagement
1.1 The Clinic hereby engages the Doctor as a licensed and qualified.

2. Term
2.1 This Contract shall commence on [Start Date] and continue for .

3. Duties and Responsibilities
3.1 The Doctor agrees to:
    - Provide medical services in accordance with applicable laws.
    - Maintain proper records of patients' medical histories, .
    - Attend to patients as required, ensuring high-quality .
    - Comply with all relevant clinic policies, rules, and regulations.
3.2 The Clinic agrees to:
    - Provide necessary facilities, equipment, and staff for .
    - Ensure a safe and hygienic working environment for the Doctor.
    - Assist in the administrative aspects of the Doctor.

4. Compensation
4.1 The Doctor will be compensated according to the agreed-upon terms.

5. Confidentiality
5.1 Both parties agree to maintain strict confidentiality .

6. Termination
6.1 Either party may terminate this Contract with writ.

7. Governing Law
7.1 This Contract shall be governed by and construed .

8. Entire Agreement
8.1 This Contract contains the entire agreement betwee.
, the parties hereto have executed this Contract as of the .

[Doctor's Full Name]                       [Name of Clinic]
Printed Name: doctor       Printed Name: {username}
            {/* ... (contract text) */}
          </Text>
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '8px',
            }}
          >
            {/* Use inline CSS to position the buttons at the top-right corner */}
            <Button
              colorScheme={accepted ? 'green' : 'gray'}
              onClick={handleAccept}
              disabled={accepted || rejected}
            >
              {accepted ? 'Accepted' : 'Accept'}
            </Button>
            <Button
              colorScheme={rejected ? 'red' : 'gray'}
              onClick={handleReject}
              disabled={accepted || rejected}
            >
              {rejected ? 'Rejected' : 'Reject'}
            </Button>
          </div>
        </Box>

        <Modal isOpen={confirmationOpen} onClose={() => setConfirmationOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmation</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to {confirmationAction === 'accept' ? 'accept' : 'reject'} the contract?
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => handleConfirmation(confirmationAction)}>
                Yes
              </Button>
              <Button onClick={() => setConfirmationOpen(false)}>No</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
};

function DoctorContract() {
  const { colorMode } = useColorMode();
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Contract colorMode={colorMode} />
    </ChakraProvider>
  );
}
export default DoctorContract;
import React, { useState } from 'react';
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
  const [accepted, setAccepted] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState('');

  const handleAccept = () => {
    setConfirmationAction('accept');
    setConfirmationOpen(true);
  };

  const handleReject = () => {
    setConfirmationAction('reject');
    setConfirmationOpen(true);
  };

  const handleConfirmation = (action) => {
    if (action === 'accept') {
      setAccepted(true);
      setRejected(false);
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

This Contract ("Contract") is entered into on this [Date], by and between [Doctor's Full Name], hereinafter referred to as "Doctor," and [Name of Clinic], hereinafter referred to as the "Clinic."

1. Engagement
1.1 The Clinic hereby engages the Doctor as a licensed and qualified medical professional to provide medical services within the Clinic.

2. Term
2.1 This Contract shall commence on [Start Date] and continue for an initial term of [Initial Term], and may be renewed or extended by mutual agreement of both parties.

3. Duties and Responsibilities
3.1 The Doctor agrees to:
    - Provide medical services in accordance with applicable laws and regulations.
    - Maintain proper records of patients' medical histories, treatment plans, and other relevant information.
    - Attend to patients as required, ensuring high-quality medical care.
    - Comply with all relevant clinic policies, rules, and regulations.
3.2 The Clinic agrees to:
    - Provide necessary facilities, equipment, and staff for the Doctor to carry out their duties.
    - Ensure a safe and hygienic working environment for the Doctor.
    - Assist in the administrative aspects of the Doctor's practice within the Clinic.

4. Compensation
4.1 The Doctor will be compensated according to the agreed-upon terms and conditions, which include [Compensation Details].

5. Confidentiality
5.1 Both parties agree to maintain strict confidentiality regarding patient information, clinic operations, and any other confidential or proprietary information obtained during the term of this Contract.

6. Termination
6.1 Either party may terminate this Contract with written notice to the other party, subject to the terms and conditions outlined in this Contract.

7. Governing Law
7.1 This Contract shall be governed by and construed in accordance with the laws of [State].

8. Entire Agreement
8.1 This Contract contains the entire agreement between the parties and supersedes all previous agreements and understandings, whether written or oral.

IN WITNESS WHEREOF, the parties hereto have executed this Contract as of the date first above written.

[Doctor's Full Name]                       [Name of Clinic]
Printed Name: doctor       Printed Name: pill stack
            {/* ... (contract text) */}
          </Text>
          <div style={{ position: 'absolute', top: '850px', right: '8px' }}>
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

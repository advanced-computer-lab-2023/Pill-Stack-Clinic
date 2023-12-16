import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Button,
  Text,
} from '@chakra-ui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
 // 2bl el useeffect
export const ViewDocFollowup = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  let i=0;
  
  useEffect(() => {
    async function fetchFollowUps() {
      try {
        const response = await axios.get("http://localhost:8000/doctor/doctor-follow-ups", {
          withCredentials: true
        });
        setFollowUps(response.data);
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching follow-ups', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    }

    fetchFollowUps();
  }, [i]);

  const handleAcceptFollowUp = async (followUp) => {
    try {
      await axios.post('http://localhost:8000/doctor/accept', {
        patientUsername: followUp.PatientUsername,
        patientName: followUp.PatientName,
        startDate: followUp.StartDate,
        endDate: followUp.EndDate,
      }, { withCredentials: true });
  
      // Remove the accepted follow-up from the state
      setFollowUps(followUps.filter(fu => fu !== followUp));
      toast.success('Follow-up accepted', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      toast.error(`Error accepting follow-up: ${error.response?.data?.message || error.message}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };
  const handleRejectFollowUp = async (followUp) => {
    try {
      await axios.post('http://localhost:8000/doctor/reject', {
        patientUsername: followUp.PatientUsername,
        patientName: followUp.PatientName,
        startDate: followUp.StartDate,
        endDate: followUp.EndDate,
      }, { withCredentials: true });

      setFollowUps(followUps.filter(fu => fu !== followUp));
      toast.success('Follow-up rejected', {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (error) {
      toast.error('Error rejecting follow-up', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
    i++;
  };

  return (
    <>
      <Box bg={"linear-gradient(45deg, #1E9AFE, #60DFCD)"} p={5} boxShadow='2xl' mb={10}>
        <Text fontSize={'3xl'} color={'white'}>Doctor Follow-ups</Text>
      </Box>
      <Box p={4} borderWidth="1px" borderRadius="md" shadow="md">
        {loading ? (
          <Spinner />
        ) : (
          <Table variant="striped" shadow="md">
            <Thead>
              <Tr>
                <Th>Patient Name</Th>
                <Th>Follow-Up Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {followUps.map((followUp) => (
                <Tr key={`${followUp.PatientName}-${followUp.StartDate}`}>
                  <Td>{followUp.PatientName}</Td>
                  <Td>{new Date(followUp.StartDate).toLocaleString()}</Td>
                  <Td>
                    <Button colorScheme="green" size="sm" onClick={() => handleAcceptFollowUp(followUp)}>
                      Accept
                    </Button>
                    <Button colorScheme="red" size="sm" onClick={() => handleRejectFollowUp(followUp)}>
                      Reject
                    </Button>
                  </Td>
                </Tr>
              ))}
              {followUps.length === 0 && (
                <Tr>
                  <Td colSpan="3" textAlign="center">No follow-ups found.</Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        )}
      </Box>
      <ToastContainer />
    </>
  );
};

export default ViewDocFollowup;
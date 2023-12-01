import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Button,
  FormControl,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import { MdClear } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppointmentSearchAndTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState(appointments);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await axios.post(
          'http://localhost:8000/patient/allApp',
          {},
          {
            withCredentials: true,
          }
        );
        setAppointments(response.data);
        setFilteredAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    }
    fetchAppointments();
  }, []);

  useEffect(() => {
    const filtered = appointments.filter((appointment) => {
      const statusMatches = selectedStatus === 'All' || appointment.Status === selectedStatus;
      const dateMatches =
        (selectedStartDate === null || new Date(appointment.StartDate) >= selectedStartDate) &&
        (selectedEndDate === null || new Date(appointment.StartDate) <= selectedEndDate);

      return statusMatches && dateMatches;
    });
    setFilteredAppointments(filtered);
  }, [selectedStatus, selectedStartDate, selectedEndDate, appointments]);

  const handleClear = () => {
    setSelectedStatus('All');
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  const handleCancelAppointment = async (appointmentId) => {
    // ... existing logic for canceling an appointment
  };

  const handleFollowUpRequest = (appointment) => {
    console.log("Requesting follow-up for:", appointment);
    navigate('/follow-up-request');
  };

  return (
    <>
      <ToastContainer />
      <Box bg={'linear-gradient(45deg, #1E9AFE, #60DFCD)'} p={5} boxShadow="2xl" mb={10}>
        <Text fontSize={'3xl'} color={'white'}>
          My Appointments
        </Text>
        <Button className="btn" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
      <Box p={4} borderWidth="1px" borderRadius="md" shadow="md" bg="white" color="black">
        <FormControl mb={4}>
          {/* ... filter controls */}
        </FormControl>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Appointment Date</Th>
              <Th>Appointment Status</Th>
              <Th>Doctor Name</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredAppointments.map((appointment, index) => (
              <Tr key={index}>
                <Td>{new Date(appointment.StartDate).toLocaleString('en-US', { timeZone: 'UTC' })}</Td>
                <Td>{appointment.Status}</Td>
                <Td>{appointment.DoctorName}</Td>
                <Td>
                  {appointment.Status !== 'completed' && (
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleCancelAppointment(appointment._id)}
                      isDisabled={appointment.Status === 'cancelled'}
                    >
                      Cancel
                    </Button>
                  )}
                  {appointment.Status === 'completed' && (
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleFollowUpRequest(appointment)}
                    >
                      Request Follow Up
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

export default AppointmentSearchAndTable;

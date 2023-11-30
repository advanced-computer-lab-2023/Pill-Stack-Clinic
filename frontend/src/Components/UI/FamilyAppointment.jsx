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
  Input,
  Button,
  FormControl,
  Text,
  Flex
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import '../UI/button.css'
import { MdClear } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const  FamilyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState(appointments); // Initialize with all appointments
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const navigate = useNavigate();
  const back =()=>  navigate(-1);


  useEffect(() => {
    async function fetchAppointments() {
      try {
        // Fetch all appointments
        const response = await axios.get("http://localhost:8000/patient/viewFamilyAppointments", {
          withCredentials: true
        });
        console.log(response.data);
        setAppointments(response.data);
        setFilteredAppointments(response.data); // Initialize filteredAppointments with all appointments
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

  const handleCancelFamAppointment = async (appointmentId, index) => {
    try {
      const response = await axios.post(
        'http://localhost:8000/patient/cancelFamAppointments',
        { appointmentId },
        {
          withCredentials: true,
        }
      );

      // Update the state to reflect the canceled family appointment
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment, i) =>
          i === index
            ? { ...appointment, Status: 'cancelled' }
            : appointment
        )
      );

      // Display toast based on the response
      if (response.data.refund) {
        toast.success(`Cancelled family appointment with refund! Refunded amount: ${response.data.message}`, {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.success('Cancelled family appointment with no refund!', {
          position: 'top-right',
          autoClose: 3000,
        });
      }

      console.log('Cancelled family appointment');
    } catch (error) {
      console.error('Error cancelling family appointment:', error);
      toast.error('Failed to cancel family appointment. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };
  
  return (
    <>
      <Box bg={"linear-gradient(45deg, #1E9AFE, #60DFCD)"} p={5} boxShadow='2xl' mb={10}>
        <Text fontSize={'3xl'} color={'white'}>Family Appointments</Text>
        <button className="btn" onClick={back}>back</button>
      </Box>
      <Box p={4} borderWidth="1px" borderRadius="md" shadow="md">
        <FormControl mb={4}>
          <Flex alignItems="center" mb={2}>
            <Text mr={2} fontSize="sm">
              Filter by Status:
            </Text>
            <Select
              placeholder="Select Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              size="sm"
              fontSize="sm"
            >
              <option value="All">All</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </Select>
          </Flex>
  
          <Flex alignItems="center" mb={2}>
            <Text mr={2} fontSize="sm">
              Filter by Date:
            </Text>
  
            <DatePicker
              selected={selectedStartDate}
              onChange={(date) => setSelectedStartDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="Start Date & Time"
              size="sm"
            />
  
            <Text mx={2} fontSize="sm">
              to
            </Text>
  
            <DatePicker
              selected={selectedEndDate}
              onChange={(date) => setSelectedEndDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              placeholderText="End Date & Time"
              size="sm"
            />
          </Flex>
  
          <Button
            colorScheme="teal"
            onClick={handleClear}
            size="sm"
            fontSize="sm"
            leftIcon={<MdClear />}
            mt={2}
          >
            Clear Filters
          </Button>
        </FormControl>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Family Member</Th>
              <Th>Doctor</Th>
              <Th>Appointment Start Time</Th>
              <Th>Appointment End Time</Th>
              <Th>Appointment Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredAppointments.map((appointment, index) => (
              <Tr key={index}>
                <Td>{appointment.PatientName}</Td>
                <Td>{appointment.DoctorName}</Td>
                <Td>{new Date(appointment.StartDate).toLocaleString('en-US', { timeZone: 'UTC' })}</Td>
                <Td>{new Date(appointment.EndDate).toLocaleString('en-US', { timeZone: 'UTC' })}</Td>
                <Td>{appointment.Status}</Td>
                <Td>
                  {appointment.Status !== 'completed' && (
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleCancelFamAppointment(appointment._id, index)}
                      isDisabled={appointment.Status === 'cancelled'}
                    >
                      Cancel
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <ToastContainer /> {/* Toast container for displaying notifications */}
    </>
  );
};  

export default FamilyAppointments;
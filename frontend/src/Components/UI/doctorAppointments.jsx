import React, { useState, useEffect } from 'react';
import '../UI/button.css'
import { useNavigate } from "react-router-dom";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Select,
  Input,
  Text,
  Flex,
  Button,
  FormControl,
} from '@chakra-ui/react';
import axios from 'axios';
import { MdClear } from 'react-icons/md';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const navigate = useNavigate();
  const back =()=>  navigate(-1);
  useEffect(() => {
    // Fetch all appointments when the component mounts
    async function fetchAppointments() {
      try {
        const response = await axios.post("http://localhost:8000/doctor/allApp", {}, {
          withCredentials: true
        });
        setAppointments(response.data);
        setLoading(false);
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
    try {
        const response = await axios.post(
            'http://localhost:8000/doctor/cancelAppointments',
            { appointmentId },  // Corrected: Send appointmentId directly without wrapping in an object
            {
                withCredentials: true,
            }
        );

        // Update the state to reflect the canceled appointment
        setAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
                appointment._id === appointmentId
                    ? { ...appointment, Status: 'cancelled' }
                    : appointment
            )
        );

        // Display toast based on the response
        if (response.data.refund) {
            toast.success(`Cancelled appointment with refund! Refunded amount: ${response.data.message}`, {
                position: 'top-right',
                autoClose: 3000,
            });
        } else {
            toast.success('Cancelled appointment with no refund!', {
                position: 'top-right',
                autoClose: 3000,
            });
        }

        console.log('Cancelled appointment');
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        toast.error('Failed to cancel appointment. Please try again.', {
            position: 'top-right',
            autoClose: 3000,
        });
    }
};



return (
  <>
    <Box bg={"linear-gradient(45deg, #1E9AFE, #60DFCD)"} p={5} boxShadow='2xl' mb={10}>
      <Text fontSize={'3xl'} color={'white'}>Appointments</Text>
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

      <Table variant="striped" shadow="md">
        <Thead>
          <Tr>
            <Th>Patient Name</Th>
            <Th>Status</Th>
            <Th>Appointment Date</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr>
              <Td colSpan={3} textAlign="center">
                <Spinner size="lg" />
              </Td>
            </Tr>
          ) : filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment, index) => (
              <Tr key={index}>
                <Td>{appointment.PatientName}</Td>
                <Td>{appointment.Status}</Td>
                <Td>{new Date(appointment.StartDate).toLocaleString('en-US', { timeZone: 'UTC' })}</Td>
                <Td>
                  {appointment.Status !== 'completed' && (
                    <Button
                      colorScheme="red"
                      size="sm"
                      onClick={() => handleCancelAppointment(appointment._id, appointment.Status)}
                      isDisabled={appointment.Status === 'completed' || appointment.Status === 'cancelled'}
                    >
                      Cancel
                    </Button>
                  )}
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={3} textAlign="center">No appointments found.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  </>
);
};

export default ViewAppointments;

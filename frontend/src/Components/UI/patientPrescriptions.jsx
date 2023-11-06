import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Select,
  Input,
  Button,
  Tooltip,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

const PrescriptionViewer = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([...prescriptions]);
  const [filterDate, setFilterDate] = useState('');
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchPrescriptions() {
      try {
        // Send a GET request to the server to view prescriptions
        const response = await axios.post("http://localhost:8000/patient/prescriptions", {}, {
          withCredentials: true, // Include credentials if necessary
        });

        setPrescriptions(response.data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      }
    }

    fetchPrescriptions();
  }, []);

  useEffect(() => {
    // Implement filtering logic
    let filteredPrescriptions = prescriptions.filter((prescription) => {
      const dateMatches = !filterDate || prescription.Date.includes(filterDate);
      const doctorMatches = !filterDoctor || prescription.DocUsername === filterDoctor;
      const statusMatches = filterStatus === 'All' || prescription.Status === filterStatus;
      return dateMatches && doctorMatches && statusMatches;
    });

    setFilteredPrescriptions(filteredPrescriptions);
  }, [filterDate, filterDoctor, filterStatus, prescriptions]);

  const viewDetails = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const closeDetails = () => {
    setSelectedPrescription(null);
  };
  const openModal = (prescription) => {
    setSelectedPrescription(prescription);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <Box p={4} borderWidth="1px" borderRadius="md" shadow="md">
      <h1>Prescriptions</h1>
      <Box mb={4}>
        <Input
          type="date"
          placeholder="Filter by Date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <Select
          placeholder="Filter by Doctor"
          value={filterDoctor}
          onChange={(e) => setFilterDoctor(e.target.value)}
        >
          <option value="">All Doctors</option>
          <option value="Nada">Nada</option>
          <option value="Mariam">Mariam</option>
          <option value="Dareen">Dareen</option>
        </Select>
        <Select
          placeholder="Filter by Status"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Filled">Filled</option>
          <option value="Unfilled">Unfilled</option>
        </Select>
      </Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Medicine ID</Th>
            <Th>Quantity</Th>
            <Th>Instructions</Th>
            <Th>Date</Th>
            <Th>Doctor Username</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredPrescriptions.map((prescription, index) => (
            <Tr key={index}>
              <Td>{prescription.Medicine[0].MedicineID}</Td>
              <Td>{prescription.Medicine[0].Quantity}</Td>
              <Td>{prescription.Medicine[0].Instructions}</Td>
              <Td>{prescription.Date}</Td>
              <Td>{prescription.DocUsername}</Td>
              <Td>{prescription.Status}</Td>
              <Td>
                <Tooltip label="View Details" hasArrow placement="top">
                  <Button colorScheme="teal" onClick={() => openModal(prescription)}>
                    Details
                  </Button>
                </Tooltip>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal isOpen={isModalOpen} onClose={closeModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Prescription Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Medicine ID: {selectedPrescription?.Medicine[0].MedicineID}</p>
            <p>Quantity: {selectedPrescription?.Medicine[0].Quantity}</p>
            <p>Instructions: {selectedPrescription?.Medicine[0].Instructions}</p>
            <p>Date: {selectedPrescription?.Date}</p>
            <p>Doctor Username: {selectedPrescription?.DocUsername}</p>
            <p>Status: {selectedPrescription?.Status}</p>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={closeModal}>
              Close Details
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PrescriptionViewer;
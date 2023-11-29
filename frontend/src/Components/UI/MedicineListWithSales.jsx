import React, { useState, useEffect } from 'react';
import MedicinalUseFilter from '../UI/MedicinalUseFilter';
import EditMedicine from '../UI/EditMedicine';
import { Button, Input, VStack, HStack, Heading, Text, Box } from '@chakra-ui/react';
import '../UI/button.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export function MedicineListwithSales() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicinalUse, setSelectedMedicinalUse] = useState('');
  const [medicinalUses, setMedicinalUses] = useState([]);
  const [editMedicine, setEditMedicine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/admin/availableMedicines')
      .then((response) => response.json())
      .then((data) => setMedicines(data))
      .catch((error) => console.error('Error fetching medicine data:', error));

    fetch('http://localhost:8000/admin/MedicinalUse')
      .then((response) => response.json())
      .then((data) => setMedicinalUses(data))
      .catch((error) => console.error('Error fetching medicinal uses:', error));
  }, []);

  const openEditModal = (medicine) => {
    setEditMedicine(medicine);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setEditMedicine(null);
    setIsModalOpen(false);
  };
  const back =()=>  navigate(-1);

  const updateMedicine = async (updatedMedicine) => {
    try {
      // Update the medicine's details and price on your server
      await axios.put(`http://localhost:8000/admin/availableMedicines/${updatedMedicine._id}`, updatedMedicine);

      // Update the medicine in your local state
      const updatedMedicines = medicines.map((medicine) => (
        medicine._id === updatedMedicine._id ? updatedMedicine : medicine
      ));
      setMedicines(updatedMedicines);

      closeEditModal();
    } catch (error) {
      console.error('Error updating medicine:', error);
    }
  };

  const filteredMedicines = medicines
    .filter((medicine) => medicine.Name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((medicine) => selectedMedicinalUse === '' || medicine.MedicinalUse.includes(selectedMedicinalUse));

  return (
    <><Box bg={'#4bbbf3'} p={5} boxShadow='2xl' mb={10}>
      <Text fontSize={'3xl'} color={'white'}>Stock Management</Text>
      <button className="btn" onClick={back}>back</button>
    </Box><VStack align="start" spacing={6} p={6} w="100%">

        <Heading as="h1" color='teal' mb={4}>Available Medicines</Heading>
        <MedicinalUseFilter
          selectedMedicinalUse={selectedMedicinalUse}
          onMedicinalUseChange={setSelectedMedicinalUse}
          medicinalUses={medicinalUses} />
        <Input
          htmlSize={15} width='auto'
          type="text"
          placeholder="Search medicines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} />
        <VStack align="start" w="100%">
          {filteredMedicines.map((medicine, index) => (
            <Box key={medicine._id} w='100%' p={4} borderWidth="10px" borderRadius="md">
              <Text>Name: {medicine.Name}</Text>
              <Text>Details: {medicine.Details}</Text>
              <Text>Price: ${medicine.Price}</Text>
              <Text>Available Quantity: {medicine.Quantity}</Text>
              <Text>Sales: {medicine.Sales}</Text>
              <Button size="sm" colorScheme="teal" onClick={() => openEditModal(medicine)}>Edit</Button>

              {index !== filteredMedicines.length - 1 && (
                <Box h="1px" bg="gray.200" w="100%" my={4}></Box>
              )}
            </Box>
          ))}
        </VStack>
        {isModalOpen && (
          <Box className="modal" p={4} borderWidth="1px" borderRadius="md">
            <EditMedicine medicine={editMedicine} onUpdate={updateMedicine} />
            <Button mt={4} size='sm' colorScheme='teal' onClick={closeEditModal}>Close</Button>
          </Box>
        )}
      </VStack></>
  );
}

export default MedicineListwithSales;

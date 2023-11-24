import React, { useState, useEffect } from 'react';
import MedicinalUseFilter from '../UI/MedicinalUseFilter';
import { Navbar } from '../UI/navbarPharma';
import axios from "axios";
import MedicineItem from '../UI/MedicineItem';
import { Text,SimpleGrid, Input, Box } from '@chakra-ui/react';
import '../UI/button.css'
import { useNavigate } from 'react-router-dom';
import '../../index.css'

export function MedicineList() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicinalUse, setSelectedMedicinalUse] = useState('');
  const [medicinalUses, setMedicinalUses] = useState([]);
  const [addToCartQueue, setAddToCartQueue] = useState([]);
  const [processingQueue, setProcessingQueue] = useState(false); // Flag to prevent concurrent processing
  const navigate = useNavigate();
  const back =()=>  navigate(-1);

  useEffect(() => {
    // Fetch medicines and their medicinal uses from your server's API endpoint
    fetch('http://localhost:8000/admin/availableMedicines')
      .then((response) => response.json())
      .then((data) => setMedicines(data))
      .catch((error) => console.error('Error fetching medicine data:', error));

    // Fetch the list of unique medicinal uses
    fetch('http://localhost:8000/admin/MedicinalUse')
      .then((response) => response.json())
      .then((data) => setMedicinalUses(data))
      .catch((error) => console.error('Error fetching medicinal uses:', error));
  }, []);

  const addToCart = async (medicine, quantity) => {
    try {
      const response = await axios.post('http://localhost:8000/cart', {
        productId: medicine._id,
        quantity,
      }, { withCredentials: true });

      // Process the response or handle any other logic here
      setAddToCartQueue((prevQueue) => prevQueue.filter((item, index) => index !== 0));

      // Now that the request is complete, check the queue for more items to process
    } catch (error) {
      // Handle errors here
      // Also, make sure to handle the queue in case of errors
      setAddToCartQueue((prevQueue) => prevQueue.filter((item, index) => index !== 0));

    }
  };

  // Use useEffect to process the queue when it changes
  useEffect(() => {
    const processQueue = async () => {
      if (!processingQueue && addToCartQueue.length > 0) {
        const nextCartItem = addToCartQueue[0];
        const { medicine, quantity } = nextCartItem;

        setProcessingQueue(true);

        await addToCart(medicine, quantity);
        //setAddToCartQueue((prevQueue) => prevQueue.slice(1)); // Remove the processed item
        setProcessingQueue(false); // Release the processing flag
      }
    };

    processQueue();
  }, [addToCartQueue, processingQueue]);

  const handleAddToCart = (medicine, quantity) => {
    // Add the item to the queue
    setAddToCartQueue((prevQueue) => [...prevQueue, { medicine, quantity }]);
    // Start processing the queue if it's not already being processed
  };


  // Filter the medicines based on the search term and selected medicinal use
  const filteredMedicines = medicines
    .filter((medicine) =>
      medicine.Name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((medicine) =>
      selectedMedicinalUse === '' ||
      medicine.MedicinalUse.includes(selectedMedicinalUse)
    );

  return (
    <Box className="med_page" >
           
      <Navbar />
      
      <Text fontSize={'3xl'} color={'Black'} >Over-the-counter medicine</Text>

      {/* <Heading as="h1" mb={4}>
        Available Medicines
      </Heading> */}
      <MedicinalUseFilter
        selectedMedicinalUse={selectedMedicinalUse}
        onMedicinalUseChange={setSelectedMedicinalUse}
        medicinalUses={medicinalUses}
      />
      <Input htmlSize={15} width='auto'
        type="text"
        placeholder="Search medicines..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
      />
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        {filteredMedicines.map((medicine) => (
          <MedicineItem
            key={medicine._id}
            medicine={medicine}
            addToCart={handleAddToCart}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default MedicineList;

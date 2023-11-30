import React, { useState } from 'react';
import { Input } from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import axios from 'axios'; // Import axios for making HTTP requests

export function EditMedicine({ medicine, onUpdate }) {
  const [editedDetails, setEditedDetails] = useState(medicine.Details);
  const [editedPrice, setEditedPrice] = useState(medicine.Price);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
 var price;
 var details;
  const handleUpdate = async() => {
    try {
         price=editedPrice;
        details=editedDetails;
        // Make an HTTP PUT request to update the medicine information on the server
        await axios.put(`http://localhost:8000/pharmacist/editmedResults?medicineName=${medicine.Name}&newPrice=${price}&newDetails=${details}`);
  
        // Update the medicine's details and price in your local state
        medicine.Details = editedDetails;
        medicine.Price = editedPrice;
        onUpdate(medicine);
  
        // Set the success state and clear any previous error
        setIsSuccess(true);
        setError(null);
      } catch (error) {
        console.error('Error updating medicine information:', error);
        setIsSuccess(false);
        setError('Error updating medicine information. Please try again.');
      }
  };

  return (
    <div>
      <Text fontSize='lg'> Edit Medicine</Text>
      <label>Details:</label>
      <Input
        type="text"
        value={editedDetails}
        onChange={(e) => setEditedDetails(e.target.value)}
      />
      <br />
      <label>Price:</label>
      <Input
        type="number"
        value={editedPrice}
        onChange={(e) => setEditedPrice(e.target.value)}
      />
      <br />
      <br />

      <Button colorScheme='teal' size='md' onClick={handleUpdate}>Save</Button>
      {isSuccess && <p>Medicine information updated successfully!</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default EditMedicine;

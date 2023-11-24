import React, { useState } from 'react';
import { Buffer } from 'buffer';

import {
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

const MedicineItem = ({ medicine, addToCart }) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div key={medicine._id} className="medicine-card">
     <img
  width="150"
  height="150"
  style={{ objectFit: 'cover', maxHeight: '150px' }}  // Added styling for consistent height
  src={`data:${medicine.Image.contentType};base64, ${Buffer.from(
    medicine.Image.data
  ).toString('base64')}`}
  alt={medicine.Name}
/>

      <h2>{medicine.Name}</h2>
      <p>{medicine.Details}</p>
      <p>Price: ${medicine.Price}</p>
      <div className="quantity-control">
        <NumberInput value={quantity} onChange={(value) => setQuantity(value)} min={1}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </div>
      <Button onClick={() => addToCart(medicine, quantity)} mt={2} colorScheme="teal">
        Add to Cart
      </Button>
    </div>
  );
};

export default MedicineItem;

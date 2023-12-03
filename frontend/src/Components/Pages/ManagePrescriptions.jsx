import React, { 
    useEffect,
    useState
 } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import { Box,
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    HStack,
    FormControl, FormLabel, Input, Flex,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Center,
    Divider,
    Grid


 } from '@chakra-ui/react';
import Prescription from '../UI/Prescription';

const ManagePrescriptions = () => {
    const { patientUser } = useParams();
    const [patient, setPatient] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [inputList, setinputList]= useState([
        {medName:'',
         quantity:1,
            dose:1,
         instructions:''
        }
    ]);
    const [up , setUp]= useState(false);

    useEffect(() => {
            const getPatient = async () => {
                const { data } = await axios.get(`http://localhost:8000/doctor/fullPatient/${patientUser}`, {
                    withCredentials: true,
                });
                setPatient(data);
            }
            getPatient();
    }, [up]);

    
        const handleInputChange=(e, index)=>{
            // const {name, value}= e.target;
            const { value, name, type } = e.target;
            const list= [...inputList];
            list[index][name] = value; // For text inputs
            // list[index][name]= value;
            setinputList(list);
        }
        const handleQuanChange = (value, index) => {
            const list = [...inputList];
            list[index].quantity = value; // Update the quantity directly
            setinputList(list);
          }
        const handleDoseChange = (value, index) => {
            const list = [...inputList];
            list[index].dose = value; // Update the quantity directly
            setinputList(list);
        }
          

        const handleRemove= index=>{
            const list=[...inputList];
            list.splice(index,1);
            setinputList(list);
            console.log(list);
        }

        const handleAddClick=()=>{ 
            setinputList([...inputList, { medName:'', quantity:'', instructions:''}]);
        }

        const handleAddPrescription = async () => {
            const { data } = await axios.post(`http://localhost:8000/doctor/addPrescription/${patientUser}`, {
                prescriptions: inputList,
            }, {
                withCredentials: true,
            });
            console.log(data);
            setUp(!up);
            onClose();
        }

        const Download=async(prescription)=>{
          try{
          const response=await axios.post(`http://localhost:8000/doctor/PDF/${patientUser}`,{prescription:prescription},
          {withCredentials:true},)
          // setTimeout(() => {
          //   setfalse(true);
          // }, 5000);
          // if(!response.ok){
          //   throw new Error('Server response not OK');
          // }
          if(response.status){
          console.log(response.data.file); 
          const base64File = response.data.file;
          const fileType = base64File.substring('data:'.length, ';'.length);
          const fileName = response.data.filename;
         
          const binaryData = atob(base64File.split(',')[1]);
          const length = binaryData.length;
          const arrayBuffer = new ArrayBuffer(length);
          const uint8Array = new Uint8Array(arrayBuffer);
         
          for (let i = 0; i < length; i++) {
             uint8Array[i] = binaryData.charCodeAt(i);
          }
         
          const blob = new Blob([uint8Array], { type: fileType });
          const link = document.createElement('a');
          link.download = fileName;
          link.href = URL.createObjectURL(blob);
          link.click();}}
          catch(err){
            console.log(err);
          }
        }


  return (
    <>
        <Box m={20}>
            <Flex justifyContent={'space-between'}>
            <Text 
                fontSize={'4xl'}> Available Prescriptions
            </Text>
            <Button
                colorScheme={'teal'}
                variant={'solid'}
                onClick={() => onOpen() }
            >
                Add Prescription
            </Button>
            </Flex>
            <Divider my={5}/>
            <Flex my={7} justifyContent={'space-evenly'}>
            {
            //if prescriptions > 0 
                patient.Prescriptions &&
              patient.Prescriptions[0] ?
              patient.Prescriptions.map((prescription, index) => (
                <>
                {console.log("presss", prescription)}
                <Prescription data={prescription} key={index} download={()=>Download(prescription)}/>
                </>
              ))
              : 
              <Box minH={'200px'}>
                <Text>No current prescriptions found</Text>
              </Box>
            }
            </Flex>
        </Box>

    <   Modal onClose={onClose} size={'2xl'} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Prescription</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
  <Flex justifyContent={'space-between'} mx={5}>
    <FormLabel>Med Name</FormLabel>
    <FormLabel>Quantity</FormLabel>
    <FormLabel>Dose</FormLabel>
    <FormLabel>Instructions</FormLabel>
  </Flex>
  {inputList.map((x, i) => {
    return (
      <Grid
        templateColumns="repeat(4, 1fr)"
        gap={4}
        alignItems="center"
        key={i}
        my={2}
      >
        <FormControl>
          <Input
            type="text"
            name="medName"
            class="form-control"
            placeholder="Med Name"
            value={x.medName}
            onChange={(e) => handleInputChange(e, i)}
          />
        </FormControl>
        <FormControl>
        <NumberInput
                defaultValue={1}
                min={1}
                value={x.quantity} 
                onChange={(value) => handleQuanChange(value, i)} 
                >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
                </NumberInput>
        </FormControl>
        <FormControl>
        <NumberInput
                defaultValue={1}
                min={1}
                value={x.dose} 
                onChange={(value) => handleDoseChange(value, i)} 
                >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
                </NumberInput>
        </FormControl>
        <FormControl>
          <Input
            type="text"
            name="instructions"
            class="form-control"
            placeholder="Instructions"
            value={x.instructions}
            onChange={(e) => handleInputChange(e, i)}
          />

        </FormControl>
                  {inputList.length !== 1 && (
            <Button
              colorScheme="red"
              variant="outline"
              minW="fit-content"
              onClick={() => handleRemove(i)}
            >
              Remove
            </Button>
          )}
        <div class="form-group col-md-2 mt-4">
            {inputList.length - 1 === i && (
            <Button onClick={handleAddClick}>Add More</Button>
            )}
        </div>
      </Grid>
    );
  })}

</ModalBody>

            <ModalFooter>
                <Button colorScheme="teal" mr={3}
                onClick={ () => {
                    handleAddPrescription();
                }}
                >
                    Send Prescription
                </Button>
                <Button onClick={onClose}>Close</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </>
  )

}

export default ManagePrescriptions

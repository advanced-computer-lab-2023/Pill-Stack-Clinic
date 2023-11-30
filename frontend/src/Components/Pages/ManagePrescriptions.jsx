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
    Divider


 } from '@chakra-ui/react';
import Prescription from '../UI/Prescription';

const ManagePrescriptions = () => {
    const { patientUser } = useParams();
    const [patient, setPatient] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [inputList, setinputList]= useState([
        {medName:'',
         quantity:1,
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

    
        const handleinputchange=(e, index)=>{
            // const {name, value}= e.target;
            const { value, name, type } = e.target;
            const list= [...inputList];
            list[index][name] = value; // For text inputs
            // list[index][name]= value;
            setinputList(list);
        }
        const handleNumChange = (value, index) => {
            const list = [...inputList];
            list[index].quantity = value; // Update the quantity directly
            setinputList(list);
          }
          

        const handleremove= index=>{
            const list=[...inputList];
            list.splice(index,1);
            setinputList(list);
            console.log(list);
        }

        const handleaddclick=()=>{ 
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



  return (
    <>
        <Box m={20}>
            <Flex justifyContent={'space-between'}>
            <Text 
                fontSize={'4xl'}> Available Prescriptions
            </Text>
            <Button
                onClick={() => onOpen() }
            >
                Add Prescription
            </Button>
            </Flex>
            <Divider my={5}/>
            {/* <Center my={10}> */}
            <Flex my={7} justifyContent={'space-evenly'}>
            {
            //if prescriptions > 0 
              patient.Prescriptions ?
              patient.Prescriptions.map((prescription, index) => (
                <>
                {console.log("presss", prescription)}
                <Prescription data={prescription} key={index}/>
                </>
              ))
              : 
              <Box minH={'200px'}>
                <Text>No current prescriptions found</Text>
              </Box>
            }
            </Flex>
            {/* </Center> */}
        </Box>

    <   Modal onClose={onClose} size={'2xl'} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Prescription</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <FormLabel >Meds</FormLabel>

             { 
            inputList.map( (x,i)=>{
              return(
              <Box m={4}>
                <FormControl my={5}>
                <HStack>

                  <Input 
                  type="text"  
                  name="medName" 
                  class="form-control"  
                  placeholder="Enter First Name" 
                  value={x.medName} 
                  onChange={ e=>handleinputchange(e,i)}
                   />

                  <Input 
                  type="text"  
                  name="instructions" 
                  class="form-control"   
                  placeholder="Enter Last Name" 
                  value={x.instructions} 
                  onChange={ e=>handleinputchange(e,i) }
                  />

                {/* <NumberInput defaultValue={1} min={1} 
                name="quantity"
                // value={x.quantity}
                onChange={ e=>handleinputchange(e,i)}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput> */}
                
                <NumberInput
                defaultValue={1}
                min={1}
                value={x.quantity} // Ensure the value of the NumberInput reflects the quantity in the state
                onChange={(value) => handleNumChange(value, i)} // Call handleInputChange with the updated value and index
                >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
                </NumberInput>

                {
                  inputList.length!==1 &&
                  <Button colorScheme='red' variant={'outline'}  minW={'fit-content'}
                   onClick={()=> handleremove(i)}>Remove</Button>
                }
                </HStack>

                </FormControl>
               <div class="form-group col-md-2 mt-4">
               { inputList.length-1===i &&
               <Button onClick={ handleaddclick}>Add More</Button>
               }
               </div>
            </Box>
              );
             } )} 
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

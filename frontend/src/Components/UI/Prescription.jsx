import React from 'react'
import { useState } from 'react';
import { Box,
    Divider,
    HStack,
    Text,
    Tag,
    TagLabel,
    TagRightIcon,
    Flex,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Input,
    Spacer,
    Stack,

    

  
 } from '@chakra-ui/react';
import { EditIcon,
    DeleteIcon
 } from '@chakra-ui/icons';
import { m } from 'framer-motion';
import { Link } from "react-router-dom";

function Prescription(
    {data, keyId, callback,gotoshop,openModal, download}
) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inputList, setinputList]= useState(data.Medicine);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = inputList;
    console.log("list", list);
    console.log("index", index);
    console.log("name", name);
    console.log("value", value);

    list[index][name] = value;
    setinputList(list);
  };

  return (
    <>
    {console.log("initial", inputList)}
        <Box
            rounded={20}
            minH={'200px'}
            bg={'#eeeeee'}
            boxShadow={'xl'}
            p={10}
        >
          {console.log("im id", keyId)}
          {/* top right date */}
          <Flex justifyContent={'space-between'}>
          <Tag size={'lg'} variant='outline' colorScheme='blue' h={'fit-content'}>
            <TagLabel>{data.Status}</TagLabel>
          </Tag>
            <Text
                fontSize={'xl'}
                fontWeight={'bold'}
                textAlign={'right'}
                mb={10}
            >
              {console.log(data.Date)}
              {data.PrescriptionDate && new Date(data.PrecriptionDate).toLocaleDateString()}{data.Date && new Date(data.Date).toLocaleDateString()}
            </Text>
          </Flex> 
            {
              //map through prescriptions
              data.Medicine.map((med, index) => (
                <>
                {/* <HStack m={2}> */}
                <Text
                    fontSize={'xl'}
                    fontWeight={'bold'}
                    textAlign={'left'}
                >
                  {med.MedicineName}
                </Text>
                <HStack>
                <Text
                    fontSize={'md'}
                    textAlign={'left'}
                >
                  Quantity: {med.Quantity}, 
                </Text>
                <Text
                    ml={1}
                    fontSize={'md'}
                    textAlign={'left'}
                >
                  Dose: {med.Dose || med.MedicineDose} , Instructions:  {med.Instructions}
                </Text>

                </HStack>
                <Divider />
                </>
              ))
            }
 <Spacer></Spacer>
           {!callback && <Button colorScheme="teal"><Link to={"http://localhost:3001/medicine"}>Buy</Link></Button>}
            <Flex mt={10} alignItems={'center'}>
            {
              data.Status === 'Unfilled' && callback&&
              <IconButton
              isRound={true}
              variant='solid'
              colorScheme='teal'
              aria-label='Done'
              fontSize='20px'
              icon={<EditIcon />}
                onClick={() => onOpen()}
              />
            }
            {console.log(data)}
            {callback && <Button colorScheme="teal" left="5%" onClick={() => download(data)}>Download</Button>}
           {!callback && <Button colorScheme="teal"  onClick={() => download(data)}>Download</Button>}
          
         <Spacer></Spacer>


            <Text
                fontSize={'xl'}
                textAlign={'right'}
                // mt={10}
                fontStyle={'italic'}
            >
              by: {data.DocUsername}
            </Text>
            </Flex>
       </Box>
       <Modal onClose={onClose} size={'xl'} isOpen={isOpen}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Edit Prescription</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Stack>
          {
            inputList.map((med, index) => (
              <>
              <HStack  mx={5} my={2} spacing={2}
                alignItems={'flex-end'}
              >
                <Box>
                <Text mb={0} >Med Name</Text>
                  <Input 
                    placeholder={med.MedicineName} 
                    name="MedicineName"
                    key={index+"m"}
                    onChange={e => {
                      handleChange(e, index);
                    }}
                  />
                </Box>
                <Box>
                <Text mb={0} as={'sub'}>Quantity</Text>
                <Input 
                  // value={med.Quantity}
                  key={index+"q"}
                  name="Quantity"
                  placeholder= {med.Quantity}
                  onChange={e => {
                    handleChange(e, index);
                  }}
                 />
                 </Box>
                 <Box>
                <Text mb={0} as={'sub'}>Dose</Text>
                <Input 
                  placeholder={med.Dose} 
                  name="Dose"
                  key={index+"d"}

                  onChange={e => {
                    handleChange(e, index);
                  }}
                />
                </Box>
                <Box>
                <Text mb={0} as={'sub'}>Instructions</Text>
                <Input 
                  placeholder={med.Instructions} 
                  name="Instructions"
                  key={index+"i"}
                  onChange={e => {
                    handleChange(e, index);
                  }}
                />
                </Box>
                <IconButton title='remove' colorScheme='red' variant={'outline'}  icon={<DeleteIcon />}
                  onClick={() => {
                    // const list = inputList;
                    // list.splice(index, 1);
                    // setinputList(list);
                    const updatedList = inputList.filter((_, idx) => idx !== index);
                    setinputList(updatedList);
                    console.log("list", updatedList);
                  }}
                />
              </HStack>
              </>
            ))
          }

          <Button m={5} colorScheme={'teal'} variant={'outline'} rounded={10} 
          onClick={() => {
            setinputList([...inputList, {MedicineName: '', Quantity: '', Dose: '', Instructions: ''}]);
          }}
          > Add Medicine </Button>
          </Stack>

          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3}
              onClick={() => {
                console.log("inputList", inputList);
                callback(inputList, keyId);
                setinputList([]);
                onClose();
              }}
            >

              Save
            </Button>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Prescription

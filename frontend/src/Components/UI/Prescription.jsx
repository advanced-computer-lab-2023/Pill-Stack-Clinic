import React from 'react'
import { Box,
    Divider,
    HStack,
    Text,
    Tag,
    TagLabel,
    TagRightIcon,
    Flex
  
 } from '@chakra-ui/react'




function Prescription(
    {data, key}
) {
  return (
    <>
        <Box
            w={'40%'}
            rounded={20}
            minH={'200px'}
            bg={'#eeeeee'}
            boxShadow={'xl'}
            p={10}
        >
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
              {new Date(data.PrecriptionDate).toLocaleDateString()}
            </Text>
          </Flex> 
            {
              //map through prescriptions
              data.Medicine.map((med, index) => (
                <>
                <HStack m={2}>
                <Text
                    fontSize={'xl'}
                    fontWeight={'bold'}
                    textAlign={'left'}
                >
                  {med.MedicineName}
                </Text>
                <Text
                    fontSize={'md'}
                    textAlign={'left'}
                >
                  Quantity: {med.Quantity}
                </Text>
                <Text
                    fontSize={'md'}
                    textAlign={'left'}
                >
                  , {med.Instructions}
                </Text>
                </HStack>
                <Divider />
                </>
              ))
            }

            {/* bottom right goctor name */}
            <Text
                fontSize={'xl'}
                textAlign={'right'}
                mt={10}
                fontStyle={'italic'}
            >
              by: {data.DocUsername}
            </Text>

       </Box>
    </>
  )
}

export default Prescription

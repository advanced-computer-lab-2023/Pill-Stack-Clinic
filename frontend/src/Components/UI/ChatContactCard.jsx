import React from 'react'
import { Box ,
    Flex,
    Avatar,
    Text,
    Badge,
    Button,

} from '@chakra-ui/react'
import { motion } from "framer-motion";

function ChatContactCard( {patientUsername, handleDoctorClick, selectedPatient}) {
  return (
    <>
    {console.log(selectedPatient)}
    <motion.Box  
        onClick={() => handleDoctorClick(patientUsername)}
        whileTap={{ scale: 1 }}
        style={{ width: '100%',innerHeight:'max-content' ,  backgroundColor: '#4fbbf3' , borderRadius: '10px', boxShadow: 'lg' }}
        whileHover={{ scale: 1.02, transition: { duration: 0.1 } , cursor: 'pointer', boxShadow: '2xl' }}
        >
        <Flex p={2} alignItems={'center'}>
        <Avatar  src='https://bit.ly/broken-link' />
        <Box ml='3'>
            <Text fontWeight='bold' mb={1}> 
                {patientUsername}
            </Text>
        </Box>
        </Flex>
        </motion.Box>
    </>
  )
}

export default ChatContactCard

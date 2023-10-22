import React from 'react'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import PackageCard from '../UI/PackageCard';
import {
    Box,
    Button,
    Text,
    SimpleGrid,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react";


function AdminPacks() {
    const [packs, setPacks] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();


    useEffect(() => {
        const getPacks = async () => {
            const { data } = await axios.get("http://localhost:8000/admin/packages", {
                withCredentials: true,
            });
            setPacks(data);
        };
        getPacks();
    }, [ ]);

    const handleAddPack = () => {
        // navigate("/admin-add-pack");
        onOpen()

        
    }


  return (
    <Box >
        {console.log(packs)}    
        <Box bg={'#4bbbf3'} p={5}>
            <Text fontSize={'3xl'} color={'white'} >Manage Packages</Text>
        </Box>
        <Box m={10}>
        {
            packs &&
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} p={5} rounded={5}>
                <SimpleGrid columns={3} spacing={15} >
                {packs.map((pack) => (
                    <PackageCard key={pack.id} pack={pack} />
                ))}
                </SimpleGrid>
            </Box>
        }
        <Button  size="md" bg={'grey'} 
        onClick={handleAddPack}>
            Add Package
        </Button>
        </Box>
        <Modal onClose={onClose} size={'xl'} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                
            </ModalBody>
            <ModalFooter>
                <Button onClick={onClose}>Close</Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </Box>
    
  );
}

export default AdminPacks
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
    Input,
    Flex
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
    }, [packs]);

    const handleModal = () => {
        onOpen()
    }

    const handleAddPack = async () => {
        const pName = document.getElementById('pName').value;
        const pPrice = document.getElementById('pPrice').value;
        const pFamDiscount = document.getElementById('pFamDiscount').value;
        const pPharmDiscount = document.getElementById('pPharmDiscount').value;
        const pSessionDiscount = document.getElementById('pSessionDiscount').value;
        console.log(pName, pPrice, pFamDiscount, pPharmDiscount, pSessionDiscount);

        const packageData = {
            //       Package_Name: req.body.packagename, 
    //    Price: req.body.price, 
    //    Session_Discount:req.body.session_dis, 
    //    Pharmacy_Discount:req.body.pharmacy_dis,
    //    Family_Discount: req.body.family_dis,   
            packagename: pName,
            price: pPrice,
            session_dis: pSessionDiscount,
            pharmacy_dis: pPharmDiscount,
            family_dis: pFamDiscount
        };

    const response = await axios.post("http://localhost:8000/admin/packages", packageData, {
            withCredentials: true,
        }).catch((err) => {
            toast.error("err.response.data.message");
        });
        onClose();
    
    }


  return (
    <Box >
        {console.log(packs)}    
        <Box bg={'#4bbbf3'} p={5} boxShadow='2xl'>
            <Text fontSize={'3xl'} color={'white'} >Manage Packages</Text>
        </Box>
        <Box m={10} mt={20} bg='#f5f5f5'>
            {
                packs &&
                // <Box display={'flex'} justifyContent={'center'} alignItems={'center'} p={5} rounded={5} flexDirection={'column'}>
                    <SimpleGrid spacing={10} templateColumns='repeat(auto-fill, minmax(300px, 0.9fr))' p={15}>
                    {packs.map((pack) => (
                        <PackageCard key={pack.id} pack={pack} />
                    ))}
                    </SimpleGrid>
                // </Box>
            }
            <Flex justifyContent={'end'} alignItems={'center'} p={5} rounded={5}>
            <Button  size="md" bg={'grey'} 
            onClick={handleModal}>
                Add Package
            </Button>
            </Flex>
        </Box>
        <Modal onClose={onClose} size={'xl'} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>New Package</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Text fontSize={'3xl'} color={'black'} textAlign={'center'}>
                    Name:
                </Text>
                <Input placeholder="Package Name" id={'pName'}/>
                <Text fontSize={'3xl'} color={'black'} textAlign={'center'}>
                    Price:
                </Text>
                <Input placeholder="Package Price" id={'pPrice'}/>
                <Text fontSize={'3xl'} color={'black'} textAlign={'center'}>
                    Family Discount:
                </Text>
                <Input placeholder="Family Discount"  id={'pFamDiscount'}/>
                <Text fontSize={'3xl'} color={'black'} textAlign={'center'}>
                    Pharmacy Discount:
                </Text>
                <Input placeholder="Pharmacy Discount" id={'pPharmDiscount'}/>
                <Text fontSize={'3xl'} color={'black'} textAlign={'center'}>
                    Session Discount:
                </Text>
                <Input placeholder="Session Discount" id={'pSessionDiscount'} />
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="blue" mr={3}
                onClick={handleAddPack}>
                Save
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
    </Box>
  );
}

export default AdminPacks
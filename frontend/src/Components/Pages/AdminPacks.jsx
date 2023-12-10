import React from 'react'
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import PackageCard from '../UI/PackageCard';
import '../UI/button.css'
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
    const [count,Setcount]=useState(0);
    const navigate = useNavigate();
    const back =()=>  navigate(-1);

    useEffect(() => {
        const getPacks = async () => {
            const { data } = await axios.get("http://localhost:8000/admin/packages", {
                withCredentials: true,
            });
            setPacks(data);
        };
        setTimeout(() => {
            toast.success("added Succesfully");
         }, 5000);
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
        let test=true;
        if(pName==''){
            test=false;
        }
        if(pPrice<0){
            test=false;
            toast.error("Price can not be negative");
        }
        else
        if(pFamDiscount>100 || pFamDiscount<0){
            test=false;
            toast.error("Family Discount must be between [0,100]");
           
        }
        else
        if(pPharmDiscount>100 || pPharmDiscount<0){
            test=false;
            toast.error("Session Discount must be between [0,100]");
            
        }else
        if(pSessionDiscount>100 || pSessionDiscount<0){
            test=false;
            toast.error("Pharmacy Discount must be between [0,100]");
        }
        
        if(test){
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
        toast.success("Package added");
        Setcount(count+1);
        }
    }


  return (
    <Box >
        {console.log(packs)}    
        <Box bg={"linear-gradient(90deg, #1E9AFE, #60DFCD)"} p={5} boxShadow='2xl'>
            <Text fontSize={'3xl'} color={'white'} >Manage Packages</Text>
            <button className="btn" onClick={back}>back</button>
        </Box>
        <Box m={10} mb={5}  >
        <Flex justifyContent={'end'} alignItems={'center'} p={5} rounded={5}>
            <Button  size="md" bg={'grey'} 
            onClick={handleModal}>
                Add Package
            </Button>
        </Flex>
            {
                packs &&
                <SimpleGrid  spacing={10} templateColumns='repeat(auto-fill, 30%)' as={'Flex'} justifyContent={'center'}>
                {packs.map((pack) => (
                        <PackageCard key={pack.id} pack={pack} count={count}/>
                    ))}
                    </SimpleGrid>
                // </Box>
            }

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
                <Input type='Number' placeholder="Package Price" id={'pPrice'}/>
                <Text fontSize={'3xl'} color={'black'} textAlign={'center'}>
                    Family Discount:
                </Text>
                <Input type='Number' placeholder="Family Discount"  id={'pFamDiscount'}/>
                <Text fontSize={'3xl'} color={'black'} textAlign={'center'}>
                    Pharmacy Discount:
                </Text>
                <Input type='Number' placeholder="Pharmacy Discount" id={'pPharmDiscount'}/>
                <Text fontSize={'3xl'} color={'black'} textAlign={'center'}>
                    Session Discount:
                </Text>
                <Input type='Number' placeholder="Session Discount" id={'pSessionDiscount'} />
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
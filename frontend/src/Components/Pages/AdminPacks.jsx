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
    Flex,
    Card,
    Icon,
    Stack
} from "@chakra-ui/react";
import Navigation from "../UI/Navigation";
import '../UI/Styles/innerPages.css';
import SidebarDR from '../Pages/sideDR';
import { AddIcon } from '@chakra-ui/icons';
import SidebarAdmin from '../Pages/sideAdmin';


function AdminPacks() {
    const [packs, setPacks] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [count,Setcount]=useState(0);
    const navigate = useNavigate();
    const back =()=>  navigate(-1);
    const [up , setUp]= useState(false);
    let message='A';


    useEffect(() => {
        const getPacks = async () => {
            const { data } = await axios.get("http://localhost:8000/admin/packages", {
                withCredentials: true,
            });
            setPacks(data);


        };
        // setTimeout(() => {
        //     toast.success("added Succesfully");
        //  }, 5000);
         getPacks();
    }, [up]);

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
        setUp(!up);
        Setcount(count+1);
        }
        
    }
    const fetchPacks = async () => {
        const { data } = await axios.get("http://localhost:8000/admin/packages", {
            withCredentials: true,
        });
        setPacks(data);
        setUp(!up);
    };
    const handleEdit = async (pack, newData) => {
        // const { Package_Name, Price, Family_Discount,Pharmacy_Discount , Session_Discount } = pack;
        const ID = pack._id;
        const Price = newData.Price;
        const Family_Discount = newData.Family_Discount;
        const Pharmacy_Discount = newData.Pharmacy_Discount;
        const Session_Discount = newData.Session_Discount;
        let test=true;
        
        if(Price<0){
            test=false;
            toast.error("Price can not be negative");
            message="Price can not be negative";
        }
        if(Family_Discount>100 || Family_Discount<0){
            test=false;
            toast.error("Family Discount must be between [0,100]");
            message="Family Discount must be between [0,100]";
        }
        if(Session_Discount>100 || Session_Discount<0){
            test=false;
            toast.error("Session Discount must be between [0,100]");
            message="Session Discount must be between [0,100]";
        }
        if(Pharmacy_Discount>100 || Pharmacy_Discount<0){
            test=false;
            toast.error("Pharmacy Discount must be between [0,100]");
            message="Pharmacy Discount must be between [0,100]";
        }
        if(test){
        try {
            console.log("surprise");
            axios.post("http://localhost:8000/admin/editPack/"+ ID, {
                Price,
                Family_Discount,
                Pharmacy_Discount,
                Session_Discount
            }, {
                withCredentials: true,
            }); 
            console.log("surprise2");
            await fetchPacks();
            toast.success("Edited Succesfully");
            console.log("surprise");
        }
        catch (err) {
            console.log(err);
        }
        // setUp(!up);

    }
}


    const handleDelete = async (pack) => {
        const ID = pack._id;
        try {
            axios.post("http://localhost:8000/admin/deletePack/"+ ID, null, {
                withCredentials: true,
            }); 
            toast.success("Deleted Succesfully");
            await fetchPacks();
        }
        catch (err) {
            console.log(err);
        }
    }


  return (
    <>

    <Navigation
      pagetitle={'Manage Packages'}/>
       <SidebarAdmin
      />

    <Box >
         
        {/* <Box bg={"linear-gradient(90deg, #1E9AFE, #60DFCD)"} p={5} boxShadow='2xl'>
            <Text fontSize={'3xl'} color={'white'} >Manage Packages</Text>
            <button className="btn" onClick={back}>back</button>
        </Box> */}
        <div className="content">
        <Box m={10} mb={5}  >
        <Flex justifyContent={'end'} alignItems={'center'} p={5} rounded={5}>
        </Flex>
            {
                packs &&
                <SimpleGrid  spacing={10} templateColumns='repeat(auto-fill, 30%)' as={'Flex'} justifyContent={'center'} alignItems={'center'}>
                {packs.map((pack) => (
                        <PackageCard key={pack._id} pack={pack} count={count} callBackEdit = {handleEdit} 
                        callBackDelete = {handleDelete}
                        />
                    ))}
                    <Button h={'50%'} variant={'outline'} colorScheme='teal' rounded={10} 
                    onClick={handleModal}
                    >
                        <Stack alignItems={'center'}>
                        <Icon as={AddIcon} fontSize={'6xl'} />
                        <Text fontSize={'3xl'}>  Add Package </Text>
                        </Stack>
                    </Button>

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
        </div>
    </Box>

    <ToastContainer/>
    </>
  );
}

export default AdminPacks
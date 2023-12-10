import React from 'react'
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import PackCardBuy from '../UI/PackCardBuy';
import '../UI/button.css'
import {
    Box,
    Button,
    Text,
    SimpleGrid,
    Flex,
    HStack,
    Heading,
    Card,
    CardHeader,
    CardFooter,
    CardBody,
} from "@chakra-ui/react";
import { toast,ToastContainer } from 'react-toastify';
const Package = () =>{
    const navigate=useNavigate();
    const [packs, setPacks] = useState([]);
    const { username } = useParams();
    const [error,Seterror]=useState(false);
    const [errorMessage,SeterrorMessage]=useState('');
    const back =()=>  navigate(-1);
    useEffect(() => {
        const getPacks = async () => {
            const { data } = await axios.get("http://localhost:8000/patient/packages", {
                withCredentials: true,
            });
            setPacks(data);
        };
        getPacks();
    }, []);
    const handleSubscribeWallet = async(packageID) =>{
        console.log("gagag", username+packageID);
        if(!username || !packageID){
            Seterror(true);
        }
        else{
            const proc= await axios.post("http://localhost:8000/patient/subscribeWallet",
            {username:username,packageID:packageID}
            ,{withCredentials:true});
            const message=proc.data;
            console.log(message);
             if(message==="Subscribed succsefully"){
                 toast.success(message);
                }
                else{
                toast(message);
            }
        }
    
}
const GoToStripe =async(packageID)=>{
    console.log(username);
    console.log(packageID);
    const proc=await axios.post("http://localhost:8000/patient/checkSubscribed",{username:username},{withCredentials:true});
    const message=proc.data;
    console.log(message);
    if(message==="ok"){
    navigate(`/home/payPack/${username}/${packageID}`);
    }
    else{
        toast(message);
    }
}
    return (
    
    <Box >
        
        {console.log(packs)}    
        <Box bg={"linear-gradient(45deg, #1E9AFE, #60DFCD)"} p={5} boxShadow='2xl' mb={10}>
      <Text fontSize={'3xl'} color={'white'}>Available Packages</Text>
      <button className="btn" onClick={back}>back</button>
    </Box>
        <Box m={10} mt={20} bg='#f9f9f9'>
            {
                packs &&
                // <Box display={'flex'} justifyContent={'center'} alignItems={'center'} p={5} rounded={5} flexDirection={'column'}>
                    <SimpleGrid spacing={10} templateColumns='repeat(auto-fill, minmax(300px, 30%))' p={15}>

                    {packs.map((pack) => (
                        <>
                        {
                            console.log("pavkkk", pack)
                        }
                        <PackCardBuy 
                            key={pack._id} 
                            pack={pack}
                            walletCallback ={handleSubscribeWallet}
                            creditCallback= {GoToStripe}
                        />
                        </>
                    ))}
                    </SimpleGrid>
                // </Box>
            }
            <Flex justifyContent={'end'} alignItems={'center'} p={5} rounded={5}>
            </Flex>
        </Box>
        <ToastContainer />
        <div style={{textAlign:'center',justifyContent:"center"}} >
            <label >*You can Only have one Personal Package besides Family Packages(if any)</label>
            <br></br>
            <label>If you want to Change Subscribtion,Kindly cancel current subscription</label>
        </div>
    </Box>
    );
} 
export default Package;
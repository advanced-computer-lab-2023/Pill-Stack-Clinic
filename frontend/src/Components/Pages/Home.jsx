import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Select,
  Stack



 } from "@chakra-ui/react";

export const Home = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [tab, setTab] = useState('newMem')
  const [inputs, setInputs] = useState({})


  useEffect(() => {
    const verifyCookie = async () => {
      if (!cookies.token) {
        navigate("/");
      }
      const { data } = await axios.post(
        "http://localhost:8000",
        {},
        { withCredentials: true }
      );
      const { status, user } = data;
      setUsername(user);
      return status
        ? toast(`Hello ${user}`, {
            position: "top-right",
          })
        : (removeCookie("token"), navigate("/"));
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
  const Logout = () => {
    removeCookie("token");
    navigate("/");
  };

  // router.post('/linkPatientAsFamilyMember/:Username/:emailOrPhone/:relation',userVerification,linkPatientAsFamilyMember)

  /////////
//   const linkPatientAsFamilyMember = async (req, res) => {
//     try {
//        const linkingUserUsername = req.user.Username; // The username of the user initiating the link
//        const linkTargetEmailOrPhone = req.params.emailOrPhone; // Email or phone number of the user to link
//        const relation = req.params.relation; // Relation (wife, husband, child, etc.)
//        console.log('linkTargetEmailOrPhone:', linkTargetEmailOrPhone);
 
 
       
//        let linkedUser;
//        if (linkTargetEmailOrPhone.includes('@')) {
          
//           linkedUser = await userModel.findOne({ Email: linkTargetEmailOrPhone });
//        } else {
//           linkedUser = await userModel.findOne({ MobileNumber: linkTargetEmailOrPhone });
//        }
 
//        if (!linkedUser) {
//           return res.status(404).json({ message: 'User to link not found' });
//        }
 
//        const linkingUser = await userModel.findOne({ Username: linkingUserUsername });
 
//        if (!linkingUser) {
//           return res.status(404).json({ message: 'User not found' });
//        }
 
//        if (!isValidRelation(relation)) {
//           return res.status(400).json({ message: 'Invalid relation' });
//        }
 
//        const linkedFamilyMember = {
//           memberID: linkedUser.id, 
//           username: linkedUser.Username, 
//           relation:relation,
//        };
 
//        if (!linkingUser.LinkedPatientFam) {
//           linkingUser.LinkedPatientFam = [];
//        }
 
//        linkingUser.LinkedPatientFam.push(linkedFamilyMember);
//        if(linkingUser.healthPackage.length!=0){
//           for(let i=0;i<linkingUser.healthPackage.length;i++){
//              if(linkingUser.healthPackage[i].Status='Subscribed'){
//                 const userPack=({
//                    _id:linkingUser.healthPackage[i]._id,
//                    Package_Name:linkingUser.healthPackage[i].Package_Name,
//                    Price:linkingUser.healthPackage[i].Price,
//                    Session_Discount:linkingUser.healthPackage[i].Session_Discount,
//                    Family_Discount:linkingUser.healthPackage[i].Family_Discount,
//                    Pharmacy_Discount:linkingUser.healthPackage[i].Pharmacy_Discount,
//                    Status:'Subscribed',
//                    Renewl_Date:  new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
//                    Owner:false,
//                 });
//                 linkedUser.healthPackage.push(userPack);
//                 await linkedUser.save();
//              }
//           }
//        }
 
//        await linkingUser.save();
//        res.status(200).send("Family Member linked successfully");
 
//     } catch (error) {
//        console.error('Error linking family member:', error);
//        res.status(500).json({ message: 'Internal server error' });
//     }
//  }
  const handleAddFamilyMember = () => {
    if (tab === 'linkMem') {
      console.log('linkMem');
      console.log(inputs);
      try{
        axios.post(`http://localhost:8000/patient/linkPatientAsFamilyMember/${username}/${inputs.emailOrPhone}/${inputs.relation}`, {}, {withCredentials: true})
        .then(
          (res) => {
            console.log(res.data)
            toast.success(res.data.message, {
              position: "top-right",
            })
            onClose();
          }
        )
      }
      catch(err){
        toast("Please Enter All Fields Correctly", {
          position: "top-right",
        })
        
      }
    } 
    else if (tab === 'newMem') {
      console.log('newMem');
      console.log(inputs);
      try{
        axios.post('http://localhost:8000/patient/addFamMem', inputs, {withCredentials: true})
        .then(
          (res) => {
            console.log(res.data)
            toast.success(res.data.message, {
              position: "top-right",
            })
            onClose();
          }
        )
        .catch(
          (err) => {
            console.log(err)
            toast.error("Please Enter All Fields Correctly", {
              position: "bottom-left",
            });
          }
        )
      }
      catch(err){
        toast("Please Enter All Fields Correctly", {
          position: "top-right",
        })
        
      }
    }
  }


  return (
    <>
      <div className="home_page">
        <h4>
          {" "}
          Welcome <span>{username}</span>
        </h4>
        <Button colorScheme="teal" variant="outline"
          onClick={() => {
          setInputs({})
          onOpen();
          setTab('newMem')}}
        > Add Family Members </Button>
        <Link to={`/my-health-records/${username}`}>
          <Button colorScheme="teal" variant="outline">View My Health Records</Button>
        </Link>
        <button onClick={Logout}>LOGOUT</button>
      </div>
      <ToastContainer />


      <Modal isOpen={isOpen} onClose={onClose} size={'xl'} >
        <ModalOverlay 
          bg='blackAlpha.300'
          backdropFilter='blur(10px) hue-rotate(90deg)' 
        />
        <ModalContent>
          <ModalHeader>Add Family Members To my Account </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Tabs variant='soft-rounded' colorScheme='green'>
            <TabList>
              <Tab w={'50%'} onClick={() => {
                setTab('newMem');
                setInputs({});
              }}>Add New Family Member</Tab>
              <Tab w={'50%'} onClick={() => {
                setTab('linkMem');
                setInputs({});
              }}>Link Existing User</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Stack spacing={4} mb={4}>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input placeholder='First name' onChange={(e) => setInputs({...inputs, username: e.target.value})}
                  />
                </FormControl>

                <HStack>
                <FormControl isRequired>
                  <FormLabel>National ID</FormLabel>
                  <Input placeholder='National ID'  onChange={(e) => setInputs({...inputs, nationalID: e.target.value})}
                  />
                </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Age</FormLabel>
                    <Input placeholder='Age'  onChange={(e) => setInputs({...inputs, age: e.target.value})}
                    />
                  </FormControl>
                </HStack>
                <HStack>
                  <FormControl isRequired>
                    <FormLabel>Gender</FormLabel>
                    <Select placeholder='Select Gender'
                    onChange={(e) => setInputs({ ...inputs, gender: e.target.value })} >
                      <option >Male</option>
                      <option>Female</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Relation To You</FormLabel>
                    <Select placeholder='Select Relation'
                    onChange={(e) => setInputs({ ...inputs, relation: e.target.value })}>
                      <option>Wife</option>
                      <option>Husband</option>
                      <option>Child</option>
                    </Select>
                  </FormControl>
                  </HStack>
                </Stack>
              </TabPanel>
              <TabPanel>
                <Stack spacing={4} mb={4}>  
                  <FormControl isRequired>
                    <FormLabel>Email or Phone</FormLabel>
                    <Input placeholder='Contact' onChange={(e) => setInputs({...inputs, emailOrPhone: e.target.value})}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Relation To You</FormLabel>
                    <Select placeholder='Select Relation'
                    onChange={(e) => setInputs({ ...inputs, relation: e.target.value.toLowerCase() })}>
                      <option>Wife</option>
                      <option>Husband</option>
                      <option>Child</option>
                    </Select>
                  </FormControl>
                </Stack>
              </TabPanel>
            </TabPanels>
          </Tabs>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='outline'
              onClick={handleAddFamilyMember}
              colorScheme='green'
            >Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};


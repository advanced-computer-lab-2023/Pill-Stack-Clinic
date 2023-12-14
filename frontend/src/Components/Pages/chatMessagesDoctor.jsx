import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScrollToButtom from 'react-scroll-to-bottom';
import "../../App.css";
import { useParams } from "react-router-dom";
import io from 'socket.io-client';
import ChatContactCard from '../UI/ChatContactCard';
import { Grid,
  GridItem,
  Box,
  ModalCloseButton,
  Stack,
  Divider,
  Flex,
  Text,
  Input,
  Button,
  HStack,
  border,
  } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';


const socket = io.connect("http://localhost:8000");

function ChatMessages({ socket }) {

  // username && handleDoctorClick(username);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [room, setRoom] = useState("");
  const { username, patientUsername} = useParams();
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedSpecific, setSelectedSpecific] = useState(false);

  useEffect(() => {
    const fetchPatientList = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/doctor/getPatientUsername/${username}`);
        setPatientList(response.data.patientsWithCompletedAppointments);
      } catch (error) {
        console.error('Error fetching doctor list:', error);
      }
    };

    fetchPatientList();
  }, [username]);

  const handleDoctorClick = async (patientUsername) => {
    try {
      const response = await axios.post(`http://localhost:8000/doctor/ChatDoctor/${username}/${patientUsername}`);
      const { room: chatRoom } = response.data;
      const { messages: messageList } = response.data;
      socket.emit("join_room", chatRoom);

      setSelectedPatient(patientUsername);
      setRoom(chatRoom);
      setMessageList(messageList);
      console.log(messageList)
      setChatOpen(true);
      setSelectedSpecific(true);
    } catch (error) {
      console.error('Error joining chat room for patient:', error);
    }
  };

  {
    !selectedSpecific && patientUsername && 
    handleDoctorClick(patientUsername);
  }

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        sender: username,
        message: currentMessage,
        timestamp: new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");

      const response = await axios.post(`http://localhost:8000/doctor/sendMessage/${selectedPatient}/${username}`, {
        message: currentMessage
      });
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <>
      <Box height="100vh"  >
        <Box roundedBottom={10} bg={'#4fbbf3'} p={2}  >
          <Text fontSize={'2xl'} mb={0} mx={5}>Live Chat</Text>
        </Box>
        <Grid  templateColumns="repeat(20, 1fr)">
          {/* side */}
          <GridItem colSpan={5} h={'100%'} p={2}  overflowY={'auto'} borderRight={'1px'} >
            <Stack spacing={4} h={"100%"}>
            {patientList.map((patientUsername) => (
              <>
              <ChatContactCard patientUsername={patientUsername} handleDoctorClick={handleDoctorClick} selectedPatient={selectedPatient} />
              </>
            ))}
            </Stack>
          </GridItem>
          {/* <GridItem colSpan={1} > */}
          {/* <Divider orientation="vertical" h={'90%'}/> */}
          {/* </G ridItem> */}
          {/* chat window */}
          <GridItem colSpan={15} style={{ height: '100%' }}  bg={'#e9e9e9'}> 
          {chatOpen && (
            <Box style={{ height: '100%' }} >
              <Box p={2} bg={'white'} boxShadow={'2xl'} >
                <Text fontSize={'2xl'} mb={0} mx={5}>{selectedPatient}</Text>
              </Box>
              <Box  height={'520px'} overflowY="scroll"  p={10}>
                <ScrollToButtom className="message-container">
                  {messageList.map((messageContent) => (
                    <div
                      className="message"
                      id={username === messageContent.sender ? "other" : "you"}
                    >
                      <div>
                          <Text mb={1} fontWeight={'thin'} id="author">{messageContent.sender}</Text>
                        <div className="message-content">
                          <p>{messageContent.message}</p>
                        </div>
                        <div className="message-meta">
                          <p id="time">{messageContent.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollToButtom>
              </Box>
              <HStack  spacing={1} m={2}>
                <Input
                  bg={'white'}
                  variant={'outline'}
                  type="text"
                  value={currentMessage}
                  placeholder="Hey.."
                  onChange={(event) => {
                    setCurrentMessage(event.target.value);
                  }}
                  onKeyPress={(event) => {
                    event.key === "Enter" && sendMessage();
                  }}
                />
                <Button variant={'outline'} colorScheme='blue' onClick={sendMessage}><FontAwesomeIcon color='#4fbbf3' icon={faPaperPlane} /></Button>
              </HStack>
            </Box>
            )}
          </GridItem>

        </Grid>
      </Box>
    </>
    // <div className="chat-container" >
    //   <div className="">
    //     <h2>Patients</h2>
    //     <ul className="">
    //       {patientList.map((patientUsername) => (
    //         // <li
    //         //   key={patientUsername}
    //         //   onClick={() => handleDoctorClick(patientUsername)}
    //         //   className={selectedPatient === patientUsername ? "selected" : ""}
    //         //   style={{ cursor: 'pointer' , backgroundColor: 'red'}}
    //         // >
    //         //   {patientUsername}
    //         // </li>
    //         <ChatContactCard patientUsername={patientUsername}/>
    //       ))}
    //     </ul>
    //   </div>

    //   {chatOpen && (
    //     <div className="chat-window">
    //       <div className="chat-header">
    //         <p>Live Chat</p>
    //       </div>
    //       <div className="chat-body">
    //         <ScrollToButtom className="message-container">
    //           {messageList.map((messageContent) => (
    //             <div
    //               className="message"
    //               id={username === messageContent.sender ? "other" : "you"}
    //             >
    //               <div>
    //                 <div className="message-content">
    //                   <p>{messageContent.message}</p>
    //                 </div>
    //                 <div className="message-meta">
    //                   <p id="author">{messageContent.sender}</p>
    //                   <p id="time">{messageContent.timestamp}</p>
    //                 </div>
    //               </div>
    //             </div>
    //           ))}
    //         </ScrollToButtom>
    //       </div>
    //       <div className="chat-footer">
    //         <input
    //           type="text"
    //           value={currentMessage}
    //           placeholder="Hey.."
    //           onChange={(event) => {
    //             setCurrentMessage(event.target.value);
    //           }}
    //           onKeyPress={(event) => {
    //             event.key === "Enter" && sendMessage();
    //           }}
    //         />
    //         <button onClick={sendMessage}> &#9658;</button>
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
}

export default ChatMessages;

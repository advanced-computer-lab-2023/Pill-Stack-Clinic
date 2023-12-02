import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScrollToButtom from 'react-scroll-to-bottom';
import "../../App.css";
import { useParams } from "react-router-dom";
import io from 'socket.io-client';
const socket = io.connect("http://localhost:8000");


function ChatMessages({ socket}) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [room, setRoom] = useState("");
  const { username } = useParams();
  const [chatOpen, setChatOpen] = useState(false);


  useEffect(() => {
    const fetchDoctorList = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/patient/getDoctorUsername/${username}`);
        console.log(response.data)
        setDoctorList(response.data.doctorsWithCompletedAppointments); // Correct property name
    } catch (error) {
        console.error('Error fetching doctor list:', error);
      }
    };

    fetchDoctorList();
  }, []);

  const handleDoctorClick = async (doctorUsername) => {
    try {
      const response = await axios.post(`http://localhost:8000/patient/Chat/${username}/${doctorUsername}`);
      console.log(response.data)

      const { room: chatRoom } = response.data;
      const { messages: messageList } = response.data;
      socket.emit("join_room",chatRoom);
      setSelectedDoctor(doctorUsername);
      setRoom(chatRoom);
      setMessageList(messageList);
      
      console.log(messageList)
      setChatOpen(true);

      
    } catch (error) {
      console.error('Error joining chat room for patient:', error);
    }
  };


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
      console.log(username);
      console.log(selectedDoctor);
      console.log(currentMessage);
      console.log("mariomaaa")

      const response = await axios.post(`http://localhost:8000/patient/sendMessage/${username}/${selectedDoctor}`, {
        message: currentMessage
      });
      console.log("mariomaaa")
      
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-container">
      <div className="doctor-list-container">
        <h2>Doctors</h2>
        <ul className="doctor-list">
          {doctorList.map((doctorUsername) => (
          <li
            key={doctorUsername}
            onClick={() => handleDoctorClick(doctorUsername)}
            className={selectedDoctor === doctorUsername ? "selected" : ""}
            style={{ cursor: 'pointer' }}
          >
            {doctorUsername}
          </li>
        ))}
        </ul>
      </div>

      {chatOpen&&(<div className="chat-window">
        <div className="chat-header">
          <p>Live Chat</p>
        </div>
        <div className="chat-body">
          <ScrollToButtom className="message-container">
            {messageList.map((messageContent) => {
              return(
                <div
                className="message"
                id={username === messageContent.sender ? "other" : "you"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                  <p id="author">{messageContent.sender}</p>
                  
                    <p id="time">{messageContent.timestamp}</p>
                  </div>
                </div>
              </div>
              );
})}
          </ScrollToButtom>
        </div>
        <div className="chat-footer">
          <input
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
          <button onClick={sendMessage}> &#9658;</button>
        </div>
      </div>
       )} </div>
  );
}

export default ChatMessages;

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
  const [patientList, setPatientList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [room, setRoom] = useState("");
  const { username } = useParams();
  console.log(username)

  useEffect(() => {
    const fetchPatientList = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/doctor/getPatientUsername/${username}`);
        console.log(response.data)
        setPatientList(response.data.patientsWithCompletedAppointments); // Correct property name
    } catch (error) {
        console.error('Error fetching doctor list:', error);
      }
    };

    fetchPatientList();
  }, []);

  const handleDoctorClick = async (patientUsername) => {
    try {
      console.log(username);
      console.log(patientUsername)
      const response = await axios.post(`http://localhost:8000/doctor/ChatDoctor/${username}/${patientUsername}`);
      // console.log(response.data)

      const { room: chatRoom } = response.data;
      const { messages: messageList } = response.data;
      socket.emit("join_room",chatRoom);

      setSelectedPatient(patientUsername);
      setRoom(chatRoom);
      setMessageList(messageList);
      console.log(messageList)

      
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
      console.log(selectedPatient);
      console.log(currentMessage);
      console.log("mariomaaa")

      const response = await axios.post(`http://localhost:8000/doctor/sendMessage/${selectedPatient}/${username}`, {
        message: currentMessage
      });
      console.log("mariomaaa")

    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data)
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-container">
      <div className="doctor-list-container">
        <h2>Patients</h2>
        <ul className="doctor-list">
        {patientList.map((patientUsername) => (
          <li
            key={patientUsername}
            onClick={() => handleDoctorClick(patientUsername)}
            className={selectedPatient === patientUsername ? "selected" : ""}
            style={{ cursor: 'pointer' }}
          >
            {patientUsername}
          </li>
        ))}

        </ul>
      </div>

      <div className="chat-window">
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
    </div>
  );
}

export default ChatMessages;

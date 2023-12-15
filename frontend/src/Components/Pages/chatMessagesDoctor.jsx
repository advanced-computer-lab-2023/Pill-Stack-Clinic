import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScrollToButtom from 'react-scroll-to-bottom';
import "../../App.css";
import { useParams } from "react-router-dom";
import io from 'socket.io-client';
import "../../App.css";

const socket = io.connect("http://localhost:8000");

function ChatMessages({ socket }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [pharmacistList, setPharmacistList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPharmacist, setSelectedPharmacist] = useState(null);
  const [room, setRoom] = useState("");
  const [pharmacistRoom, setPharmacistRoom] = useState('');
  const { username } = useParams();
  const [chatOpen, setChatOpen] = useState(false);
  const [pharmacistChatOpen, setPharmacistChatOpen] = useState(false);
  const [activeChatType, setActiveChatType] = useState(null);

  useEffect(() => {
    const fetchPatientList = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/doctor/getPatientUsername/${username}`);
        setPatientList(response.data.patientsWithCompletedAppointments);
      } catch (error) {
        console.error('Error fetching doctor list:', error);
      }
    };

    const fetchPharmacistList = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/doctor/getpharmacistUsername/${username}`);
        setPharmacistList(response.data.pharmacistUsernames);
      } catch (error) {
        console.error('Error fetching pharmacist list:', error);
      }
    };

    fetchPharmacistList();
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
      setActiveChatType('patient');
    } catch (error) {
      console.error('Error joining chat room for patient:', error);
    }
  };

  const handlePharmacistClick = async (pharmacistUsername) => {
    try {
      const response = await axios.post(`http://localhost:8000/doctor/ChatDoctor2/${username}/${pharmacistUsername}`);
      const { room: chatRoom, messages: messageList } = response.data;
      socket.emit('join_room', chatRoom);

      setSelectedPharmacist(pharmacistUsername);
      setPharmacistRoom(chatRoom);
      setMessageList(messageList);
      setPharmacistChatOpen(true);
      setActiveChatType('pharmacist');
    } catch (error) {
      console.error('Error joining chat room for pharmacist:', error);
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

      const response = await axios.post(`http://localhost:8000/doctor/sendMessage/${selectedPatient}/${username}`, {
        message: currentMessage
      });
    }
  };

  const sendMessage2 = async () => {
    if (currentMessage !== '') {
      const messageData = {
        room: pharmacistRoom,
        sender: username,
        message: currentMessage,
        timestamp: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
      };
      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage('');

      const response = await axios.post(`http://localhost:8000/doctor/sendMessage2/${selectedPharmacist}/${username}`, {
        message: currentMessage,
      });
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
        <h2>Pharmacists</h2>
        <ul className="doctor-list">
          {pharmacistList.map((pharmacistUsername) => (
            <li
              key={pharmacistUsername}
              onClick={() => handlePharmacistClick(pharmacistUsername)}
              className={selectedPharmacist === pharmacistUsername ? 'selected' : ''}
              style={{ cursor: 'pointer' }}
            >
              {pharmacistUsername}
            </li>
          ))}
        </ul>
      </div>


      {activeChatType === 'patient' &&chatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <p>Live Chat</p>
          </div>
          <div className="chat-body">
            <ScrollToButtom className="message-container">
              {messageList.map((messageContent) => (
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
              ))}
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
      )}
      {activeChatType === 'pharmacist' &&pharmacistChatOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <p>Live Chat</p>
          </div>
          <div className="chat-body">
            <ScrollToButtom className="message-container">
              {messageList.map((messageContent, index) => (
                <div
                  key={index}
                  className="message"
                  id={username === messageContent.sender ? 'other' : 'you'}
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
              ))}
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
                event.key === 'Enter' && sendMessage2();
              }}
            />
            <button onClick={sendMessage2}> &#9658;</button>
          </div>
        </div>
      )}

    </div>
  );
}

export default ChatMessages;

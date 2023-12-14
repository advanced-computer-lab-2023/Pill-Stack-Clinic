import axios from 'axios'
import { useState, useEffect, } from 'react'
import { useParams } from 'react-router-dom'
import React from 'react';
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { Box, Button, HStack, Text, border,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Flex,
  Badge,

 } from '@chakra-ui/react';
import './scrollBar.css'
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';



export default function MyPatientFull() {
    const [patient, setPatient] = useState({})
    const { patientUser, docUsername} = useParams();
    const [currDoc, setCurrDoc] = useState({})
    const [hisAppointments, setHisAppointments] = useState([])
    const [famAppointments, setFamAppointments] = useState([])
    const [newRecordInput, setNewRecordInput] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [followUpPatient, setFollowUpPatient] = useState('');
    const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
    const [availability, setAvailability] = useState([]);
    const [isError, setIsError] = useState(false);
    const [appointment, setAppointment] = useState(null);
    const [update, setUpdate] = useState(false)
    const navigate = useNavigate();


    console.log("patientUser", docUsername)
    const Navigate = useNavigate()


    useEffect(() => {
        const token = localStorage.getItem('token')
        const getPatient = async () => {
            axios.get(`http://localhost:8000/doctor/fullPatient/${patientUser}`, { withCredentials: true })
                .then(response => {
                    console.log("full account", response.data)
                    setPatient(response.data)

                })
                .catch(error => {
                    console.error(error);
                });
        }

        getPatient()

    }, [update])

    useEffect(() => {
      //filter appointmnts that doesn't match the doc username

      const getHisAppointments = () => {
        setHisAppointments([])
        {
        patient.BookedAppointments &&
        patient.BookedAppointments.map((app, index) => {
          
          if (app.DoctorUsername === docUsername) {
            setHisAppointments(prev => [...prev, app])
          }
        }
        )
      }
      }
      getHisAppointments()
      console.log("hisAppointments", hisAppointments)
    }
    , [patient])

    useEffect(() => {
      //filter appointmnts that doesn't match the doc username

      const getFamAppointments = () => {
        setFamAppointments([])
        {
        patient.BookedAppointments &&
        patient.BookedAppointments.map((app, index) => {
          
          if (app.DoctorUsername !== docUsername) {
            setFamAppointments(prev => [...prev, app])
          }
        }
        )
      }
      }
      getFamAppointments()
      console.log("famAppointments", famAppointments)
    }
    , [patient])


    const openPatientDetails = async (patient) => {
      const response = await axios.post('http://localhost:8000/doctor/myPatients/viewPatient',{username:patient.PatientUsername}, {
        withCredentials: true, // Include credentials if necessary
      });
  
      setSelectedPatient(response.data);
    };

    const addHealthRecord = async (patient) => {
      try {
        const response = await axios.post('http://localhost:8000/doctor/addHealthRecord', {
          PatientUsername: patient.Username,
          PatientName: patient.Name,
          RecordDetails: newRecordInput,
        },
          { withCredentials: true });
  
        if (response.status === 201) {
          setPatient(prev => ({
            ...prev,
            HealthRecords: [...prev.HealthRecords, {
              RecordDetails: newRecordInput,
              RecordDate: new Date(),
            }],
          }));
          setNewRecordInput('');

          // Close the popover
          setSelectedPatient(null);

          alert('Health record added successfully!');
        } else {
          alert('Failed to add health record. Please try again.');
        }
      } catch (error) {
        console.error('Error adding health record:', error);
        alert('Failed to add health record. Please try again.');
      }
    };

    const openModal = async (app) => {
      setIsModalOpen(true);
      setConfirmationMessage('');
      setErrorMessage('');
      setFollowUpPatient(app);
  
      try {
        setIsLoadingAvailability(true);
        const response = await axios.get(
          'http://localhost:8000/doctor/availability',
          { withCredentials: true }
        );
        setAvailability(response.data);
      } catch (error) {
        console.error('Error fetching family members:', error);
      } finally {
        setIsLoadingAvailability(false);
      }
    };

    const scheduleFollowUp = async () => {
      if (appointment !== null) {
        const response = await axios.post('http://localhost:8000/doctor/scheduleFollowUp', { oldAppointment:patient, newAppointment: appointment }, {
          withCredentials: true,
        });
  
        if (response.data === 'follow up booked successfully') {
          setConfirmationMessage(response.data);
          setIsModalOpen(false);
          setFollowUpPatient('');
          setUpdate(!update);
        } else {
          setIsError(true);
          setErrorMessage(response.data);
        }
      } else {
        setIsError(true);
        setErrorMessage('Please select an appointment');
      }
    };
  
  

  return (
    <section style={{ backgroundColor: '#eee' }}>
      <MDBContainer className="py-5">

        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center"
                style={{display:'flex', justifyContent: 'center', alignItems: 'center', flexDirection:'column' }}
              >
                <MDBCardImage
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: '150px' }}
                  fluid />
                <p className="text-muted m-3">{patient.Name}</p>
                {/* <p className="text-muted mb-4">Bay Area, San Francisco, CA</p> */}
                <div className="d-flex justify-content-center mb-2">
                  <HStack>
                  <Button colorScheme='teal'
                  onClick={() => {
                    Navigate(`/doctor/prescriptions/${patientUser}`)
                  }
                  }
                   > Manage Prescriptions</Button>
                  <Button colorScheme='teal' variant={'outline'}  
                  
                  // go to chatwithPatient/doctorTesting with direct href
                  onClick={() => {
                    Navigate(`/chatwithpatient/${docUsername}/${patientUser}`)
                  }
                  }
                  > Chat</Button>
                  {/* <Box as='link' href='/doctor/chatwithPatient/'>
                    haa
                  </Box> */}
                  </HStack>
                </div>
              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4 mb-lg-0" >
              <MDBCardBody className="p-0 " >
                <MDBListGroup flush className="rounded-3 p-3" 
>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3 teal-text" >
                    <Text fontSize={'3xl'}>Health Records</Text>
                    <Popover>
                    <PopoverTrigger>
                      <Button
                        colorScheme="teal"
                        onClick={() => openPatientDetails(patient)}
                      >
                        Add Health Record
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Health Record</PopoverHeader>
                      <PopoverBody>
                        <Input
                          type="text"
                          placeholder='Input Record Here'
                          value={newRecordInput}
                          onChange={(e) => setNewRecordInput(e.target.value)} />
                        <Button
                          marginTop="10px"
                          size="sm"
                          alignSelf="end"
                          onClick={() => addHealthRecord(patient)}
                        >
                          Save
                        </Button>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                  </MDBListGroupItem>

                  <Box h={'425px'} overflowY={'scroll'} rounded={4}>
                  {patient.HealthRecords && patient.HealthRecords[0] ?
                    patient.HealthRecords.map((record, index) => {
                      return (
                        <MDBListGroupItem className="d-flex justify-content-between align-items-center p-2" key={index}>
                          <MDBCardText>{record.RecordDetails}</MDBCardText>
                          <MDBCardText>{new Date(record.RecordDate).toLocaleDateString()}</MDBCardText>
                        </MDBListGroupItem>
                      )
                    })
                    :
                    <Text m={5} textAlign={'center'}>No Available Records</Text>
                    
                  }
                  </Box>

                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Full Name</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{patient.Name}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Gender</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{patient.Gender}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Email</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{patient.Email}</MDBCardText>
                  </MDBCol>
                </MDBRow>
                
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Mobile Number</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">{patient.MobileNumber}</MDBCardText>
                  </MDBCol>
                </MDBRow>

              </MDBCardBody>
            </MDBCard>

            <MDBRow>
              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody  >
                    <MDBCardText className="mb-4">
                      <span className="text-primary font-italic me-1 teal-text" style={{fontSize:"1.3em"}} >  
                        {patient.Name}'s Appointments
                      </span> with me
                    </MDBCardText>
                    <Box h={'560px'} overflowY={'scroll'} rounded={4} className=''>
                    {
                      hisAppointments  && hisAppointments.length > 0 ?
                      hisAppointments.map((app, index) => {
                        return (
                          <>
                          {/*thick teal line */}
                          <hr class="hr hr-blurry " style={{ borderColor: 'teal'}}/>
                          {
                            app.Status === 'completed' ?
                            <Badge colorScheme='green'>Completed</Badge>:
                            app.Status === 'cancelled' ?
                            <Badge colorScheme='red'>Cancelled</Badge>:
                            app.Status === 'upcoming' ?
                            <Badge colorScheme='teal'>Upcoming</Badge>:
                            app.Status === 'rescheduled' ?
                            <Badge colorScheme='yellow'>Rescheduled</Badge>:
                            <Badge >Unknown</Badge>
                            
                            
                          }
                          {/* <Badge colorScheme='green'>Upcoming</Badge> */}
                          <Flex justifyContent={'space-between'} alignItems={'center'}>
                            <Box>
                            <Text as='abbr' fontSize={'lg'} key={index}>{new Date(app.StartDate).toLocaleDateString()} </Text>
                            <MDBCardText>{new Date(app.StartDate).toLocaleTimeString()} to {new Date(app.EndDate).toLocaleTimeString()}</MDBCardText>
                            </Box>
                          <Button
                            size="sm"
                            m={2}
                            colorScheme="teal"
                            title='Follow Up'
                            onClick={() => openModal(app)}
                          >
                            <FontAwesomeIcon icon={faCalendarDays} />
                          </Button>
                          </Flex>
                          </>
                        )
                      })
                      :
                      <Text m={5} textAlign={'center'}>No Available Appointments</Text>
                    }
                    </Box>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>

              <MDBCol md="6">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                    <MDBCardText className="mb-4">
                      <span className="text-primary font-italic me-1 teal-text" style={{fontSize:"1.3em"}}>
                        Family Members'
                      </span>
                      Appointments
                    </MDBCardText>

                    <Box h={'560px'} overflowY={'scroll'} rounded={4}>
                    {
                      famAppointments && famAppointments.length > 0 ?
                      famAppointments.map((app, index) => {
                        return (
                          <>
                          <hr className="hr hr-blurry" style={{ borderColor: 'teal'}}/>
                          <Flex justifyContent={'space-between'} alignItems={'center'}>
                            <Box>
                              <Text as='abbr' fontSize={'lg'} key={index}>{new Date(app.StartDate).toLocaleDateString()} </Text>
                              <MDBCardText>{new Date(app.StartDate).toLocaleTimeString()} to {new Date(app.EndDate).toLocaleTimeString()}</MDBCardText>
                            </Box>
                          <Button
                            size="sm"
                            m={2}
                            colorScheme="teal"
                            title='Follow Up'
                            onClick={() => openModal(patient)}
                          >
                            <FontAwesomeIcon icon={faCalendarDays} />
                          </Button>
                          </Flex>
                          </>
                        )
                      })
                      :
                      <Text m={5} textAlign={'center'}>No Available Appointments</Text>
                    }
                    </Box>  
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false);
        setFollowUpPatient('');
        setIsError(false);
        setErrorMessage('');
      } }>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Appointment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isError && (<Alert status='error'>
              <AlertIcon />
              <AlertTitle>Missing input</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>)}
            <FormControl>
              <FormLabel>Select appointment</FormLabel>
              <Select
                value={appointment}
                onChange={(e) => {
                  setAppointment(e.target.value);
                } }
              >
                <option value="">Select</option>
                {isLoadingAvailability ? (
                  <option>Loading Appointments..</option>
                ) : (
                  availability.map((appointment) => (
                    <option key={appointment._id} value={appointment._id}>
                      {new Date(appointment.StartDate).toLocaleString('en-US', { timeZone: 'UTC' })} {new Date(appointment.EndDate).toLocaleString('en-US', { timeZone: 'UTC' })}
                    </option>
                  ))
                )}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={() => scheduleFollowUp()}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  );
}
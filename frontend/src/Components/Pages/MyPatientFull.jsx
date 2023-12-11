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
  MDBListGroupItem
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { Box, Button, HStack, Text, border } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import './scrollBar.css'



export default function MyPatientFull() {
    const [patient, setPatient] = useState({})
    const { patientUser, docUsername} = useParams();
    const [currDoc, setCurrDoc] = useState({})
    const [hisAppointments, setHisAppointments] = useState([])
    const [famAppointments, setFamAppointments] = useState([])

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

    }, [])

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
                <p className="text-muted mb-1">Patient</p>
                {/* <p className="text-muted mb-4">Bay Area, San Francisco, CA</p> */}
                <div className="d-flex justify-content-center mb-2">
                  <HStack>
                  <Button colorScheme='teal'
                  onClick={() => {
                    Navigate(`/doctor/prescriptions/${patientUser}`)
                  }
                  }
                   > Manage Prescriptions</Button>
                  <Button colorScheme='teal' variant={'outline'} > Chat</Button>
                  </HStack>
                </div>
              </MDBCardBody>
            </MDBCard>

            <MDBCard className="mb-4 mb-lg-0" >
              <MDBCardBody className="p-0 " >
                <MDBListGroup flush className="rounded-3 p-3" 
>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <Text fontSize={'3xl'}>Health Records</Text>
                  </MDBListGroupItem>
                  <Box h={'450px'} overflowY={'scroll'} rounded={4}>
                  {patient.HealthRecords &&
                    patient.HealthRecords.map((record, index) => {
                      return (
                        <MDBListGroupItem className="d-flex justify-content-between align-items-center p-2" key={index}>
                          <MDBCardText>{record.RecordDetails}</MDBCardText>
                          <MDBCardText>{new Date(record.RecordDate).toLocaleDateString()}</MDBCardText>
                        </MDBListGroupItem>
                      )
                    })
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
                    <Box h={'515px'} overflowY={'scroll'} rounded={4} className=''>
                    {
                      hisAppointments &&
                      hisAppointments.map((app, index) => {
                        return (
                          <>
                          {/*thick teal line */}
                          <hr class="hr hr-blurry " style={{ borderColor: 'teal'}}/>

                          <Text as='abbr' fontSize={'lg'} key={index}>{new Date(app.StartDate).toLocaleDateString()} </Text>
                          <MDBCardText>{new Date(app.StartDate).toLocaleTimeString()} to {new Date(app.EndDate).toLocaleTimeString()}</MDBCardText>
                          </>
                        )
                      })
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

                    <Box h={'515px'} overflowY={'scroll'} rounded={4}>
                    {
                      famAppointments &&
                      famAppointments.map((app, index) => {
                        return (
                          <>
                          <hr class="hr hr-blurry " style={{ borderColor: 'teal'}}/>

                          <Text as='abbr' fontSize={'lg'} key={index}>{new Date(app.StartDate).toLocaleDateString()} </Text>
                          <MDBCardText>{new Date(app.StartDate).toLocaleTimeString()} to {new Date(app.EndDate).toLocaleTimeString()}</MDBCardText>
                          </>
                        )
                      })
                    }
                    </Box>  
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
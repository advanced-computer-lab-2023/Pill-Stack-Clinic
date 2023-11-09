import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useHistory } from 'react-router-dom'; 

const DoctorRegistrationForm = () => {
  const [fileData, setFileData] = useState({
    idDocument: null,
    medicalLicenseDocument: null,
    medicalDegreeDocument: null,
  });
 

  const [formData, setFormData] = useState({
    Username: '',
    Name: '',
    Email: '',
    Password: '',
    DateOfBirth: '',
    HourlyRate: '',
    Affiliation: '',
    EducationalBackground: '',
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const navigate = useNavigate(); // hook to navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithFiles = new FormData(); // Use FormData to handle file uploads
    // Append text fields to formDataWithFiles
    for (const key in formData) {
      formDataWithFiles.append(key, formData[key]);
    }
    // Append files to formDataWithFiles
    if (formData.idDocument) formDataWithFiles.append('idDocument', formData.idDocument);
    if (formData.medicalLicenseDocument) formDataWithFiles.append('medicalLicenseDocument', formData.medicalLicenseDocument);
    if (formData.medicalDegreeDocument) formDataWithFiles.append('medicalDegreeDocument', formData.medicalDegreeDocument);

    try {
      await axios.post('/api/doctors/register', formDataWithFiles, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // After successful registration, redirect to login page
      navigate('/Login');
    } catch (error) {
      console.error('Registration error:', error.response);
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.files[0] // Update the state with the selected file
    });
  };


  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
  {/* Text input for Username */}
  <input
    type="text"
    name="Username"
    placeholder="Username"
    value={formData.Username}
    onChange={handleInputChange}
    required
  />

  {/* Text input for Name */}
  <input
    type="text"
    name="Name"
    placeholder="Full Name"
    value={formData.Name}
    onChange={handleInputChange}
    required
  />

  {/* Email input */}
  <input
    type="email"
    name="Email"
    placeholder="Email Address"
    value={formData.Email}
    onChange={handleInputChange}
    required
  />

  {/* Password input */}
  <input
    type="password"
    name="Password"
    placeholder="Password"
    value={formData.Password}
    onChange={handleInputChange}
    required
  />

  {/* Date input for Date of Birth */}
  <input
    type="date"
    name="DateOfBirth"
    placeholder="Date of Birth"
    value={formData.DateOfBirth}
    onChange={handleInputChange}
    required
  />

  {/* Text input for Hourly Rate */}
  <input
    type="number"
    name="HourlyRate"
    placeholder="Hourly Rate"
    value={formData.HourlyRate}
    onChange={handleInputChange}
    required
  />

  {/* Text input for Affiliation */}
  <input
    type="text"
    name="Affiliation"
    placeholder="Affiliation"
    value={formData.Affiliation}
    onChange={handleInputChange}
    required
  />

  {/* Text input for Educational Background */}
  <textarea
    name="EducationalBackground"
    placeholder="Educational Background"
    value={formData.EducationalBackground}
    onChange={handleInputChange}
    required
  />

  {/* File input for ID Document */}
  <input
    type="file"
    name="idDocument"
    onChange={handleFileChange}
    required
  />
  <label htmlFor="idDocument">Upload ID Document</label>

  {/* File input for Medical License Document */}
  <input
    type="file"
    name="medicalLicenseDocument"
    onChange={handleFileChange}
    required
  />
  <label htmlFor="medicalLicenseDocument">Upload Medical License</label>

  {/* File input for Medical Degree Document */}
  <input
    type="file"
    name="medicalDegreeDocument"
    onChange={handleFileChange}
    required
  />
  <label htmlFor="medicalDegreeDocument">Upload Medical Degree</label>

  {/* Submit button */}
  <button type="submit">Register</button>
</form>
  );
};

export default DoctorRegistrationForm;
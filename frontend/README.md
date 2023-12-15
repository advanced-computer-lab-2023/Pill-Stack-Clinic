![Alt text](image.png)


PillStack is a virtual clinic platform coupled with an online pharmacy. This MERN stack project aims to eradicate the challenges associated with physical hospital visits by providing a complete digital healthcare solution.

# Motivation

This project serves as a learning opportunity to collaborate effectively within a team setting, specifically focusing on the development of a MERN Stack project. The primary objectives include gaining practical experience in meeting both Functional and Non-Functional Requirements, navigating diverse APIs, and cultivating a consistent coding style.
# Build Status
- The system currently does not allow the user to top up their wallet balance. However in the future we intend to add this feature.
- The system does not verify the user's email upon registeration.
- For reporting bugs or offering contributions or enhancements please check our Contributions section below.  

# Screenshots
- Login Page
![Alt text](image-13.png)
- Patient home page
- View all doctors on the platform
- Book an appointment
- chat with a doctor 
- Add a family member
- View linked family members
- View my appointments
- View my family's appointments
- View my health packages
- Subscribe to a health package
- Doctor's home page
- View doctor's patients
- chat with a patient
- Add an appoinmment to my bookings
- Accept/Reject a follow up requested by a patient
- Schedule a follow up for a patient
- Admin home page
- Add a new admin to the system
- Delete a user from the system
- View doctor's applications



 

# Code Style
### Code Formatting
- Use 4-space indentation.
- Line length should not exceed 80 characters.
- End statements with semicolons.

### Naming Conventions
- Variables: camelCase
- Functions: snake_case

### Code Organization
- Group related files into directories (e.g., /src, /tests).

### Comments and Documentation
- Use comments to explain complex logic or non-obvious code parts.

### Version Control Practices
- Use concise and descriptive commit messages following the conventional commits specification.

# Tech/Frameworks used 
### This project was fully implemented using MERN Stack.
##### MERN Stack is a popular and robust combination of technologies used for building web applications. The acronym MERN stands for MongoDB, Express.js, React, and Node.js, which are the four core technologies that make up this stack. 
#### Backend
- Node.js: A JavaScript runtime for server-side development.
- Express.js: A web application framework for Node.js.
- MongoDB: A NoSQL database for storing application data.
- Socket.IO: A JavaScript library for enabling real-time, bidirectional communication between web clients and servers.
#### Frontend
- React.js: A JavaScript library for building user interfaces.
- Axios: A promise-based HTTP client for making HTTP requests.
#### Development & Testing
- Postman : For testing API endpoints during development.


# Features
- Online payment is supported
- Live chat between patients and doctors
- Video chat between patients and doctors
- Patients can view any doctor's full profile.
- Appointments Cancellation and refund is possible.
- Patients are sent emails with details and upadtes of their appointments.
- Patients can link immediate family accounts to their own account.
- Patients can book appointmnets for their linked family members.


### The system serves different roles of users:

1. Guest:

 As a Guest, I could:  

- Register as a patient.  
- Submit a request to register as a doctor .
- Upload required documents upon registration as a doctor.

2. Patient:

As a Patient, I could: 

- Upload/remove documents (PDF, JPEG, JPG, PNG) for my medical history.
- Add family members with name and national ID.
- Link another patient's account as a family member.
- Choose to pay for my appointment using my wallet or credit card.
- View all new and old prescriptions .
- View health package options and details.
- Subscribe to a health package for myself and family members.
- Choose to pay for the chosen health package using wallet or credit card.
- Cancel a subscription of a health package.
- View a list of all my upcoming/past appointments and my family memebrs' appointments.
- Reschedule an appointment.
- Cancel an appointment.
- Receive notifications about new and cancelled appointments.
- View, select, and pay for prescription items.
- Download selected prescriptions (PDF).
- Start/end a video call with the doctor.
- Chat with a doctor.
- Request a follow-up to a previous appointment.
- Reset a forgotten password through OTP sent to email.


3. Doctor
As a Doctor, I could: 

- Edit/update my email, hourly rate, or affiliation.
- Add available time slots for appointments.
- View information and health records of patients registered with me.
- Schedule a follo up for my patients.
- Accept or revoke a follow-up session request from a patient.
- Add/delete/update medicine to/from the patient's prescription.
- Add new health records for a patient.
- Chat with a patient of mine.
- Reset a forgotten password through OTP sent to email.

4. Admin:
As a Doctor, I could:
- Add another administrator with specific credentials.
- Remove a doctor/patient/admin from the system.
- View and accept or reject a doctor's request to join the platform.
- Add/update/delete health packages.
- Reset a forgotten password through OTP sent to email.





 



# Code Example
![Alt text](image-1.png)
![Alt text](image-2.png)
![Alt text](image-3.png)

# Installation
1.Clone Repository to your device `git clone https://github.com/advanced-computer-lab-2023/Pill-Stack-Clinic.git`  
  

  
2.Open 2 terminals  
  
3.In the first terminal run the following commands:  
 `cd backend`  
 `npm install`  
 `cd src`  
 `nodemon app.js`  
    
4.In the second terminal run the following commands:  
`cd frontend`  
`npm install`  
`cd src`  
`npm start`
    
Your default browser should automatically open on the web application's address.


# API Refrences 

# Postman Testing
Patient's Wallet  
![Alt text](image-6.png) 
View all doctors on the platform  
![Alt text](image-7.png) 
Get session price of a specific doctor  
![Alt text](image-11.png)  
View family members 
![Alt text](image-8.png)  
Doctor's patients  
![Alt text](image-9.png) 
Doctor adding availability to the system  
![Alt text](image-10.png) 
Viwing all doctor's applications  
![Alt text](image-12.png)  
# How to Use
1. Open `http://localhost:3000/ ` to view the login page in your browser.  
![Alt text](image-13.png) 
2. Register as a patient in order to be able to login into the system.  
3. Enter your registered credientials, and a redirection to the home page will occur.  
4. 


# Contribute 
Thank you for considering contributing to our project! We welcome contributions from everyone.
## Contribution Guidelines  
### Issues
- Reporting Bugs: If you find a bug or issue, please send us an email on `pillstackacl@gmail.com` mentioning the issue with a clear description.  
- Fixing Bugs: Fork the repository, create a new branch, and submit a pull request referencing the issue.
### Feature Requests
- Requesting Features: Propose new features by emailing us on `pillstackacl@gmail.com` to discuss changes.
- Implementing Features: Coordinate with developers before implementing new features.  

#### We appreciate your interest and support in making this project better!  
#### Feel free to modify this template to suit your project's specific guidelines and needs. 
# Credits
- [Node.js](https://youtube.com/playlist?list=PLZlA0Gpn_vH_uZs4vJMIhcinABSTUH2bY&si=xl9Ckfm1dduvf3mB) 
- [Express](https://www.youtube.com/watch?v=fgTGADljAeg)
- [React](https://youtube.com/playlist?list=PLZlA0Gpn_vH_NT5zPVp18nGe_W9LqBDQK&si=cxXCnx404gvfF9kF)
- [React Hooks](https://youtube.com/playlist?list=PLZlA0Gpn_vH8EtggFGERCwMY5u5hOjf-h&si=VL42ZHFVRkgV10hr)
- [JWT Authentication](https://www.freecodecamp.org/news/how-to-secure-your-mern-stack-application/)
- [Stripe](https://youtu.be/e-whXipfRvg?si=-zWhuRFVhuLKciS9)  
# License
- The Stripe is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.txt)





 

 










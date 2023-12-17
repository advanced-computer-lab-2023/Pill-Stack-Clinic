import * as React from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useParams,useNavigate } from 'react-router-dom';




export default function VideoApp() {
    const { doctorUsername,patientUsername} = useParams();
    const navigate = useNavigate();
      const roomID = doctorUsername;
      let myMeeting = async (element) => {
     // generate Kit Token
      const appID =13075550 ;
      const serverSecret = "22e09e5b32cc1e3fe965031770fcf532";
      const kitToken =  ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID,  Date.now().toString(),  patientUsername);


     // Create instance object from Kit Token.
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      // start the call
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: 'Personal link',
            url:
             window.location.protocol + '//' + 
             window.location.host + window.location.pathname +
              '?roomID=' +
              roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        },
      });


  };
  const handleBack = () => {
    // You can perform any cleanup or additional logic here before navigating back
    navigate(-1); // Equivalent to navigating back one step
  };
  

  return (
    <div>
      <button onClick={handleBack} class="btn btn-primary">
        Back
      </button>
      <div ref={myMeeting} style={{ width: '100vw', height: '100vh' }}></div>
    </div>
      );
}
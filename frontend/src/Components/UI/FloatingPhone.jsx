import { motion } from "framer-motion";
import { FiBatteryCharging, FiWifi } from "react-icons/fi";
import '../../index.css';
import logo from '../UI/Images/pillstackLogo.png';
import { Flex, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Example = () => {
  return (
    <section style={{ display: "grid", placeContent: "center", padding: "48px" }}>
      <FloatingPhone />
    </section>
  );
};

const FloatingPhone = () => {
  return (
    <div
      style={{
        transformStyle: "preserve-3d",
        transform: "rotateY(-30deg) rotateX(15deg)",
        borderRadius: "24px",
        background: "#FFFFFF66",
      }}
    //   className="gradBG"
    >
      <motion.div
        initial={{
          transform: "translateZ(8px) translateY(-2px)",
        }}
        animate={{
          transform: "translateZ(32px) translateY(-8px)",
        }}
        transition={{
          repeat: Infinity,
          repeatType: "mirror",
          duration: 2,
          ease: "easeInOut",
        }}
        style={{
          position: "relative",
          height: "24rem",
          width: "14rem",
          borderRadius: "24px",
          borderWidth: "2px",
          borderBottomWidth: "4px",
          borderRightWidth: "4px",
          borderLeftWidth: "4px",
          borderTopWidth: "4px",
          borderColor: "#FFFFFF",
          background: "#1F2937",
          padding: "4px",
          paddingLeft: "12px",
          paddingTop: "12px",
          overflow: "visible", // To allow content to overflow parent
        }}
      >
        <HeaderBar />
        
        <Screen />
      </motion.div>
    </div>
  );
};

const HeaderBar = () => {
  return (
    <>
      <div style={{ position: "absolute", left: "50%", top: "13px", zIndex: "1", height: "0.5rem", width: "4rem", transform: "translateX(-50%)", borderRadius: "0.25rem", background: "#1F2937" }}></div>
      <div style={{ position: "absolute", right: "20px", top: "12px", zIndex: "1", display: "flex", gap: "8px" }}>
        <FiWifi style={{ color: "#CBD5E1" }} />
        <FiBatteryCharging style={{ color: "#CBD5E1" }} />

      </div>
    </>
  );
};

const Screen = () => {
    const navigate = useNavigate();

  return (
    <>

    <div style={{ position: "relative", zIndex: "0", display: "grid", placeContent: "center", overflow: "hidden", borderRadius: "20px", background: "#FFFFFF", height: "100%", width: "100%" , transform: "translate(-2.5%, -1%)"}}>
    <Flex justifyContent={'center'} alignItems={'center'} p={5} >
    <Image w={'90%'} src={logo} alt="PillStack Logo" style={{transform: "translatey(-400%)"}} />
    </Flex>
      <svg
        width="50"
        height="39"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z" stopColor="#000000"></path>
        <path d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z" stopColor="#000000"></path>
      </svg>


      <motion.button
        onClick={   
            () => {
                navigate('/login')
            }}
        whileHover={{ scale: 1.1 }} // Adjust the scale factor for the bounce effect
        style={{ position: "absolute", bottom: "1rem", left: "1rem", right: "1rem", zIndex: "10", borderRadius: "0.5rem", border: "1px solid #FFFFFF", background: "#FFFFFF", padding: "0.5rem", fontSize: "0.875rem", fontWeight: "500", backdropFilter: "blur(20px)" }}
      >
        Join Now
      </motion.button>

      <div style={{ position: "absolute", bottom: "-12rem", left: "50%", height: "24rem", width: "24rem", transform: "translateX(-50%)", borderRadius: "50%", background: "#229389" }} />
    </div>
    </>
  );
};

export default Example;

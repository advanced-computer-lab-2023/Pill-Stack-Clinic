import React from "react";
import { motion } from "framer-motion";
import {Flex,
  Grid,
  GridItem,
  Box
} from '@chakra-ui/react';


export const BouncyCardsFeatures = () => {
  return (
    <Flex justifyContent={'center'} alignItems="center" w={'100%'} mb={10}>
    <Box
      style={{padding: "4px", color: "#374151" }}
      w={'80%'}
    >
      <div style={{ marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px"}}>
        <h2 style={{ maxWidth: "50rem", fontSize: "2.5rem", fontWeight: "bold" }}>
        Discover the Power of Our Virtual Clinic: Cutting-Edge Features for 
          <span style={{ color: "#9CA3AF" }}> Seamless Healthcare</span>
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ whiteSpace: "nowrap", borderRadius: "0.375rem", backgroundColor: "#111827", padding: "0.5rem 1rem", fontWeight: "medium", color: "white", boxShadow: "0 0 0 0.125rem rgba(38, 43, 54, 0.05), 0 0.0625rem 0.125rem 0 rgba(38, 43, 54, 0.1)", transition: "background-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out", ":hover": { backgroundColor: "#1E293B" } }}
        >
          Learn more
        </motion.button>

      </div>
      <Grid templateColumns='repeat(3, 5fr)'gap={5} >
        {/* BounceCard 1 */}
        <GridItem colSpan={2} >
        <motion.div 
          whileHover={{ scale: 0.95, rotate: "-1deg" }}
          style={{ cursor: "pointer", overflow: "hidden", minHeight: "12rem", borderRadius: "0.75rem", backgroundColor: "#F3F4F6", padding: "2rem" }}
        >
          <h3 style={{ margin: "0 auto", textAlign: "center", fontSize: "1.875rem", fontWeight: "600" }}>Top notch doctors</h3>
          <div style={{position: "absolute", bottom: "0", left: "1rem", right: "1rem", top: "5rem", transform: "translateY(2rem)", borderRadius: "0.5rem 0.5rem 0 0", backgroundColor: '#2caed8',transition: "transform 250ms", ":hover": { transform: "translateY(1rem) rotate(2deg)" } }}>
            <Flex justifyContent={'center'} alignItems={'center'} p={5} >
            <span style={{ display: "block", textAlign: "center", fontWeight: "600", color: "#FFF" }}> Make appointments with doctors from all over the world with just one click</span>
            </Flex>
          </div>
        </motion.div>
        </GridItem>

        {/* BounceCard 2 */}
        <GridItem  colSpan={1} >
        <motion.div
          whileHover={{ scale: 0.95, rotate: "-1deg" }}
          style={{ cursor: "pointer", overflow: "hidden", minHeight: "12.5rem", borderRadius: "0.75rem", backgroundColor: "#F3F4F6", padding: "2rem"}}
        >
          <h3 style={{ margin: "0 auto", textAlign: "center", fontSize: "1.875rem", fontWeight: "600" }}>Round-the-Clock Service</h3>
          <div style={{ position: "absolute", bottom: "0", left: "1rem", right: "1rem", top: "5rem", transform: "translateY(2rem)",
          borderRadius: "0.5rem 0.5rem 0 0",
          backgroundColor : '#319795',
          padding: "1rem",
          transition: "transform 250ms",
          ":hover": { transform: "translateY(1rem) rotate(2deg)" }
        }}>
          <span style={{ display: "block", textAlign: "center", fontWeight: "600", color: "#FFF" }}>Access medications and support 24/7, ensuring you get the care you need, when you need it.</span>
        </div>
      </motion.div>
      </GridItem>



        {/* BounceCard 3 */}
        <GridItem  colSpan={1} >
        <motion.div
          whileHover={{ scale: 0.95, rotate: "-1deg" }}
          style={{ cursor: "pointer", overflow: "hidden", minHeight: "12.5rem", borderRadius: "0.75rem", backgroundColor: "#F3F4F6", padding: "2rem" }}
        >
          <h3 style={{ margin: "0 auto", textAlign: "center", fontSize: "1.875rem", fontWeight: "600" }}>Effortless Online Pharmacy</h3>
          <div style={{ position: "absolute", bottom: "0", left: "1rem", right: "1rem", top: "5rem", transform: "translateY(2rem)", borderRadius: "0.5rem 0.5rem 0 0", backgroundColor: '#319795' , padding: "1rem", transition: "transform 250ms", ":hover": { transform: "translateY(1rem) rotate(2deg)" } }}>
            <span style={{ display: "block", textAlign: "center", fontWeight: "600", color: "#FFF" }}>Access a wide range of medications online, delivered to your doorstep with ease. </span>
          </div>
        </motion.div>
        </GridItem>



        {/* BounceCard 4 */}
        <GridItem colSpan={2} >
        <motion.div
          whileHover={{ scale: 0.95, rotate: "-1deg" }}
          style={{ cursor: "pointer", overflow: "hidden", minHeight: "12rem", borderRadius: "0.75rem", backgroundColor: "#F3F4F6", padding: "2rem" }}
        >
          <h3 style={{ margin: "0 auto", textAlign: "center", fontSize: "1.875rem", fontWeight: "600" }}>Personalized Health Insights</h3>
          <div style={{ position: "absolute", bottom: "0", left: "1rem", right: "1rem", top: "5rem", transform: "translateY(2rem)", borderRadius: "0.5rem 0.5rem 0 0", backgroundColor:'#2caed8', padding: "1rem", transition: "transform 250ms", ":hover": { transform: "translateY(1rem) rotate(2deg)" } }}>
            <span style={{ display: "block", textAlign: "center", fontWeight: "600", color: "#FFF" }}>Gain insightful data tailored to your health needs, empowering better decisions and outcomes.</span>
          </div>
        </motion.div>
        </GridItem>


      </Grid>
    </Box>
    </Flex>
);

}

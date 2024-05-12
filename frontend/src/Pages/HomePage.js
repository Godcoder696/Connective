import {Box, Button, Flex, HStack, Image, SimpleGrid, Tab, TabList, TabPanel, TabPanels, Tabs, Text, VStack } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import hero from '../assets/vecteezy_3d-speech-bubbles-icon-or-chat-message-notification-icon-or_15078719_328.png'
import '../App.css'
import Login from './Components/Login'
import { FcGoogle } from 'react-icons/fc'
import SignUp from './Components/SignUp'
import favHero from '../assets/C__2_-removebg-preview.png';
import { useHistory } from 'react-router-dom'

const HomePage = () => {
  
  const history= useHistory()

  useEffect(()=>{
    
    const userInfo= JSON.parse(localStorage.getItem("userInfo"));

    if(userInfo) history.push("/chats")
    
  },[history])

  return (
    <>  
        <Flex color={"white"} bg={"#131313"} alignItems={"center"} justify={"start"} >
          <Image alt="AV" src={favHero} h={"20vh"}></Image>
          <Text fontSize={"2rem"} >ConnecTive</Text>
        </Flex>
        <SimpleGrid columns={{base:1,lg:2}} bg={"#131313"} p={5} alignItems={"start"}>
          <HStack order={{base:2,lg:1}} >
          <Image src={hero} h={{xl:"100%",lg:"80vh",md:"25%"}}></Image>
          </HStack>
          <Flex order={{base:1,lg:2}} alignItems={"center"} direction={"column"} justifyContent={"center"} bg={""}>
            <Box w={{sm:"70%",md:"60%",lg:"70%"}} bg={"#202329"} p={"20px"} borderRadius={"1rem"} >
              <Tabs colorScheme='whiteAlpha.100' variant={"enclosed"}  >
                <TabList>
                  <Tab>Sign-In</Tab>
                  <Tab>Sign-Up</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Login></Login>
                  </TabPanel>
                  <TabPanel>
                    <SignUp></SignUp>
                  </TabPanel>    
                </TabPanels>
              </Tabs>
            </Box>
            <Text mt={3} color={"white"} fontWeight={"bold"}>OR</Text>
            <VStack mt={3} spacing={2}>
              <Button colorScheme='teal' leftIcon={<FcGoogle/>}>Sign in with Google</Button>
              <Button colorScheme='purple'  leftIcon={<FcGoogle/>}>Sign up with Google </Button>
            </VStack>
          </Flex>
        </SimpleGrid>
      {/* </Flex> */}
    </>
  )
}

export default HomePage
import { HStack, Image, Text, VStack } from '@chakra-ui/react'
import React from 'react'

const About = () => {
    const userInfo= JSON.parse(localStorage.getItem("userInfo"))
  return (
    <>
        <VStack h={"max-content"} w={"100%"} mt={"10"}>
            <Image src={userInfo.pic} h={"40"} w={"40"} borderRadius={"2rem"}></Image>
            <HStack h={"max-content"} w={"90%"} mt={"10"} >
                <Text fontSize={"1.5rem"} fontWeight={"bold"} ml={"1"}>NAME:</Text>
                <Text fontSize={"1.5rem"} >{userInfo.name}</Text>
            </HStack>
            <HStack h={"max-content"} w={"90%"} mt={"5"}  >
                <Text fontSize={"1.5rem"} fontWeight={"bold"} >EMAIL:</Text>
                <Text fontSize={"1.5rem"} >{userInfo.email}</Text>
            </HStack>
        </VStack> 
    </>
  )
}

export default About

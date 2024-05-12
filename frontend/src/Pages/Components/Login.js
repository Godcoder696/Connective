import { Box, Container, Flex, FormControl, Text , Tabs, TabList, TabPanels, Tab, TabPanel, FormLabel, Input, Button, VStack, useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useState } from 'react'
import {useHistory} from 'react-router-dom';

export default function Login(params) {
    const [loading,setLoading]= useState(false)
    const [email,setEmail]= useState();
    const [password,setPassword]= useState();
    const toast= useToast()
    const history= useHistory()

    const handleSignIn=async ()=>{
        setLoading(true)
        if(!email || !password){
            toast({
                title:"Please fill all fields!",
                status:"warning",
                duration:1500,
                isClosable:true,
                position:"bottom-right"
            })
            setLoading(false)
            return;
        }
        try {
            const config={
                headers:{
                    "Content-type":"application/json"
                }
            }
            const {data}= await axios.post("/api/user/logInUser",{email,password},config)
            localStorage.setItem("userInfo",JSON.stringify(data))
            console.log(data)
            history.push(`/chats`)
            toast({
                title:"Loged In!",
                status:"success",
                duration:1500,
                isClosable:true,
                position:"bottom"
            })
        } catch (error) {
            toast({
                title:"Email or Password is incorrect!",
                status:"warning",
                duration:1500,
                isClosable:true,
                position:"bottom-right"
            })
        }
        setLoading(false)
    }
    return(
        <>
            <VStack spacing={3} >
                <FormControl isRequired>
                    <FormLabel >Enter your Email:</FormLabel>
                    <Input type='email' placeholder='Email' onChange={(e)=>{setEmail(e.target.value)}}></Input>
                </FormControl>
                <FormControl isRequired >
                    <FormLabel>Enter your Password:</FormLabel>
                    <Input type='password' placeholder='Password' onChange={(e)=>{setPassword(e.target.value)}}></Input>
                </FormControl>
                <FormControl mt={5}>
                    <Button w="100%" onClick={handleSignIn} isLoading={loading}>SIGN IN</Button>
                </FormControl>
            </VStack>
        </>
    )
};

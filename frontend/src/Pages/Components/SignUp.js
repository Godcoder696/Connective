import { Button, Flex, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react";
import { useState } from "react";
import axios from 'axios'
import {useHistory} from 'react-router-dom';


export default function SignUp(params) {
    const [name,setName]= useState();
    const [email,setEmail]= useState();
    const [confirmPswd,setconfirmPswd]= useState();
    const [password,setPswd]= useState();
    const [pic,setPic]= useState();
    const [show,setShow]= useState(false);
    const [showConf,setShowConf]= useState(false);
    const [loading,setLoading]= useState(false)
    const toast= useToast();
    const history= useHistory()


    const handleSignUp=async ()=>{
        setLoading(true);
        console.log(name+" "+email+" "+password)
        if(!name || !email || !password || !confirmPswd){
            toast({
                title:"Please fill all the fields",
                status:"error",
                duration:1500,
                isClosable:true,
                position:"bottom-right"
            })
            setLoading(false);
            return;
        }
        console.log("hello");
        if(password!==confirmPswd){
            toast({
                title:"Password fields should be same",
                status:"warning",
                duration:1500,
                isClosable:true,
                position:"bottom-right"
            })
            setLoading(false);
            return;
        }
        try {
            const config={
                headers:{
                    "Content-type":"application/json"
                }
            }
            const {data}= await axios.post("http://127.0.0.1:5000/api/user/signUpUser",{name,password,email},config);
            toast({
                title:"Sign Up Success!",
                status:"success",
                duration:1500,
                isClosable:true,
                position:"bottom-right"
            })
            localStorage.setItem("userInfo",JSON.stringify(data))
            setLoading(false)
            history.push("/chats")
        } catch (error) {
            toast({
                title:"An Error Occurred!",
                description: error.response.data.message,
                status:"warning",
                duration:1500,
                isClosable:true,
                position:"bottom-right"
            })
        }
    }
    return(
        <>
            <Flex w={"100%"} alignItems={"center"} flexDir={"column"} >
                <VStack spacing={3} w="100%">
                    <FormControl id="firstName" isRequired>
                        <FormLabel>Enter your name</FormLabel>
                        <Input placeholder="Name" onChange={(e)=>setName(e.target.value)}></Input>
                    </FormControl>
                    <FormControl id="email" isRequired>
                        <FormLabel>Enter your email</FormLabel>
                        <Input placeholder="Email" type="email" onChange={(e)=>setEmail(e.target.value)}></Input>
                    </FormControl>
                    <FormControl id="password" isRequired>
                        <FormLabel>Enter your password</FormLabel>
                        <InputGroup>
                            <Input placeholder="Password" type={show?"text":"password"} onChange={(e)=>setPswd(e.target.value)}></Input>
                            <InputRightElement w="4.5vw">
                                <Button onClick={(e)=>setShow(!show)}>
                                    {!show?"show":"hide"}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <FormControl id="confirmPassword" isRequired>
                        <FormLabel>Confirm your password</FormLabel>
                        <InputGroup>
                            <Input placeholder="Confirm Password" type={showConf?"text":"password"} onChange={(e)=>setconfirmPswd(e.target.value)}></Input>
                            <InputRightElement w="4.5vw">
                                <Button onClick={(e)=>setShowConf(!showConf)}>
                                    {!showConf?"show":"hide"}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <FormControl mt={1}>
                        <FormLabel>Set your profile picture</FormLabel>
                        <Input type="file" accept="image/*" ></Input>
                    </FormControl>
                    <FormControl mt={5}>
                        <Button w={"100%"} value={"SIGN UP"} onClick={handleSignUp} isLoading={loading}> SIGN UP</Button>
                    </FormControl>
                </VStack>
            </Flex>
        </>
    )
};

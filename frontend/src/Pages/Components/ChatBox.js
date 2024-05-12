import { Box, Button, Flex, HStack, Image, Input, Spinner, Text, VStack, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { HamburgerIcon } from '@chakra-ui/icons'
import {FaRegSmile } from 'react-icons/fa';
import SideDrawer from '../miscellaneous/SideDrawer';
import { IoIosSend } from 'react-icons/io';
import axios from 'axios';
import io from 'socket.io-client';

const ENDPOINT= "http://localhost:5000"
let socket,selectedChatCompare;

const ChatBox = () => {
    const {showSideBar,setShowSideBar,user,selectedChat,setSelectedChat}= ChatState()
    const [message,setMessage]= useState([])
    const [newMessage,setNewMessage]= useState()
    const [loading,setLoading]= useState(false);
    const toast= useToast()
    const [socketConnected,setSocketConnected]= useState(false)
    
    useEffect(()=>{
        socket= io(ENDPOINT);
        socket.emit("setup",user)
        socket.on("connection",()=> setSocketConnected(true))
    },[])
    
    const sendMessage = async (e)=>{
        if(newMessage!==undefined && newMessage!==""){
            const config={
                headers:{
                    "Content-type":"application/json",
                    Authorization:`Bearer ${user.token}`
                }
            }
            try {
                setNewMessage("")
                const {data}= await axios.post("http://localhost:5000/api/message/",{
                    chatId:selectedChat._id,
                    content:newMessage
                },config)

                socket.emit("new message",data)

                setMessage([...message,data])
                console.log(data);

            } catch (error) {
                toast({
                    title:"Error Sending message!",
                    status:"error",
                    duration:"2000",
                    position:"bottom",
                    isClosable:true,
                })
            }
        }
    }

    const fetchChats= async ()=>{
        setLoading(true)
        try {
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}= await axios.get(`http://localhost:5000/api/message/${selectedChat._id}`,config)
            setMessage(data)
            socket.emit('join chat',selectedChat._id)
        } catch (error) {
            toast({
                title:"Error Fetching chat!",
                status:"error",
                duration:"2000",
                position:"bottom",
                isClosable:true,
            })
        }
        setLoading(false)

    }
    const typingHandler=(e)=>{
        setNewMessage(e.target.value)
    }

    useEffect(()=>{
        setNewMessage(newMessage)
    },[newMessage])

    useEffect(()=>{
        fetchChats()

        selectedChatCompare= selectedChat

    },[selectedChat._id])

    useEffect(()=>{
        socket.on("message received",(msgReceived)=>{
            if(!selectedChat || selectedChatCompare._id!== msgReceived.chat._id){
                // give notification
            }
            else{
                setMessage([...message,msgReceived])
            }
        })
    })

    
  return (
    <>  
        <HStack h={"11%"} w={"100%"} bg="#2e333d" justify={"space-between"} borderRadius={"1rem"}> 
            <Flex alignItems={"center"}>
                <Image src={selectedChat.users[1].pic} h="12" w="13" bg={"red"} ml={"4"} borderRadius={"1rem"}></Image>
                <Text fontSize={"2rem"} ml={"4"}>
                    {
                        selectedChat.isGroupChat?
                        selectedChat.chatName
                        :
                        user.name===selectedChat.users[0].name
                        ?
                        selectedChat.users[1].name:
                        selectedChat.users[0].name
                    }
                </Text>
            </Flex>
            {
                selectedChat.isGroupChat 
                &&
                <HamburgerIcon mr={"7"} h={8} w={8} cursor={"pointer"} onClick={()=>setShowSideBar(!showSideBar)}></HamburgerIcon>
            }
        </HStack>
        <SideDrawer></SideDrawer>
        <Flex className='chatBox-scrollBar' h={"77%"} w={"100%"} bg="#2e333d" justify={""} direction={"column"}  borderRadius={"1rem"} overflowY={"scroll"} overflowX={"hidden"} p={2} > 

            {
                loading?
                <Flex h={"100%"} w={"100%"} justify={"center"} align={"center"}>
                    <Spinner h={10} w={10}></Spinner>
                </Flex>
                :
                message.map((msg,id)=>{
                    if(msg.sender._id===user._id) {
                        return(   
                            <Flex h={"max-content"} w={"100%"} mt={4} justify={"end"} key={id} >
                                <VStack h={"max-content"} p={3} maxW={"50%"} bg={"#4a5263"} borderRadius={"1rem"} alignSelf={"flex-end"}>
                                    <Text>{msg.content}</Text>
                                </VStack>
                            </Flex>
                        )
                    }
                    else{
                        return(
                            <Flex h={"max-content"} w={"100%"} ml={2} mt={4} key={id} >
                                <Image h={"7vh"} w={"5.5%"} bg={"#4a5263"} borderRadius={"1rem"} src={msg.sender.pic}></Image>  
                                <VStack h={"max-content"} p={3} maxW={"50%"} bg={"#4a5263"} borderRadius={"1rem"} ml={3} >
                                    <Text>{msg.content}</Text>
                                </VStack>
                            </Flex>
                        )
                    }
                })
            }
        </Flex>
        <HStack h={"10%"} w={"100%"} bg="#2e333d" justify={"space-evenly"}  borderRadius={"1rem"} >
            <FaRegSmile size={30} cursor={"pointer"}/>
            <Input w={"81%"} placeholder='Type your message here ...' onChange={typingHandler} value={newMessage}/>
            <Button colorScheme='purple' cursor={"pointer"} onClick={sendMessage}>
                Send
            </Button>
        </HStack>
    </>
  )
}

export default ChatBox
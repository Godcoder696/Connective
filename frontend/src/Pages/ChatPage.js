import React, { useEffect } from 'react'
import { Flex, HStack, Text, VStack} from "@chakra-ui/react"
import NavBar from './miscellaneous/NavBar'
import { useRouteMatch } from 'react-router-dom'
import { ChatState } from '../Context/ChatProvider'
import SearchUser from './Components/SearchUser'
import Notification from './Components/Notification'
import Chats from './Components/Chats'
import About from './Components/About'
import GroupChat from './Components/GroupChat'
import ChatBox from './Components/ChatBox'

const ChatPage = (params) => {
    const {heading}= params
    const {url}= useRouteMatch()
    // const [user,setUser]= ChatState();
    const {user,setUser}= ChatState()
    const {selectedChat,setSelectedChat}= ChatState()
    
    useEffect(()=>{
        setSelectedChat(undefined)
    },[])

  return (
    <>
        {
           user && <Flex w={"100vw"} h={"100vh"} bg={"#131313"} position={"fixed"}>
                    <NavBar></NavBar>
                    <HStack h="100%" w="91%" bg="#202329" borderRadius={"1.5rem"} justify={"space-evenly"}>
                        <VStack h={"90%"} w={"25%"} >
                            <Text fontSize={"2rem"} fontWeight={"bold"}>{heading}</Text>
                            {
                                (
                                    url==="/chats/search" 
                                    && 
                                    <SearchUser ></SearchUser>
                                )
                            }
                            {
                                (
                                    url==="/chats/notification"
                                    &&
                                    <Notification></Notification>
                                )
                            }
                            {
                                (
                                    url==="/chats"
                                    &&
                                    <Chats ></Chats>
                                )
                            }
                            {
                                (
                                    url==="/chats/createGroup"
                                    &&
                                    <GroupChat></GroupChat>
                                )
                            }
                            {
                                (
                                    url==="/chats/about"
                                    &&
                                    <About></About>
                                )
                            }
                        </VStack>
                        <VStack h={"90%"} w={"65%"} bg={!selectedChat?"#2e333d":""} justify={"center"} borderRadius={"2rem"}>
                            {
                                !selectedChat?
                                <Text fontSize={"1.5rem"}>Click or search to start Chatting! 💬 </Text>
                                :
                                <ChatBox></ChatBox>
                            }
                        </VStack>
                    </HStack>
                </Flex> 
        }
        
    </>
  )
}

export default ChatPage

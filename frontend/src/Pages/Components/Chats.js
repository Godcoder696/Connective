import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ChatState } from '../../Context/ChatProvider';
import Loading from '../miscellaneous/Loading';
import { HStack, Image, Text } from '@chakra-ui/react';

const Chats = (params) => {
  const {selectedChat,setSelectedChat}= ChatState()
  const {chats,setChats}= ChatState([])
  const [loading,setLoading]= useState(false);

  const userInfo= JSON.parse(localStorage.getItem("userInfo"));
  const fetchChats=async ()=>{
    setLoading(true)
    // console.log(userInfo.token);
    try {
      const config={
        headers:{
          Authorization:`Bearer ${userInfo.token}`
        }
      }
      const {data}= await axios.get(`/api/chat/`,config)
      console.log(config)
      setChats(data)
      console.log(data);
    } catch (error) {
      console.log(error.message)
    }
    setLoading(false)
  }

  useEffect(()=>{
    fetchChats()
  },[])

  useEffect(()=>{
    setSelectedChat(selectedChat)
  },[selectedChat])

  return (
    <>
      {
        loading? 
          <Loading></Loading>
        :
        chats && chats.map((user,id)=>{
          return(
            <HStack h={"12%"} w={"100%"} bg={"#2e333d"} mt={"5"} borderRadius={"0.5rem"} key={id} cursor={"pointer"} onClick={()=>{setSelectedChat(user)}}>
              <Image h={"77%"} w={"17%"} bg={"#ffcca5"} borderRadius={"1rem"} ml={"3"} />
              <Text fontSize={"2xl"} ml={"2"}>
                {
                  user.isGroupChat?
                  user.chatName
                  :
                  userInfo.name===user.users[0].name?
                    user.users[1].name
                    :
                    user.users[0].name
                }
              </Text>
            </HStack>
          )
        })
      }
    </>
  )
}

export default Chats

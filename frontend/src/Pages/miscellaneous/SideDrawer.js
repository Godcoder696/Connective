import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, HStack, Input, Text, Tooltip, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { CloseIcon, MinusIcon } from '@chakra-ui/icons'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

const SideDrawer = () => {  
  const {showSideBar,setShowSideBar}= ChatState()
  const {selectedChat,setSelectedChat}=ChatState()
  const [removedUsers,setRemovedUsers]= useState([])
  const [groupName,setGroupName]= useState()
  const {user,setUser}= ChatState();
  const {chats,setChats}= ChatState([])
  const history= useHistory()

  const toast= useToast()

  const removeUserChat=(user)=>{
    if(removedUsers.includes(user)) {
      toast({
        title:"User Already Added!",
        duration:"2000",
        position:"bottom",
        status:"warning"
      })
    }
    else setRemovedUsers([user,...removedUsers])
    // console.log(removedUsers)
  }

  const undoRemoveUser =(user)=>{
    setRemovedUsers(
      removedUsers.filter((u)=>{
        return u!==user
      })
    )
  }
  
  const leaveGroup=async ()=>{
    try {

      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }

      const {data}= await axios.put("http://localhost:5000/api/chat/groupremove",{
        groupId: selectedChat._id,
        userId: user._id
      }
      ,config)

      setChats(
        chats.filter((chat)=>{
        return chat._id!==data._id
      }))
      
      console.log(data);

      toast({
        title:"Successfully Left!",
        duration:"2000",
        position:"bottom",
        status:"success"
      })

      setShowSideBar(!showSideBar)
      setSelectedChat(undefined)
    } catch (error) {
      
      toast({
        title:"An Error Occurred",
        duration:"2000",
        position:"bottom",
        status:"warning"
      })
    }
  }

  const updateGroup= async ()=>{
    try {

      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        }
      }

      if(groupName!==undefined){
        
        const {data}= await axios.put("http://localhost:5000/api/chat/rename",{
          chatId: selectedChat._id,
          chatName: groupName
        },config)
        
        // setSelectedChat(selectedChat.name=groupName)
        if(!data) history.push("/chats")

        toast({
          title:"Chat Name Updated",
          duration:"2000",
          position:"bottom",
          status:"success"
        })
        setGroupName(undefined)
      }

      if(removedUsers.length!==0){

        for(let i=0;i<removedUsers.length;i++){
          const u= removedUsers[i];
          const {data}= await axios.put("http://localhost:5000/api/chat/groupremove",{
            groupId:selectedChat._id,
            userId: u._id
          },config)
          
        }

        toast({
          title:"Users Removed !",
          duration:"2000",
          position:"bottom",
          status:"success"
        })
        setRemovedUsers([])
      }

      setShowSideBar(!showSideBar)

    } catch (error) {
      console.log(error)
      toast({
        title:"An Error Occurred!",
        duration:"2000",
        position:"bottom",
        status:"warning"
      })
    }
  }

  useEffect(()=>{
    setGroupName(groupName)
  },[groupName])

  return (
    <Drawer
        isOpen={showSideBar}
        placement='right'
        onClose={()=>{
          setShowSideBar(!showSideBar)
          setRemovedUsers([])
        }}
      >
        <DrawerOverlay />
        <DrawerContent bg="#1c2029">
          <DrawerCloseButton/>
          <DrawerHeader>Group Settings</DrawerHeader>

          <DrawerBody>
            <Input placeholder='Change Group Name' mt={2} onChange={(e)=>setGroupName(e.target.value)}></Input>

            {
              removedUsers.length!==0 &&
              <>
                <Text mt={3}>Users to be Removed:</Text>
                <Flex mt={1} w={'100%'} wrap={'wrap'} >
                {
                  removedUsers.map((user,id)=>{
                    return(
                      <HStack bg={"purple"} paddingInline={5} borderRadius={"1rem"} ml={1} mt={1} justify={"space-evenly"} key={id}>
                        <Text>{user.name}</Text>
                        <Tooltip label="undo" hasArrow>
                          <MinusIcon h={2} w={2} cursor={"pointer"} onClick={()=>{undoRemoveUser(user)}}></MinusIcon>
                        </Tooltip>
                      </HStack>
                    )
                  })
                }
                </Flex>
              </>
            }

            <Text mt={3}>Current Members:</Text>
            <Flex mt={1} w={'100%'} wrap={'wrap'} >
              {
                selectedChat.users.map((user,id)=>{
                  return(
                    <HStack bg={"green.500"} paddingInline={5} borderRadius={"1rem"} ml={1} mt={1} justify={"space-evenly"} key={id}>
                      <Text>{user.name}</Text>
                      <Tooltip label="Remove this user" hasArrow>
                        <CloseIcon h={2} w={2} cursor={"pointer"} onClick={()=>removeUserChat(user)}></CloseIcon>
                      </Tooltip>
                    </HStack>
                  )
                })
              }
            </Flex>
          </DrawerBody>

          <DrawerFooter>
            <Button colorScheme='red' onClick={()=>leaveGroup()} mr={3}>Leave Group</Button>
            <Button colorScheme='purple' onClick={()=>updateGroup()}>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
  )
}

export default SideDrawer

import { Box, Button, Flex, HStack, Image, Input, Text, VStack, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Loading from '../miscellaneous/Loading'
import {CloseIcon} from '@chakra-ui/icons';
import { useHistory } from 'react-router-dom';

const GroupChat = () => {
    const [users,setUsers]= useState([])
    const [loading,setLoading]= useState(false)
    const [selectedUsers,setSelectedUsers]= useState([])
    const toast= useToast();
    const [groupName,setGroupName]= useState("")
    const history= useHistory();
    const fetchUsers=async (e)=>{
        setLoading(true)
        try {
            const userInfo=JSON.parse(localStorage.getItem('userInfo'))
            const config={
                headers:{
                    Authorization: `Bearer ${userInfo.token}`
                }
            }
            const {data}= await axios.get(`/api/user/allUsers?search=${e.target.value}`,config)
            setUsers(data)
        } catch (error) {
            toast({
                title:"Error Occured while creating a group!",
                description: error.message,
                status:"warning",
                duration:2000,
                isClosable:true,
                position:"bottom"
            })
        }
        setLoading(false)
    }
    const addUsers=(user)=>{
        if(selectedUsers.includes(user)){
            toast({
                title:"User Already Added!",
                description: "Unique users are allowed in the group.",
                status:"warning",
                duration:2000,
                isClosable:true,
                position:"bottom"
            })
            return
        }
        setSelectedUsers([...selectedUsers,user])
        console.log(selectedUsers)
    }
    useEffect(()=>{
        setGroupName(groupName)
        console.log(groupName)
    },[groupName])

    const createGroupChat= async ()=>{
        if(!groupName || !selectedUsers){
            toast({
                title:"Please fill all the details!",
                status:"warning",
                duration:2000,
                isClosable:true,
                position:"bottom"
            })
            return
        }
        if(selectedUsers.length<2){
            toast({
                title:"Atleast select 2 users to form a group!",
                status:"warning",
                duration:2000,
                isClosable:true,
                position:"bottom"
            })
            return
        }
        try {
            const userInfo=JSON.parse(localStorage.getItem('userInfo'))
            const config={
                headers:{
                    Authorization: `Bearer ${userInfo.token}`
                }
            }
            const {data} = await axios.post("http://localhost:5000/api/chat/group",{
                name: groupName,
                users: JSON.stringify(
                    selectedUsers.map((user)=>{
                        return user._id
                    })
                )
            }, config)

            toast({
                title:`New Group Chat ${groupName}Created`,
                description:"Check your chats page...",
                duration:3000,
                status:"success",
                position:"bottom"
            })
            history.push("/chats")
            console.log(data)
        } catch (error) {
            toast({
                title:`Error Creating Chat!`,
                description:error.message,
                duration:3000,
                status:"warning",
                position:"bottom"
            })
        }   
    }

    const removeUser=(user)=>{
        setSelectedUsers(selectedUsers.filter((sel)=>sel._id!==user._id))
        console.log(selectedUsers);
    }
  return (
    <>
        <VStack h={"70%"} w={"100%"}  mt={"4"} borderRadius={"1rem"}>
            <Input bg={"#2e333d"} h={"10%"} w={"100%"} placeholder='Enter Group Name' onChange={(e)=>setGroupName(e.target.value)} ></Input>
            <Box w={"100%"}>
                <Text mt={"2"} w={"100%"} textAlign={"left"} >
                    ADDED USERS:
                </Text>
                <Flex h={"5%"}  wrap={'wrap'} mt={1} >
                {
                    selectedUsers.map((users,id)=>{
                        return(
                            <HStack bg={"green"} paddingInline={5} borderRadius={"1rem"} ml={1} mt={1} key={id} justify={"space-evenly"}>
                                <Text>{users.name}</Text>
                                <CloseIcon h={2} w={2} cursor={"pointer"} onClick={()=>removeUser(users)}></CloseIcon>
                            </HStack>
                        )
                    })
                }
                </Flex>
            </Box>
            <Input mt={"2"} bg={"#2e333d"} h={"10%"} w={"100%"} placeholder='Search Users To Add' onChange={fetchUsers}></Input>
            <VStack h="70%" w={"100%"} bg={""} overflowY={"scroll1"} >
            {
                loading?
                <Loading></Loading>
                :
                users.map((users,id)=>{
                    return (
                        <HStack h={"25%"} w={"100%"} bg={"#2e333d"} mt={"1"} borderRadius={"0.5rem"}  cursor={"pointer"} key={id} onClick={()=>addUsers(users)}>
                            <Image h={"77%"} w={"17%"} bg={"#ffcca5"} borderRadius={"1rem"} ml={"3"} />
                            <Text fontSize={"2xl"} ml={"1"}>
                                {users.name}
                            </Text>
                        </HStack>
                    )
                })
            }
            </VStack>
        </VStack>
        <Button mt={"2"} h="10%" w={"80%"} bg={"#2e333d"} borderRadius={"1rem"} color={"white"} fontSize={"2xl"} onClick={createGroupChat}>
            CREATE GROUP
        </Button>
    </>
  )
}

export default GroupChat
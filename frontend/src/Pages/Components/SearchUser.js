import { SearchIcon } from '@chakra-ui/icons';
import { HStack, Image, Input, Text, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios';
import Loading from '../miscellaneous/Loading';
import { ChatState } from '../../Context/ChatProvider';

const SearchUser = (params) => {
    const [search,setSearch]= useState([])
    const [loading,setLoading]= useState(false)
    const [loadingChat,setLoadingChat]= useState()
    const [selectedChat,setSelectedChat]= useState()
    const {chats,setChats}= ChatState()
    const toast= useToast()

    const userInfo= JSON.parse(localStorage.getItem("userInfo"))

    const fetchUsers=async (e)=>{
        setLoading(true)
        const user= JSON.parse(localStorage.getItem("userInfo"))
        let search= e.target.value
        const config={
            headers:{
                Authorization: `Bearer ${user.token}`
            }
        }
        const {data}= await axios.get(`/api/user/allUsers?search=${search}`,config)
        setSearch(data)
        setLoading(false)
    }

    const accessChat= async (userId)=>{
        setLoadingChat(true)
        try {
            const config={
                headers:{
                    "Content-type":"application/json",
                    Authorization:`Bearer ${userInfo.token}`
                }
            }

            const {data}= await axios.post("http://localhost:5000/api/chat/",{userId},config)

            // if(chats.users.includes())
            // console.log(chats)
            // setChats([data,...chats])
            // chats
            toast({
                title:"Chat Created!",
                status:"success",
                duration:1500,
                isClosable:true,
                position:"bottom"
            })
            setSelectedChat(data);
        } catch (error) {
            toast({
                title:"Error Creating Chat",
                description:error.message,
                status:"warning",
                duration:1500,
                isClosable:true,
                position:"bottom"
            })
        }
        setLoadingChat(false);
    }
  return (
    <>
        <HStack bg={"#2e333d"} h={"10%"} w={"95%"} borderRadius={"1rem"} mt={"2"} justify={"space-evenly"}>
            <SearchIcon h={"6"} w={"6"}/>
            <Input w={"35vh"} placeholder='Search name or email' onChange={fetchUsers}/>
        </HStack>
        <VStack h={"78%"} w={"95%"} mt={"2"} borderRadius={"1rem"} bg={""} >
            {
                loading ? <Loading/>
                :
                search.map((chats,id)=>{
                    return(            
                        <HStack h={"15%"} w={"100%"} bg={"#2e333d"} mt={"1"} borderRadius={"0.5rem"} key={id} onClick={()=>accessChat(chats._id)} cursor={"pointer"}>
                            <Image h={"77%"} w={"17%"} bg={"#ffcca5"} borderRadius={"1rem"} ml={"3"} src={chats.pic}/>
                            <Text fontSize={"2xl"} ml={"1"}>
                                {chats.name}
                            </Text>
                        </HStack>
                    )
                })
            }

        </VStack>
    </>
  )
}

export default SearchUser

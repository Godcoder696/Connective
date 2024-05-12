import { AddIcon, BellIcon, ChatIcon, InfoOutlineIcon, Search2Icon } from '@chakra-ui/icons'
import { Text, Tooltip, VStack } from '@chakra-ui/react'
import React from 'react'
// import { useRouteMatch } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {FiPower} from 'react-icons/fi'
import { useHistory } from 'react-router-dom'


const NavBar = (params) => {
    // const {url } = useRouteMatch();
    const history= useHistory()
    const logOut=()=>{
        localStorage.removeItem("userInfo")
        history.push("/")
    }
  return (
    <>
        <VStack h={"100%"} p={"5"} color={"white"} justify={"space-around"} >
            <Text fontWeight={"bold"} fontSize={"5xl"} >
                <Link to="/">
                    CT
                </Link>
            </Text>
            <VStack h={"60%"} p={"5"} justify={"space-evenly"} >
                <Tooltip label="All Chats" hasArrow>
                    <Link to={`/chats`}>
                        <ChatIcon h={"7"} w={"7"} />
                    </Link>
                </Tooltip>
                <Tooltip label="Search User" hasArrow>
                    <Link to={`/chats/search`}>
                        <Search2Icon h={"7"} w={"7"}/>
                    </Link>
                </Tooltip>
                <Tooltip label="Create Group" hasArrow>
                    <Link to={`/chats/createGroup`}>
                        <AddIcon h={"7"} w={"7"}/>
                    </Link>
                </Tooltip>
                <Tooltip label="Notification" hasArrow>
                    <Link to={`/chats/notification`}>
                        <BellIcon h={"7"} w={"7"}/>
                    </Link>
                </Tooltip>
            </VStack>
            <VStack height={"12%"} w={"100%"} justify={"space-between"} bg={""}>
                <Tooltip label="About" hasArrow>
                    <Link to={`/chats/about`}>
                        <InfoOutlineIcon h={"6"} w={"6"} cursor={"pointer"}/>
                    </Link>
                </Tooltip>
                <FiPower size={"28"} cursor={"pointer"} onClick={logOut}></FiPower>
            </VStack>
        </VStack>
    </>
  )
}

export default NavBar

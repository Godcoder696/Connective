import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const Loading = () => {
  return (
    <>
        <Stack h={"100%"} w={"100%"}>
            <Skeleton h={"15%"} w={"100%"} bg={"#2e333d"} mt={"1"} borderRadius={"0.5rem"}/>
            <Skeleton h={"15%"} w={"100%"} bg={"#2e333d"} mt={"1"} borderRadius={"0.5rem"}/>
            <Skeleton h={"15%"} w={"100%"} bg={"#2e333d"} mt={"1"} borderRadius={"0.5rem"}/>
            
            <Skeleton h={"15%"} w={"100%"} bg={"#2e333d"} mt={"1"} borderRadius={"0.5rem"}/>
            <Skeleton h={"15%"} w={"100%"} bg={"#2e333d"} mt={"1"} borderRadius={"0.5rem"}/>
            <Skeleton h={"15%"} w={"100%"} bg={"#2e333d"} mt={"1"} borderRadius={"0.5rem"}/>
            
        </Stack> 
    </>
  )
}

export default Loading

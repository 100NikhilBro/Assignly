"use client"


import { useEffect } from "react"
import { useUserStore } from "../store/userStore"

export const useAuth = () => {

    const {setUser} = useUserStore();

    useEffect(()=>{
        const storedUser = localStorage.getItem("user");
        if(storedUser){
            setUser(JSON.parse(storedUser));
        }
    },[])
}
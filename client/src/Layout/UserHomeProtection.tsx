import { axiosInstance } from '../api/axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginType } from 'types/global'

type ChildrenProps = {
    children: React.ReactNode
}

export const UserHomeProtection = ({children}: ChildrenProps) => {
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const isValid = async () => {
            try {
                const response = await axiosInstance.get<LoginType>("verify-user")
                if(response.status === 200){
                    if(response.data.accessToken){
                        localStorage.setItem("accessToken",response.data.accessToken)
                    }
                    setIsVerified(true)
                    navigate('/')
                }else{
                    navigate("/login")
                }
            } catch (error) {
                navigate("/login")
            }
        }
        isValid();
    },[])
  return (
    <div className='bg-white shadow-2xl'>
        {!isVerified && children}
    </div>
  )
}

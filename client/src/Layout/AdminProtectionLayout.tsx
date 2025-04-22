import { axiosInstance } from '../api/axios';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ChildrenProps, LoginType } from 'types/global';

export const AdminProtectionLayout = ({children}: ChildrenProps) => {
    const [isVerified, setIsVerified] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        const isValid = async () => {
            try {
                const response = await axiosInstance.get<LoginType>("/admin/verify-admin");
                console.log(response)
                if(response.status === 200){
                    if(response.data.accessToken){
                        localStorage.setItem("adminAccessToken",response.data.accessToken)
                    }
                    setIsVerified(true);
                }

            } catch (error) {
                console.log("user protection layer error", error)
                navigate("/adminlogin")
            }
        }
        isValid();
    },[])
  return (
    <div className='bg-black'>
        {isVerified && children}
    </div>
  )
}

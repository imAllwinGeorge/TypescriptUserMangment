import { ChildrenProps, LoginType} from 'types/global'
import { axiosInstance } from '../api/axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'



export const UserProtectionLayout = ({children}:ChildrenProps) => {
    const [isVerified, setIsVerified] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        const isValid = async () => {
            try {
                const response = await axiosInstance.get<LoginType>("/verify-user");
                console.log(response)
                if(response.status === 200){
                    if(response.data.accessToken){
                        localStorage.setItem("accessToken",response.data.accessToken)
                    }
                    setIsVerified(true);
                }

            } catch (error) {
                console.log("user protection layer error", error)
                navigate("/login")
            }
        }
        isValid();
    },[])
  return (
    <div className='bg-white'>
        {isVerified && children}
    </div>
  )
}

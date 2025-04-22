import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../api/axios";
import { ResponseType, SliceUser, UserType } from "types/global";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/userslice";



type UserData = {
  user: UserType
}
type ResponseData = ResponseType & UserData


export const Home = () => {
  const user: UserType = useSelector((state: SliceUser) => state.user.user);
  const [userDetails, setUserDetails] = useState({} as UserType);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.get("/logout");
      if(response.status === 200){
        localStorage.removeItem("accessToken");
        dispatch(logoutUser())
        navigate('/login')
      }
    } catch (error) {
      console.log("user logout error", error)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get<ResponseData>(
          `/user/${user._id}`
        );
        if (response.status === 200) {
          setUserDetails(response?.data?.user);
        }
      } catch (error) {
        console.log("fetch user ", error);
      }
    };
    fetchUser();
  }, []);
  return (
    <div className="flex flex-col space-y-4 p-6 max-w-md mx-auto">
    <Button className="self-end mb-2 bg-red-500 hover:bg-red-600 text-white" onClick={handleLogout}>Logout</Button>

    {userDetails && (
      <>
        <Card className="w-full shadow-md border border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-xl font-semibold text-gray-800">
              {userDetails.firstName} {userDetails.lastName}
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            <p className="text-gray-600">{userDetails.email}</p>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-200">
            <p className="text-gray-600">{userDetails.phone}</p>
          </CardFooter>
        </Card>

        <Button
          variant="ghost"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-end mt-2"
          onClick={() => navigate("/edit")}
        >
          Update
        </Button>
      </>
    )}
  </div>
  );
};

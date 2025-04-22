import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { axiosInstance } from "../../../api/axios";
import { ResponseType, UserType } from "types/global";
import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../../../redux/userslice";
import { toast } from "react-toastify";

type Users = {
  message: string;
  user: UserType[];
};

export const AdminHome = () => {
  const [users, setUsers] = useState([] as UserType[]);
  const [triggerFetch, setTriggerFetch] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleLogout = async () => {
    try {
      const response = await axiosInstance.get("/admin/logout");
      if(response.status === 200){
        localStorage.removeItem("adminAccessToken");
        dispatch(logoutAdmin());
        navigate("/adminlogin")
      }
    } catch (error) {
      console.log("admin logout error",error)
    }
  }

  const toggleUser = async(userId: string) => {
    const response = await axiosInstance.post<ResponseType>("/admin/toggle-user",{userId});
    if(response.status === 200){
      setTriggerFetch((prev) => !prev)
      toast(response?.data?.message)
    }
  }
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get<Users>("/admin/home");
        if (response.status === 200) {
          setUsers(response?.data?.user);
        }
      } catch (error) {
        console.log("admin home fetch user error", error);
      }
    };

    fetchUsers();
  }, [triggerFetch]);

  return (
    <div className="min-h-screen p-6 bg-black text-amber-500 shadow-xl">
      <div className="flex justify-end mb-4">
        <Button className="bg-red-500 hover:bg-amber-600 text-black font-bold" onClick={handleLogout}>Logout</Button>
      </div>

      <Table className="border border-amber-500 rounded-lg overflow-hidden">
        <TableCaption className="mt-4 mb-2">
          <Button onClick={() => navigate("/add-user")} className="bg-green-500 hover:bg-amber-600 text-black font-bold">
            Add User
          </Button>
        </TableCaption>

        <TableHeader className="bg-gray-900">
          <TableRow className="border-b border-amber-500">
            <TableHead className="w-[100px] text-amber-500 font-bold">Index</TableHead>
            <TableHead className="text-amber-500 font-bold">User</TableHead>
            <TableHead className="text-amber-500 font-bold">Email</TableHead>
            <TableHead className="text-amber-500 font-bold">Phone</TableHead>
            <TableHead className="text-amber-500 font-bold text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user._id} className="border-b border-amber-500 hover:bg-gray-900">
              <TableCell className="font-medium text-amber-500">{index + 1}</TableCell>
              <TableCell className="text-amber-500">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell className="text-amber-500">{user.email}</TableCell>
              <TableCell className="text-amber-500">{user.phone}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  onClick={() => navigate("/adminedit", { state: user })}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-bold mr-2"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => toggleUser(user._id)}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-bold"
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

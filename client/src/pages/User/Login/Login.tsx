import React, { useState } from "react";
import { axiosInstance } from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../../../redux/userslice";
import { LoginType } from "types/global";
import { toast } from "react-toastify";

type ErrorType = {
  email?: string;
  password?: string;
};




export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({}as ErrorType);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const submitForm = async()=>{
    try {
        const response = await axiosInstance.post<LoginType>("/login",{email,password});
        if(response.status === 200){
          console.log(response.data)
            localStorage.setItem('accessToken',response.data.accessToken)
            dispatch(addUser(response.data.user))
            navigate("/")
        }
    } catch (error: unknown) {
          console.log("admin login error", error);
        
          if (typeof error === "object" && error !== null && "response" in error) {
            const axiosError = error as { response: { data: { message: string } } };
            toast(axiosError.response.data.message);
          } else {
            toast("An unexpected error occurred!");
          }
        }
  }

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event?.preventDefault();
    const newErrors: ErrorType = {};

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      newErrors.email = "Email is required.";
    } else if (!/^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
      newErrors.email = "Email must be a valid Gmail address.";
    }

    if (!trimmedPassword) {
      newErrors.password = "Password should not be empty.";
    }
    // else if (
    //   !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    //     password
    //   )
    // ) {
    //   newErrors.password =
    //     "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.";
    // }

    if(Object.keys(newErrors).length > 0){
        return setError(newErrors)
    }

    submitForm();
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <h1 className="bg-black text-white text-center py-4 text-xl font-bold tracking-wider">LOG IN</h1>

      <form action="" className="p-6 space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            name="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
          {error.email && <h1 className="mt-1 text-red-600 text-sm p-1">{error.email}</h1>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            password
          </label>
          <input
            type="password"
            id="password"
            placeholder="password"
            value={password}
            name="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
          {error.password && <h1 className="mt-1 text-red-600 text-sm p-1">{error.password}</h1>}
        </div>

        <button
          onClick={(event) => handleSubmit(event)}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Submit
        </button>
      </form>
    </div>
  </div>
  );
};

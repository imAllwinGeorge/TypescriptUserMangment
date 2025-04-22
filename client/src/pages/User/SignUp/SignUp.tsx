import React, { useState } from "react";
import { axiosInstance } from "../../../api/axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ErrorType, UserType } from "types/global";
import { addUser } from "../../../redux/userslice";
import { toast } from "react-toastify";




type SignUpResponse = {
    accessToken: string
    user: UserType
}



export const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<ErrorType>({} as ErrorType);

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const submitForm = async() => {
    try {
        const response = await axiosInstance.post<SignUpResponse>("/signup",{firstName,lastName,email,phone,password});
        if(response.status === 201){
            console.log(response)
            localStorage.setItem("accessToken",response.data.accessToken)
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
    event.preventDefault();
    const newErrors: ErrorType = {};

    const trimmedFirstName = firstName.trim();
    const trimmedSecondName = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "password should be same";
    }

    if (!trimmedFirstName) {
      newErrors.firstName = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(trimmedFirstName)) {
      newErrors.firstName = "Name can only contain letters";
    }

    if (!trimmedSecondName) {
      newErrors.secondName = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(trimmedSecondName)) {
      newErrors.secondName = "Name can only contain letters";
    }

    if (!trimmedEmail) {
      newErrors.email = "Email is required.";
    } else if (!/^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmedEmail)) {
      newErrors.email = "Email must be a valid Gmail address.";
    }

    if (!trimmedPhone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(trimmedPhone)) {
      newErrors.phone =
        "Phone number must be 10 digits and start with 6, 7, 8, or 9";
    } else if (/^(\d)\1{9}$/.test(trimmedPhone)) {
      newErrors.phone = "Phone number cannot have all digits the same";
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

    if (Object.keys(newErrors).length > 0) {
      return setError(newErrors);
    }
    submitForm();
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <h1 className="bg-black text-white text-center py-4 text-xl font-bold tracking-wider">SIGN UP</h1>

      <div className="p-6">
        <form className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              placeholder="First Name"
              value={firstName}
              name="firstName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
            />
            {error.firstName && <h1 className="mt-1 bg-red-500 text-white text-sm p-1 rounded">{error.firstName}</h1>}
          </div>

          <div>
            <label htmlFor="secondName" className="block text-sm font-medium text-gray-700 mb-1">
              Second Name
            </label>
            <input
              type="text"
              id="secondName"
              placeholder="Second Name"
              value={lastName}
              name="secondName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
            />
            {error.secondName && <h1 className="mt-1 text-red-600 text-sm p-1">{error.firstName}</h1>}
          </div>

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
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="Phone Number"
              value={phone}
              name="phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
            />
            {error.phone && <h1 className="mt-1 text-red-600 text-sm p-1">{error.phone}</h1>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              name="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            {error.password && <h1 className="mt-1 text-red-600 text-sm p-1">{error.password}</h1>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              name="confirmPassword"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            />
            {error.confirmPassword && <h1 className="mt-1 text-red-600 text-sm p-1">{error.confirmPassword}</h1>}
          </div>

          <div>
            <button
              onClick={(event) => handleSubmit(event)}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

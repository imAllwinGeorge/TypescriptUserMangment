import { axiosInstance } from "../../../api/axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../../redux/userslice";
import { ResponseType, SliceUser, UserType } from "types/global";


type ErrorType = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

type UserData = {
  user: UserType;
};

type ResponseData = UserData & ResponseType;

export const Edit = () => {
  const user = useSelector((state: SliceUser) => state.user.user);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [error, setError] = useState<ErrorType>({} as ErrorType);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitForm = async () => {
    try {
      const response = await axiosInstance.post<ResponseData>(
        `/edit/${user._id}`,
        { firstName, lastName, email, phone }
      );
      if (response.status === 200) {
        dispatch(addUser(response.data.user));
        navigate("/");
      }
    } catch (error) {
      console.log("edit form submit error", error);
    }
  };

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    const newErrors = {} as ErrorType;

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = String(phone).trim();

    if (!trimmedFirstName) {
      newErrors.firstName = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(trimmedFirstName)) {
      newErrors.firstName = "Name can only contain letters";
    }

    if (!trimmedLastName) {
      newErrors.lastName = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(trimmedLastName)) {
      newErrors.lastName = "Name can only contain letters";
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

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    submitForm();
  };
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
    <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit User</h1>
    <form action="" className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          placeholder="First Name"
          value={firstName}
          name="firstName"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
        />
        {error.firstName && <h1 className="bg-red-500 text-white text-sm p-1 rounded">{error.firstName}</h1>}
      </div>

      <div className="space-y-1">
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          placeholder="Last Name"
          value={lastName}
          name="lastName"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
        />
        {error.lastName && <h1 className="text-red-600 text-sm font-medium">{error.lastName}</h1>}
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          name="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
        {error.email && <h1 className="text-red-600 text-sm font-medium">{error.email}</h1>}
      </div>

      <div className="space-y-1">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          placeholder="Phone Number"
          value={phone}
          name="phone"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
        />
        {error.phone && <h1 className="text-red-600 text-sm font-medium">{error.phone}</h1>}
      </div>

      <button
        onClick={(event) => handleSubmit(event)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Submit
      </button>
    </form>
  </div>
  );
};

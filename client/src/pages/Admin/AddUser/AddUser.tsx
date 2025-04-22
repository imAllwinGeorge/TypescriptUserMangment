import { axiosInstance } from '../../../api/axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ErrorType, ResponseType } from 'types/global';

export const AddUser = () => {
    const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<ErrorType>({} as ErrorType);

  const navigate = useNavigate();


  const submitForm = async() => {
    try {
        const response = await axiosInstance.post<ResponseType>("/admin/add-user",{firstName,lastName,email,phone,password});
        if(response.status === 201){
            navigate(-1)
        }
    } catch (error) {
        console.log("admin add user error",error)
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
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      newErrors.password =
        "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.";
    }

    if (Object.keys(newErrors).length > 0) {
      return setError(newErrors);
    }
    submitForm();
  };
  return (
    <div className="min-h-screen bg-black text-white p-6 max-w-md mx-auto">
      <form action="">
        <label htmlFor="firstName" className="block text-yellow-500 mb-1">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          placeholder="First Name"
          value={firstName}
          name="firstName"
          className="w-full bg-gray-900 border border-yellow-500 rounded px-3 py-2 mb-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
        />
        {error.firstName && <h1 className="bg-red-500 text-white text-sm p-1 mb-3 rounded">{error.firstName}</h1>}

        <label htmlFor="secondName" className="block text-yellow-500 mb-1">
          Second Name
        </label>
        <input
          type="text"
          id="secondName"
          placeholder="Second Name"
          value={lastName}
          name="secondName"
          className="w-full bg-gray-900 border border-yellow-500 rounded px-3 py-2 mb-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
        />
        {error.secondName && <h1 className="text-red-600 text-sm mb-3">{error.firstName}</h1>}

        <label htmlFor="email" className="block text-yellow-500 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          name="email"
          className="w-full bg-gray-900 border border-yellow-500 rounded px-3 py-2 mb-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
        {error.email && <h1 className="text-red-600 text-sm mb-3">{error.email}</h1>}

        <label htmlFor="phone" className="block text-yellow-500 mb-1">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          placeholder="Phone Number"
          value={phone}
          name="phone"
          className="w-full bg-gray-900 border border-yellow-500 rounded px-3 py-2 mb-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
        />
        {error.phone && <h1 className="text-red-600 text-sm mb-3">{error.phone}</h1>}

        <label htmlFor="password" className="block text-yellow-500 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          name="password"
          className="w-full bg-gray-900 border border-yellow-500 rounded px-3 py-2 mb-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />
        {error.password && <h1 className="text-red-600 text-sm mb-3">{error.password}</h1>}

        <label htmlFor="confirmPassword" className="block text-yellow-500 mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          name="confirmPassword"
          className="w-full bg-gray-900 border border-yellow-500 rounded px-3 py-2 mb-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
        />
        {error.confirmPassword && <h1 className="text-red-600 text-sm mb-3">{error.confirmPassword}</h1>}

        <button
          onClick={(event) => handleSubmit(event)}
          className="mt-4 bg-yellow-500 text-black font-bold py-2 px-6 rounded hover:bg-yellow-600 transition duration-300 w-full"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

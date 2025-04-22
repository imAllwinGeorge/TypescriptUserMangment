import { axiosInstance } from '../../../api/axios';
import React, {useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ResponseType } from 'types/global';

type ErrorType = {
    firstName: string
    lastName: string
    email: string
    phone: string
}

export const AdminEdit = () => {
    const location = useLocation();
    const user = location.state
    const [firstName, setFirstName] = useState(user.firstName);
    const [lastName, setLastName] = useState(user.lastName);
    const [email, setEmail] = useState(user.email);
    const [phone, setPhone] = useState(user.phone);
    const [error, setError] = useState({}as ErrorType);
    

    const navigate = useNavigate();



    const submitForm = async() => {
        const response = await axiosInstance.post<ResponseType>("/admin/user-edit",{userId:user._id, firstName, lastName, email, phone});
        if(response.status === 200){
            navigate(-1)
        }
    }


    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        const newErrors = {} as ErrorType

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
    }
  return (
    <div className="min-h-screen bg-black text-white p-6 rounded-lg max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-yellow-500">Edit User</h1>
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

        <label htmlFor="lastName" className="block text-yellow-500 mb-1">
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          placeholder="Last Name"
          value={lastName}
          name="lastName"
          className="w-full bg-gray-900 border border-yellow-500 rounded px-3 py-2 mb-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
        />
        {error.lastName && <h1 className="text-red-600 text-sm mb-3">{error.lastName}</h1>}

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

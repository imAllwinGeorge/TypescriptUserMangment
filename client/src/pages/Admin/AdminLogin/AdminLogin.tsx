import { axiosInstance } from "../../../api/axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addAdmin } from "../../../redux/userslice";
import { LoginType } from "types/global";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
type ErrorType = {
  email: string;
  password: string;
};

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({} as ErrorType);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitForm = async () => {
    try {
      const response = await axiosInstance.post<LoginType>("/admin/login", {
        email,
        password,
      });
      if (response.status === 200) {
        localStorage.setItem("adminAccessToken", response.data.accessToken);
        dispatch(addAdmin(response.data.user));
        navigate("/adminhome");
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
  };

  const handleSubmit = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    const newErrors = {} as ErrorType;

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
    <div className="max-w-md mx-auto p-6 bg-black rounded-lg shadow-lg border border-yellow-600">
      <h1 className="text-3xl font-bold mb-6 text-yellow-500 text-center">LOG IN</h1>
      <form action="" className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-yellow-500">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            name="email"
            className="w-full px-3 py-2 bg-gray-900 border border-yellow-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
          {error.email && <h1 className="text-red-600">{error.email}</h1>}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-yellow-500">
            password
          </label>
          <input
            type="password"
            id="password"
            placeholder="password"
            value={password}
            name="password"
            className="w-full px-3 py-2 bg-gray-900 border border-yellow-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          />
          {error.password && <h1 className="text-red-600">{error.password}</h1>}
        </div>

        <button
          onClick={(event) => handleSubmit(event)}
          className="w-full bg-yellow-600 text-black font-bold py-2 px-4 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-black transition-colors mt-4"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

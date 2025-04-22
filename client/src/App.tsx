import { Route, Routes } from "react-router-dom";

import { SignUp } from "./pages/User/SignUp/SignUp";
import { Home } from "./pages/User/Home/Home";
import { Login } from "./pages/User/Login/Login";
import { Edit } from "./pages/User/Edit/Edit";
import { AdminLogin } from "./pages/Admin/AdminLogin/AdminLogin";
import { AdminHome } from "./pages/Admin/AdminHome/AdminHome";
import { AdminEdit } from "./pages/Admin/AdminEdit/AdminEdit";
import { AddUser } from "./pages/Admin/AddUser/AddUser";
import { UserProtectionLayout } from "./Layout/UserProtectionLayout";
import { UserHomeProtection } from "./Layout/UserHomeProtection";
import { AdminProtectionLayout } from "./Layout/AdminProtectionLayout";
import { AdminHomeProtection } from "./Layout/AdminHomeProtection";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<UserProtectionLayout><Home /></UserProtectionLayout>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<UserHomeProtection><Login /></UserHomeProtection>} />
        <Route path="/edit" element={<UserProtectionLayout><Edit /></UserProtectionLayout>} />


        <Route path="/adminlogin" element={<AdminHomeProtection><AdminLogin /></AdminHomeProtection>} />
        <Route path="/adminhome" element={<AdminProtectionLayout><AdminHome /></AdminProtectionLayout>} />
        <Route path="/adminedit" element={<AdminProtectionLayout><AdminEdit /></AdminProtectionLayout>} />
        <Route path="/add-user" element={<AdminProtectionLayout><AddUser /></AdminProtectionLayout>} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;

import React, { useEffect } from "react";
import UserLayout from "../layout/user-layout/UserLayout";
import { Navigate, Outlet, useLocation  } from "react-router-dom";

const DefaultProtectedRoute = () => {
    const location = useLocation(); // 🔹 Add this to track URL changes


    const token = localStorage.getItem("accessToken");

   

    return (
        <UserLayout>
            <Outlet />
        </UserLayout>
    );
};

export default DefaultProtectedRoute;
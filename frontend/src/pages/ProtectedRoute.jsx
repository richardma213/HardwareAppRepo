import { Navigate } from "react-router-dom";

/* Class to protect unauthorized routing access */
export default function ProtectedRoute({children}){

    const token = localStorage.getItem("token");
    const guest = localStorage.getItem("guest");

    // If not guest or user account, redirect to login
    if(!token && !guest){
        return <Navigate to="/login" replace />
    }

    return children;
}
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../../services/user-api-service/UserService";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [userData, setUserData] = useState();
  const { postLogin} = UserService();
  const {setAuth} = useAuth();

  const navigate = useNavigate()

  const handleLogin = async(e) => {
   try {
    e.preventDefault();
  
    console.log("Logging in with:", { email, password });
    
     let userData = {
      email: email,
      password: password
    }
    const response = await postLogin(userData);
    console.log(response);

    if (response?.data?.success) {

      const accessToken = response?.data?.accessToken;
      const role = response?.data?.userData?.role;
      const image = response?.data?.userData?.image || "";
      const name = response?.data?.userData?.name || "";

    //localStorage.setItem("password", password)
    
      localStorage.setItem("accessToken", accessToken)
      localStorage.setItem("role", role)
      localStorage.setItem("profileImage", image)
      localStorage.setItem("name", name)

    setAuth({ accessToken, role, image, name })

      switch(role){
          case 'admin':
              navigate("/dashboard")
              break
          case 'user':
              navigate("/")
              break
      }
    }

   } catch (error) {
    console.log(error);
    
   }
}
  

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-control" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-danger w-100">Login</button>
        </form>
        <div className="text-center mt-3">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminService from "../../services/admin-api-service/AdminService";
import useAuth from "../../hooks/useAuth";

// Mocking lucide-react icons as per single-file requirement
const Eye = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOff = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.585 10.587a2 2 0 0 0 2.828 2.828"/><path d="M16.681 16.684c-1.343.83-2.883 1.316-4.506 1.316-7 0-10-7-10-7a17.433 17.433 0 0 1 4.507-4.506"/><path d="M12 18c.571 0 1.127-.08 1.666-.23A25.967 25.967 0 0 0 20 12c-3.15-3.6-6.495-5-8-5-.36 0-.712.023-1.054.068"/><line x1="2" x2="22" y1="2" y2="22"/></svg>;
const Zap = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;



// Component for the Softronics logo
const SoftronicsLogo = () => (
  <div className="flex items-center justify-center mb-10 select-none">
    <div className="flex items-center space-x-2">
      {/* Placeholder for the abstract logo icon - using an amber Zap/Lightning icon */}
      <Zap className="w-8 h-8 text-amber-600 rotate-45" fill="none" strokeWidth="3" />
      <span className="text-3xl font-extrabold text-gray-800 tracking-tight">
        Softronics
      </span>
      {/* Registered trademark symbol */}
      <sup className="text-xs text-gray-800 font-semibold">&reg;</sup>
    </div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMentor, setIsMentor] = useState(false);
  // const [userData, setUserData] = useState();
  const { postLogin} = AdminService();
  const {setAuth} = useAuth();

  const navigate = useNavigate()

  const handleSubmit = async(e) => {
   try {
    e.preventDefault();
  
    console.log("Logging in with:", { email, password, role: isMentor ? "Mentor" : "Admin" });
    
     let userData = {
      email: email,
      password: password,
      role: isMentor ? "Mentor" : "Admin"
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
          case 'Admin':
              navigate("/dashboard")
              break
          case 'Mentor':
              navigate("/")
              break
      }
    }

   } catch (error) {
    console.log(error);
    
   }
}

  // Define the custom button color to match the image precisely
  const customOrange = "bg-[#E99732]";
  const customOrangeHover = "hover:bg-[#d98a2e]";
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <style>{`
        /* Load Inter font */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* Logo Section */}
      <SoftronicsLogo />

      {/* Login Card (Responsive max-width) */}
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome Back!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* E-Mail Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              E-Mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out placeholder:text-gray-400 disabled:opacity-75"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out pr-12 placeholder:text-gray-400 disabled:opacity-75"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out disabled:cursor-not-allowed"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={loading}
              >
                {/* The "link" style icon in the image is often used for password visibility toggle */}
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mentor Checkbox */}
          <div className="flex items-center">
            <input
              id="isMentor"
              type="checkbox"
              checked={isMentor}
              onChange={(e) => setIsMentor(e.target.checked)}
              disabled={loading}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded disabled:opacity-75"
            />
            <label htmlFor="isMentor" className="ml-2 block text-sm text-gray-700">
              Are you a mentor?
            </label>
          </div>

          {/* Log In Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-3 rounded-lg ${customOrange} ${customOrangeHover} focus:outline-none focus:ring-4 focus:ring-amber-500 focus:ring-opacity-50 transition duration-150 ease-in-out shadow-lg disabled:opacity-70 disabled:cursor-wait mt-8`}
          >
            {loading ? (
                <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Logging In...</span>
                </div>
            ) : (
                'Log In'
            )}
          </button>
        </form>
      </div>
      
      {/* Version Number */}
      <p className="mt-8 text-sm text-gray-500 select-none">
        Ver 22.23.11
      </p>
    </div>
  );
};

export default Login;

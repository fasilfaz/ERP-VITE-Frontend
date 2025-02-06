import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LOGIN_API } from "../Utils/Contants/Api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trophy } from 'lucide-react';
import axios from "axios";
import { useState } from "react";
import FancyLoader from "../Components/Sidebar/Loader";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (value) => {
   setLoading(true);
    axios.post(LOGIN_API, value).then((res) => {
      if (res.data.success) {
        setLoading(false);
        localStorage.setItem("token", res.data.token);
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
        });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    })
    .catch((error) => {
      setLoading(false);
      toast.error(error.response.data.message || error.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
      });
    });
  };


  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500"></div>
          
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Trophy size={48} className="text-yellow-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">NEON Sports</h1>
            <h3 className="text-lg text-gray-600">Welcome Back!</h3>
          </div>

          {/* Login Form */}
          <Form 
            layout="vertical" 
            onFinish={handleSubmit}
            className="space-y-4"
          >
            <Form.Item 
              name="userId" 
              label="User ID"
              className="mb-6"
            >
              <Input 
                required 
                className="h-12 rounded-lg border-gray-300 hover:border-blue-500 focus:border-blue-500"
                placeholder="Enter your user ID"
              />
            </Form.Item>

            <Form.Item 
              name="password" 
              label="Password"
              className="mb-6"
            >
              <Input 
                required 
                type="password" 
                className="h-12 rounded-lg border-gray-300 hover:border-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </Form.Item>

            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              Demo Credentials: <br />
              UserId: 123 | Password: 123
            </p>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <p className="text-sm text-gray-600">
                Not a user? 
                <Link to="/register" className="text-blue-600 hover:text-blue-700 ml-1 font-medium">
                  Register Here!
                </Link>
              </p>
              
              <button 
                type="primary" 
                htmlType="submit"
                className="h-12 px-8 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 hover:bg-red-500 text-white rounded-lg text-base font-medium"
              >
                Login
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
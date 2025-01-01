import { useEffect } from "react";
import { Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { post } from "../Utils/Serivces/apiService";
import { REGISTER_API } from "../Utils/Contants/Api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trophy } from 'lucide-react';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (value) => {
    dispatch({
      type: "SHOW_LOADING",
    });
    const res = await post(REGISTER_API, value);
    if (res.success) {
      dispatch({ type: "HIDE_LOADING" });
      localStorage.setItem("token", JSON.stringify(res.data.token));
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
    } else {
      dispatch({ type: "HIDE_LOADING" });
      toast.error(res.data.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
      });
    }
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
            <h3 className="text-lg text-gray-600">Create Account</h3>
          </div>

          {/* Register Form */}
          <Form 
            layout="vertical" 
            onFinish={handleSubmit}
            className="space-y-4"
          >
            <Form.Item 
              name="name" 
              label="Name"
              className="mb-4"
            >
              <Input 
                required 
                className="h-12 rounded-lg border-gray-300 hover:border-blue-500 focus:border-blue-500"
                placeholder="Enter your name"
              />
            </Form.Item>

            <Form.Item 
              name="email" 
              label="Email"
              className="mb-4"
            >
              <Input 
                required 
                className="h-12 rounded-lg border-gray-300 hover:border-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
                type="email"
              />
            </Form.Item>

            <Form.Item 
              name="userId" 
              label="User ID"
              className="mb-4"
            >
              <Input 
                required 
                className="h-12 rounded-lg border-gray-300 hover:border-blue-500 focus:border-blue-500"
                placeholder="Create your user ID"
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
                placeholder="Create your password"
              />
            </Form.Item>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <p className="text-sm text-gray-600">
                Already registered? 
                <Link to="/login" className="text-blue-600 hover:text-blue-700 ml-1 font-medium">
                  Login Here!
                </Link>
              </p>
              
              <button 
                type="primary" 
                htmlType="submit"
                className="h-12 px-8 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 hover:bg-red-500 text-white rounded-lg text-base font-medium"
              >
                Register
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Register;
import { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { post } from "../Utils/Serivces/apiService";
import { LOGIN_API } from "../Utils/Contants/Api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (value) => {
      dispatch({
        type: "SHOW_LOADING",
      });
      const res = await post(LOGIN_API, value);
      if(res.success) {
        dispatch({ type: "HIDE_LOADING" });
        localStorage.setItem("auth", JSON.stringify(res.data.token));
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

  //currently login  user
  useEffect(() => {
    if (localStorage.getItem("auth")) {
      localStorage.getItem("auth");
      navigate("/");
    }
  }, [navigate]);
  return (
    <>
    <ToastContainer />
      <div className="register">
        <div className="regsiter-form">
          <h1>NEON Sports</h1>
          <h3>Login Page</h3>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="userId" label="User ID">
              <Input required />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <Input required type="password" />
            </Form.Item>
            <p className="test-creds">UserId: 123 | Password: 123</p>
            <div className="d-flex justify-content-between">
              <p>
                not a user? Please
                <Link to="/register"> Register Here !</Link>
              </p>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;

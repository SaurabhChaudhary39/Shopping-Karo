import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { setCredentials } from "../slices/authSlice";
import { useLoginMutation } from "../slices/usersApiSlice";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
            try {
                const res = await login({ email, password }).unwrap();
                dispatch(setCredentials({ ...res, }));
                navigate(redirect || "/");
            } catch (err) {
                toast.error(err?.data?.message || err.error);
            }
    };


  return (
    <FormContainer>
      <h1>Login</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="password" className="my-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-2" disabled={isLoading}>
          Login
        </Button>

        {isLoading && <Loader />}

        <Row className="py-3">
          <Col>
            New User?{" "}
            <Link to={redirect !== "/" ? `/register?redirect=${redirect}` : "/register"}>
              Register
            </Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default LoginScreen;

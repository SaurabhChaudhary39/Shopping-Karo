import {Link, useNavigate, useLocation} from 'react-router-dom'
import { Row,Col,Form,Button } from 'react-bootstrap'
import { useState,useEffect } from 'react'
import { useRegisterMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import FormContainer from '../components/FormContainer'
import Loader from '../components/Loader'
import { useDispatch,useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const RegisterScreen = () => {

    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, {isLoading}] = useRegisterMutation();

    const {userInfo} = useSelector((state) => state.auth);

    const {search} = useLocation();
    const searchParams = new URLSearchParams(search);
    const redirect = searchParams.get('redirect') || '/';

    useEffect(() => {
        if(userInfo){
            navigate(redirect);
        }
    },[userInfo,navigate,redirect]);

    const submitHandler = async(e) => {
        e.preventDefault();
        if(password !== confirmPassword){
            toast.error('Password does not match');
            return;
        } else {
            try{
                const res = await register({email,name,password}).unwrap();
                dispatch(setCredentials({...res}));
                navigate(redirect);
            } catch(err) {
                toast.error(err?.data?.message || err.error);
            }
        }
    }

  return (
    <FormContainer>
        <h1>Sign Up</h1>
        <Form onSubmit={submitHandler} >
            <Form.Group controlId='name' className='my-3'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                    placeholder='Enter name'
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId='email' className='my-3'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                    type='email'
                    placeholder='Enter email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
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

            <Form.Group controlId="confirmPassword" className="my-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-2" disabled={isLoading}>
                Sign Up
            </Button>

            {isLoading && <Loader />}

            <Row className="py-3">
                <Col>
                    Alreadu an User?{" "}
                    <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
                    Login
                    </Link>
                </Col>
            </Row>
        </Form>
    </FormContainer>
  )
}

export default RegisterScreen
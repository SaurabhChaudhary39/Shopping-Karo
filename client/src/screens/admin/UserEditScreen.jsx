import { useState,useEffect } from "react"
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader"
import Message from "../../components/Message"
import { Form, Button } from "react-bootstrap";
import {Link, useNavigate, useParams} from 'react-router-dom'
import {toast} from "react-toastify"
import { useGetUserDetailsQuery, useUpdateUserMutation } from "../../slices/usersApiSlice";


const UserEditScreen = () => {
    const {id : userId} = useParams();

    const [name,setName] = useState('');
    const [email,setEmail] = useState(''); 
    const [isAdmin, setIsAdmin] = useState(false);

    const {data: user, isLoading, refetch,error} = useGetUserDetailsQuery(userId);

    const [updateUser , {isLoading: loadingUpdate}] = useUpdateUserMutation();

    const navigate = useNavigate();

    useEffect(() => {
        if(user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setIsAdmin(user.isAdmin);
        }
    },[user]);

    const submitHandler = async(e) => {
        e.preventDefault();
        try {
            await updateUser({userId, name, email, isAdmin});
            toast.success("User updated successfully");
            refetch();
            navigate('/admin/userlist');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

  return (
    <>
      <Link to='/admin/userlist' className="btn-light btn my-3">
        Go Back
      </Link>
      <FormContainer>
        <h2>Edit User</h2>

        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-1">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter user name"
              />
            </Form.Group>

            <Form.Group controlId="email" className="my-1">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group controlId="isAdmin" className="my-2">
                <Form.Check
                    type="checkbox"
                    label='Is Admin'
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                ></Form.Check>    
            </Form.Group>

            <Button type="submit" variant="primary" className="my-2">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}

export default UserEditScreen
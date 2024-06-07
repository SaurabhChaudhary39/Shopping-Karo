import {useState} from 'react'
import FormContainer from '../components/FormContainer';
import { Form, Button} from 'react-bootstrap';
import {saveShippingAddress} from '../slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = () => {

    const {shippingAddress} = useSelector((state) => state.cart);


    const [address,setAddress] = useState(shippingAddress?.address || "");
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
    const [city,setCity] =  useState(shippingAddress?.city || "");
    const [country, setCountry] = useState(shippingAddress?.country || "");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({address,city,postalCode,country}));
        navigate('/payment');
    };

  return (
    <FormContainer>
        <h1>Shipping </h1>

        <CheckoutSteps step1 step2 />

        <Form onSubmit={submitHandler}>
            <Form.Group controlId='address' className='my-2'>
                <Form.Label>Shipping Address</Form.Label>
                <Form.Control
                    type='text'
                    placeholder='Enter shipping address'
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />    
            </Form.Group>

            <Form.Group controlId='city' className='my-2'>
                <Form.Label>City</Form.Label>
                <Form.Control
                    type='text'
                    value={city}
                    placeholder='Enter city'
                    onChange={(e) => setCity(e.target.value)}
                />    
            </Form.Group>

            <Form.Group className='my-2' controlId='postalCode'>
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                    type='number'
                    value={postalCode}
                    placeholder='Enter postal code'
                    onChange={(e) => setPostalCode(e.target.value)}
                />
            </Form.Group>

            <Form.Group className='my-2' controlId='country'>
                <Form.Label>Country</Form.Label>
                <Form.Control
                    type='text'
                    value={country}
                    placeholder='Enter country'
                    onChange={(e) => setCountry(e.target.value)}
                />
            </Form.Group>

            <Button type='submit' variant='primary' className='my-2' >
                Proceed to Next
            </Button>
        </Form>
    </FormContainer>
  )
}

export default ShippingScreen

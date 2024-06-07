import { useEffect } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import {useNavigate, Link} from 'react-router-dom'
import {Row,Col,Card,Button,Image,ListGroup} from "react-bootstrap"
import CheckoutSteps from '../components/CheckoutSteps';
import { useCreateOrdersMutation } from '../slices/ordersApiSlice';
import Loader from "../components/Loader";
import Message from '../components/Message'
import {toast} from "react-toastify"
import { clearCartItems } from '../slices/cartSlice';


const PlaceOrderScreen = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [createOrder, {isLoading, error}] = useCreateOrdersMutation();

  const {shippingAddress,
    paymentMethod,
    cartItems, 
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useSelector((state) => state.cart);

  useEffect(() => {
    if(!shippingAddress.address){
      navigate('/shipping');
    } else if (!paymentMethod){
      navigate('/payment');
    }
  },[paymentMethod,shippingAddress.address,navigate]);

  const placeOrderHandler = async() => {
    try{
      const res = await createOrder({
        shippingAddress,
        paymentMethod,
        orderItems: cartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err.data?.message || err.error || "An error occurred");
    }

  }

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {shippingAddress.address}, {shippingAddress.city}{" "}
                {shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cartItems.map((item,index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image 
                            src={item.image}
                            alt={item.name}
                            fluid rounded
                          />  
                        </Col>
                        <Col>
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items Cost: </Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping Cost: </Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax Cost: </Col>
                  <Col>${taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total Cost: </Col>
                  <Col>${totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                {error && <Message variant='danger'>{error.data?.message || error.error || "An error occurred"}</Message>}
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cartItems.length===0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button> 
                {isLoading && <Loader/>} 
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen;
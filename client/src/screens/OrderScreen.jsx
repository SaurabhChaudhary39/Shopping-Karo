import {Link, useParams} from "react-router-dom";
import {Row,Col,Button,Card,ListGroup,Image} from 'react-bootstrap';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {useGetOrderdeatilsQuery, useGetPayPalClientIdQuery, usePayOrderMutation, useDeliverOrderMutation} from "../slices/ordersApiSlice";
import {PayPalButtons, usePayPalScriptReducer} from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";
import { useEffect } from "react";


const OrderScreen = () => {

    const {id:orderId} = useParams();

    const {data: order, isLoading, refetch, error} = useGetOrderdeatilsQuery(orderId);

    const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation();

    const [{isPending}, paypalDispatch ] = usePayPalScriptReducer();

    const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation();

    const {data: paypal,isLoading: loadingPayPal, errorPayPal } = useGetPayPalClientIdQuery();

    const {userInfo} = useSelector((state) => state.auth );

    useEffect(() => {
        if(!errorPayPal && !loadingPayPal && paypal.clientId){
           const loadPayPalScript = async () => {
            paypalDispatch({
                type: 'resetOptions',
                value: {
                    'client-id': paypal.clientId,
                    currency: 'USD',
                }
            });
            paypalDispatch({type: 'setLoadingStatus', value: 'pending'});
           }
           if(order && !order.isPaid) {
            if(!window.paypal){
                loadPayPalScript();
            }
           } 
        }
    },[order,paypal,paypalDispatch,loadingPayPal,errorPayPal]);

    // async function onApprovedTest () {
    //     await payOrder({orderId,details: {payer: {}}});
    //     refetch();
    //     toast.success('Payment successful');
    // };


    function onApprove (data,actions) {
        return actions.order.capture().then(async function (details) {
            try{
                await payOrder({orderId,details}).unwrap();
                refetch();
                toast.success('Payment successful');
            } catch(err){
                toast.error(err?.data?.message || err.message);
            }
        });
    }

    function onError(err) {
        toast.error(err.message);
    }

    function createOrder(data,actions) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice,
                        currency: 'USD',
                    },
                },
            ],
        })
    }

    const deliverOrderHandler = async () => {
        try {
            await deliverOrder(orderId);
            refetch();
            toast.success('Order Delivered');
        } catch (err) {
            toast.error(err?.data?.message || err.message)
        }
    }

  return isLoading ? <Loader /> : error ? ( <Message variant='danger'>{error?.data?.message || error.error}</Message> 
  ) : (
    <>
        <h1>Order {orderId}</h1>
        <Row>
            <Col md={8}>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <p>
                            <strong>Name: </strong> {order.user.name}
                        </p>
                        <p>
                            <strong>Email: </strong>{order.user.email}
                        </p>
                        <p>
                            <strong>Address: </strong> 
                            {order.shippingAddress.address}, {order.shippingAddress.postalCode} {order.shippingAddress.city}, {order.shippingAddress.country} 
                        </p>
                        {order.isDelivered ? (
                            <Message variant='success'>Deliverd on {order.deliveredAt}</Message>
                        ) : (
                            <Message variant='danger'>Not Deliverd</Message>
                        )}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <p>
                            <strong>Payment Method: </strong>
                            {order.paymentMethod}
                        </p>
                        {order.isPaid ? (
                            <Message variant='success'>Paid on {order.paidAt}</Message>
                        ): (
                            <Message variant='danger'>Not Paid</Message>
                        )}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Order Items: </h2>
                        {order.orderItems.map((item,index) => (
                            <ListGroup.Item key={index}>
                                <Row>
                                    <Col md={1}>
                                        <Image src={item.image} alt={item.name}  fluid rounded/>
                                    </Col>
                                    <Col>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={4}>
                                        {item.qty} x ${item.price} = ${item.qty*item.price}
                                    </Col> 
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup.Item>
                </ListGroup>
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Order Summary: </h2>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Items Cost: </Col>
                                <Col>${order.itemsPrice}</Col>
                            </Row>
                            <Row>
                                <Col>Shipping Cost: </Col>
                                <Col>${order.shippingPrice}</Col>
                            </Row>
                            <Row>
                                <Col>Tax Cost: </Col>
                                <Col>${order.taxPrice}</Col>
                            </Row>
                            <Row>
                                <Col>Total Cost: </Col>
                                <Col>${order.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}

                                    {isPending ? <Loader /> : (
                                        <div>
                                            {/* <Button onClick={onApprovedTest} style={{
                                                marginBottom: '10px'
                                            }}>Test Pay Order</Button> */}  
                                            <div>
                                                <PayPalButtons
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                ></PayPalButtons>    
                                            </div>
                                        </div>
                                    )} 
                                </ListGroup.Item>
                            )}
                        </ListGroup.Item>

                        {loadingDeliver && <Loader/>}

                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroup.Item>
                                <Button type="button" className="btn btn-block" onClick={deliverOrderHandler}>
                                    Mark As Delivered
                                </Button>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </>
  );
}

export default OrderScreen
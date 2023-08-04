import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import MetaData from '../layout/MetaData';
import CheckOutStep from './CheckOutStep';
import { Typography } from '@material-ui/core';
import { Link,useNavigate } from 'react-router-dom';
import './ConfirmOrder.css'


const ConfirmOrder = () => {
    const history=useNavigate();
    const {shippingInfo,cartItems} = useSelector((state) => state.cart);
    const {user } =useSelector((state) => state.user);

    const subtotal = cartItems.reduce(
        (sum,i) => sum + i.quantity*i.price,0
    );

    const shippingCharges = subtotal > 1000 ? 0 : 100;

    const tax = subtotal * 0.18;

    const totalPrice = subtotal + shippingCharges + tax; 

    const address = `${shippingInfo.address}, ${shippingInfo.pincode}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country}`;

    const PaymentHandler = () => {
        const data = {
            subtotal,
            shippingCharges,
            tax,
            totalPrice,
        }

        sessionStorage.setItem("orderInfo",JSON.stringify(data));
        history("/process/payment");
    }
  return (
    <Fragment>
        <MetaData title="Confirm Order"/>
        <CheckOutStep activeStep={1}/>
        <div className='confirmOrderPage'>
            <div>
               <div className='confirmshippingArea'>
                  <Typography >Shipping Info</Typography>
                  <div className='confirmshippingAreaBox'>
                    <div>
                        <p>Name:</p>
                        <span>{user.name}</span>
                    </div>
                    <div>
                        <p>Phone:</p>
                        <span>{shippingInfo.phoneNo}</span>
                    </div>
                    <div>
                        <p>Address:</p>
                        <span>{address}</span>
                    </div>
                  </div>
               </div>

               <div className='confirmCartItems'>
                   <Typography>Your Cart Items :</Typography>
                   <div className='confirmClassItemsContainer'>
                    {cartItems && cartItems.map((item)=>(
                        <div key={item.product}>
                            <img src={item.image} alt='Product'/>
                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                            <span>
                                {item.quantity} X ₹{item.price} = <b>₹{item.quantity * item.price}</b>
                            </span>
                        </div>

                    ))}
                   </div>
               </div>
            </div>
            <div className='orderSummary'>
                <Typography>Order Summary</Typography>
                <div>
                    <p>Subtotal:</p>
                    <span>₹{subtotal}</span>
                </div>
                
                <div>
                    <p>Shipping Charges:</p>
                    <span>₹{shippingCharges}</span>
                </div>

                <div>
                    <p>GST:</p>
                    <span>₹{tax}</span>
                </div>
                <div className='orderSummaryTotal'>
                <p><b>Total</b></p>
                <span>₹{totalPrice}</span>
            </div>

            <button onClick={PaymentHandler}>Proceed to Payment</button>
            </div>

            
        </div>
    </Fragment>
  )
}

export default ConfirmOrder
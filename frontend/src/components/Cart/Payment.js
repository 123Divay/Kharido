import React, { Fragment, useEffect, useRef } from 'react'
import MetaData from '../layout/MetaData'
import CheckOutStep from './CheckOutStep'
import { Typography } from '@material-ui/core'
import { CreditCard, Event, VpnKey } from '@material-ui/icons'
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js'
import './Payment.css'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { clearErrors } from '../../actions/productAction'
import { createOrder } from '../../actions/orderAction'


const Payment = () => {
    const dispatch = useDispatch();
    const history = useNavigate()
    const alert=useAlert();
    const stripe = useStripe();
    const elements = useElements();

    const {shippingInfo,cartItems} = useSelector((state)=> state.cart);
    const {user} = useSelector((state) => state.user);
    const {error} = useSelector((state) => state.newOrder);
    
    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));

    const payBtn = useRef(null); 

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice *100)
    }

    const order ={
        shippingInfo,
        orderItems:cartItems,
        itemPrice:orderInfo.subtotal,
        taxPrice:orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice,
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        payBtn.current.disable = true;

        try{
            const config = {
                headers: {
                    "Content-type" : "application/json",
                }
            };

            const {data} = await axios.post(
                "/api/v1/process/payment",
                paymentData,
                config
            )

            const client_secret = data.client_secret;

            if(!stripe || !elements) return;

            const result =await stripe.confirmCardPayment(client_secret , {
                payment_method: {
                    card : elements.getElement(CardNumberElement),
                    billing_details:{
                        name:user.name,
                        email:user.email,
                        address:{
                            line1:shippingInfo.address,
                            postal_code:shippingInfo.pincode,
                            city:shippingInfo.city,
                            state:shippingInfo.state,
                            country:shippingInfo.country,
                        }
                    }
                }
            }) 

            if(result.error){
                payBtn.current.disable = false;
            alert.error(result.error.message);
            }
            else{
                if(result.paymentIntent.status === "succeeded"){
                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                    };
            
                    dispatch(createOrder(order));

                    history("/success");
                }
                else{
                    alert.error("Some issue while processing payment");
                }
            }

        }
        catch (error ){
            payBtn.current.disable = false;
            alert.error(error.response.data.message);
        }
    };


    useEffect(() =>{
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
    },[dispatch,error,alert])


  return (
    <Fragment>
        <MetaData title="Payment"></MetaData>
        <CheckOutStep activeStep={2}/>

        <div className='paymentContainer'>
            <form className='paymentForm' onSubmit={(e) => submitHandler(e)}>
                <Typography>Card Info</Typography>
                <div>
                    <CreditCard/>
                    <CardNumberElement className='paymentInput'/>
                </div>
                
                <div>
                    <Event/>
                    <CardExpiryElement className='paymentInput'/>
                </div>

                <div>
                    <VpnKey/>
                    <CardCvcElement className='paymentInput'/>
                </div>

                <input 
                    type='submit'
                    value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
                    ref={payBtn}
                    className='paymentFormBtn'/>
            </form>
        </div>
    </Fragment>
  )
}

export default Payment
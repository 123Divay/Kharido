import React, { Fragment, useState } from 'react'
import './Shipping.css';
import MetaData from '../layout/MetaData';
import { PinDrop,LocationCity,Public,Phone,TransferWithinAStation } from '@material-ui/icons';
import HomeIcon from '@material-ui/icons/Home';
import {Country,State} from 'country-state-city'
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import CheckOutStep from './CheckOutStep.js'
import { saveShippingInfo } from '../../actions/cartAction';
import { useNavigate } from 'react-router-dom';


const Shipping = () => {

    const history =useNavigate();

    const dispatch=useDispatch();
    const alert = useAlert();
    const {shippingInfo} =useSelector((state) => state.cart);

    const [address , setAddress] = useState(shippingInfo.address);
    const [pincode , setPincode] = useState(shippingInfo.pincode);
    const [city , setCity] = useState(shippingInfo.city);

    const [state , setState] = useState(shippingInfo.state);
    const [country , setCountry] = useState(shippingInfo.country);
    const [phoneNo , setPhoneNo] = useState(shippingInfo.phoneNo);

    const shippingSubmit = (e) => {
        e.preventDefault();

        if(phoneNo.toString().length !== 10){
            alert.error("Phone Number should be of 10 digits");
            return;
        }

        dispatch(
            saveShippingInfo({address,city,state,country,pincode,phoneNo})
        )
        history("/order/confirm");
    }

  return (
    <Fragment>
        <MetaData title="Shipping Details"/>

        <CheckOutStep activeStep={0}/>
        <div className='shippingContainer'>
            <div className='shippingBox'>
                <h2 className='shippingHeading'>Shipping Details</h2>

                <form className='shippingForm' encType='multipart/from-data' onSubmit={shippingSubmit}>

                    <div>
                        <HomeIcon/>
                        <input 
                           type='text'
                           placeholder='Address'
                           required
                           value={address}
                           onChange={(e) => setAddress(e.target.value)}/>
                    </div>

                    <div>
                        <LocationCity/>
                        <input 
                           type='text'
                           placeholder='City'
                           required
                           value={city}
                           onChange={(e) => setCity(e.target.value)}/>
                    </div>

                    <div>
                        <PinDrop/>
                        <input 
                           type='number'
                           placeholder='Pincode'
                           required
                           value={pincode}
                           onChange={(e) => setPincode(e.target.value)}/>
                    </div>

                    <div>
                        <Phone/>
                        <input 
                           type='number'
                           placeholder='Phone Number'
                           required
                           value={phoneNo}
                           onChange={(e) => setPhoneNo(e.target.value)}
                           size='10'/>
                    </div>


                    <div>
                        <Public/>
                        <select
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}>
                            <option value="">Country</option>

                            {Country && 
                            Country.getAllCountries().map((item)=>(
                                <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                            ))}
                        </select>
                    </div>

                    {country && (
              <div>
                <TransferWithinAStation/>

                <select
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">State</option>
                  {State &&
                    State.getStatesOfCountry(country).map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <input
              type="submit"
              value="Continue"
              className="shippingBtn"
              disabled={state ? false : true}
            />

            </form>
            </div>
        </div>
    </Fragment>
  )
}

export default Shipping
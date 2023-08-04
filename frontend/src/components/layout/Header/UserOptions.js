import React, { Fragment, useState } from 'react'
import "./Header.css"
import { SpeedDial,SpeedDialAction } from '@material-ui/lab'
import Profile from "../../../image/Profile.png"
import { Backdrop } from '@material-ui/core'
import DashboardIcon from "@material-ui/icons/Dashboard"
import PersonIcon from "@material-ui/icons/Person"
import ExitToAppIcon  from '@material-ui/icons/ExitToApp'
import ListAltIcon from "@material-ui/icons/ListAlt";
import { ShoppingCart } from '@material-ui/icons'
import { useNavigate } from 'react-router-dom';
import { ReactLocation, Router } from 'react-location'
import { useAlert } from 'react-alert'
import {logout} from '../../../actions/userAction'
import { useDispatch, useSelector } from 'react-redux'
const location = new ReactLocation()
 

const UserOptions = ({user}) => {
  const history = useNavigate();
  const alert=useAlert();

    const {cartItems} = useSelector((state)=>state.cart)
    const [open,setOpen] = useState(false);
    const dispatch = useDispatch();

    const options = [
      {icon:<ListAltIcon/> , name:"Orders" , func:orders},
      {icon:<PersonIcon/>, name:"Profile" , func:account},
      {icon:<ShoppingCart style={{color: cartItems>0? "tomato":"unset"}}/>,name:`Cart(${cartItems.length})` ,func:cart},
      {icon:<ExitToAppIcon/> , name:"Logout" , func:logoutUser},
    ];

    if(user.role==="admin"){
      options.unshift({icon:<DashboardIcon/> , name:"Dashboard" , func:dashboard});
    }

    function dashboard(){
      history("/admin/dashboard");
    }

    function orders(){
      history("/orders");
    }

    function account(){
      history("/account");
    }

    function cart(){
      history("/Cart");
    }

    function logoutUser(){
      dispatch(logout());
      alert.success("Logout successfully");
    }

  return (
    <Fragment>
        <Backdrop open={open} style={{zIndex:"10"}}/>
        <SpeedDial
          ariaLabel='SpeedDial tooltip example'
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          className='speedDial'
          style={{zIndex:"11"}}
          open={open}
          direction='down'
          icon={<img
                 className='speedDialIcon'
                 
                 src={(user.avatar && user.avatar.url)? user.avatar.url : Profile}
                alt='Profile'/>}>
           {options.map((item)=>(
            <SpeedDialAction key={item.name} icon={item.icon} tooltipTitle={item.name} onClick={item.func} tooltipOpen={window.innerWidth<=600? true: false}/>
           ))}
        </SpeedDial>
    </Fragment>
  )
}

export default UserOptions

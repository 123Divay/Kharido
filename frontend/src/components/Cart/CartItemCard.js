import React from 'react'
import './CartItemCard.css'
import { Link } from 'react-router-dom'
import { removeItemFromCart } from '../../actions/cartAction'
import { useDispatch } from 'react-redux'

const CartItemCard = ({item}) => {
  const dispatch = useDispatch();
  const deleteCartItem= (id) =>{
    dispatch(removeItemFromCart(id));
  }
  return (
    <div className='CartItemCard'>
        <img src={item.image} alt='image'/>
        <div>
            <Link to={`/product/${item.product}`}>{item.name}</Link>
            <span>{`Price: ₹${item.price}`}</span>
            <p onClick={() => deleteCartItem(item.product)}>Remove</p>
        </div>
    </div>
  )
}

export default CartItemCard
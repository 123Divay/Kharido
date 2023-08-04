import React, { Fragment,useEffect } from 'react';
import {CgMouse} from "react-icons/all";
import "./Home.css"
import ProductCard from "./ProductCard.js"
import MetaData from "../layout/MetaData.js"
import {clearErrors, getProduct} from '../../actions/productAction.js'
import { useSelector,useDispatch } from 'react-redux';
import { unstable_useBlocker } from 'react-router-dom';
import Loader from '../layout/Loader/Loader';
import {useAlert} from 'react-alert';



const product={
    name:"Blue Tshirt",
    images: [{url:"https://i.pinimg.com/originals/3e/e3/dc/3ee3dc6405026c801bf6b87840488b68.png"}],
    price:"$30",
    _id:"abhishek"
}

const Home = () => {

    const alert = useAlert();

    const dispatch = useDispatch();
    const {loading,error,products,productsCount} = useSelector((state)=>state.products);

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        dispatch(getProduct());
    },[dispatch,error,alert]);

  return (
    <Fragment>
        {loading?(<Loader/>):(
            <Fragment>
        <MetaData title="KHARIDO"/>
        <div className='banner'>
            <p>Welcome to Kharido</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

            <a href="#container">
                <button>
                    Scroll < CgMouse/>

                </button>
            </a>

        </div>

        <h2 className='homeHeading'>Featured Products</h2>

        <div className='container' id="container">
            
            {products && products.map((product)=><ProductCard product={product}/>)}
        </div>
        </Fragment>)
}
    </Fragment>
  
  )
}

export default Home
import React, { Fragment, useState } from 'react'
import './Search.css';
import { Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import MetaData from '../layout/MetaData.js'
const history = createBrowserHistory();

const Search = () => {
    const [keyword,setKeyword] = useState("");

    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if(keyword.trim()){
            history.push(`/products/${keyword}`);
            
        }
        else{
            history.push(`/products`);
         
        }
        window.location.reload();
    }


  return (
    <Fragment>
        <MetaData title="SEARCH A PRODUCT -- KHARIDO" />
        <form className='searchBox' onSubmit={searchSubmitHandler}>
            <input 
            type='text' 
            placeholder='Search a Product ...' 
            onChange={(e)=>setKeyword(e.target.value)}/>
            <input type='submit' value="Search" />

        </form>
    </Fragment>
  )
}

export default Search
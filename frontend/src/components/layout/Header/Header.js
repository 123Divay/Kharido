import React from "react";
import ReactDOM from "react-dom";
import {ReactNavbar} from "overlay-navbar"
import logo from "../../../image/logo.png"
import {MdAccountCircle } from "react-icons/md";
import {MdSearch } from "react-icons/md";
import {MdAddShoppingCart } from "react-icons/md";




const Header = () =>{
        
  return <ReactNavbar

          burgerColorHover="#eb4034"
          logo = {logo}
          logoWidth="20vmax"
          navColor1="white"
          logoHoverSize="10px"
          logoHoverColor="#eb4034"
          link1Text="Home"
          link2Text="Products"
          link3Text="Contact"
          link4Text="About"
          link1Url="/"
          link2Url="/products"
          link3Url="/contact"
          link4Url="/about"
          link1Size="1.3vmax"
          link1Color="rgba(35,35,35,0.8)"
          nav1justifyContent="flex-end"
          nav2justifyContent="flex-end"
          nav3justifyContent="flex-start"
          nav4justifyContent="flex-start"
          link1ColorHover="#eb4034"
          link2ColorHover="#eb4034"
          link3ColorHover="#eb4034"
          link4ColorHover="#eb4034"
          link1Margin="1vmax"
          
          profileIcon="true"
  profileIconColor= "rgba(35, 35, 35,0.8)"
  ProfileIconElement={ MdAccountCircle} 
  profileIconColorHover="#eb4034"
  profileIconMargin="1vmax"
  profileIconUrl="/login"
  searchIcon="true"
  searchIconColor= "rgba(35, 35, 35,0.8)"
  searchIconColorHover="#eb4034"
  searchIconMargin="1vmax"
  SearchIconElement={MdSearch}
  cartIcon="true"
  cartIconColor= "rgba(35, 35, 35,0.8)"
  cartIconColorHover="#eb4034"
  cartIconMargin="1vmax"
  CartIconElement={MdAddShoppingCart}


  />;
}

export default Header

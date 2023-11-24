import React from "react";
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping} from "@fortawesome/free-solid-svg-icons";
import './button.css'
import { useNavigate } from 'react-router-dom';

import '../UI/navbarPharma.css'
export const Navbar=()=>{
    const navigate = useNavigate();
    const back =()=>  navigate(-1);
    return(
<div className="navbar">
<button className="btn"  onClick={back}>back</button>
    <div className="links">
<Link to="/cart">
    <FontAwesomeIcon icon={faCartShopping} fontSize={'35px'}/>
</Link>
    </div>
</div>
    );
};
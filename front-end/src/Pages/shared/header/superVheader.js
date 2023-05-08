// import image
import { Link } from "react-router-dom";
import '../../../css/superVheader.css'
import { getAuthUser } from "../../../helper/Storage";
import React, { useEffect, useState } from "react";
import axios from 'axios'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


export const SvHeader = () => {

  const auth = getAuthUser();

  const [supervisor, setSupervisor] = useState({
      loading: true,
      results: [],
      err: null,
      reload: 0
    });
   
    useEffect(() => {
      setSupervisor({ ...supervisor, loading: true })
  
      axios
        .get('http://localhost:5000/superviser/User/'+ auth.id,{
          header:{
            token: auth.token
          }
        })
        .then(resp => {
          console.log(resp);
          setSupervisor({ ...supervisor, results: resp.data.supervisor, loading: false })
        })
        .catch(err => {
          setSupervisor({ ...supervisor, err: "Something went wrong", loading: false })
  
        })
    }, [])


  return (
    <>
      <nav >
        <div >
          <DropdownButton className="navbar" id="dropdown-basic-button" variant="" title="Menu" >
      <Dropdown.Item ><Link to={'/svhome'} >Home</Link></Dropdown.Item>
      <Dropdown.Item > <Link to={'/SvProductList/'+ supervisor.results.id} >Products</Link></Dropdown.Item>
      <Dropdown.Item > <Link to={'/'} >LogOut</Link></Dropdown.Item>
    </DropdownButton>
        </div>
      </nav>
    </>
  );
};

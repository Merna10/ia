// import image
import { Link } from "react-router-dom";
import '../../../css/superVheader.css'
import { getAuthUser } from "../../../helper/Storage";
import React, { useEffect, useState } from "react";
import axios from 'axios'


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

          <ul >
          <li >
              <Link to={'/svhome'} >Home</Link>
            </li>
            <li >
              <Link to={'/SvProductList/'+ supervisor.results.id} >Products</Link>
            </li>
            <li >
              <Link to={'/supervisorHistory/' + supervisor.results.id}>Requests</Link>
            </li>
            <li className="nav-item2" >
            <Link to={'/'} >LogOut</Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

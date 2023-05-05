import { AdminHeader } from "../../Pages/shared/header/admiHeader";
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";
import React, { useRef, useState } from "react";

import'../../css/register.css'


export const AddSuberv = () => {
  
  const auth = getAuthUser();
  const [user, setUser] = useState({
    email: "",
    password: "",
    phone: "",
    status: "",
    type: "",
    err: [],
    loading: false,
    success: null,
  });

  const createUser = (e)=>{
    e.preventDefault();
    setUser({ ...user, loading: true });

    

    axios
    .post("http://localhost:5000/auth/register",{
      email:user.email,
      password:user.password,
      phone:user.phone,
      status:user.status,
      type:user.type
    },{
      headers:{
        token: auth
      }
    }).then((resp)=>{
      setUser({
        email: "",
    password: "",
    phone: "",
    status: "",
    type: "",
    err: "",
    loading: false,
    success: "User Created successfully",
      })
    }).catch((err)=>{
      setUser({
        
    loading: false,
    success:null,
    err: err.response.data.errors,
  })
    })
  }

  return (
    <><AdminHeader/>
    <div className='register'>
      <br></br>
    <div className='register1'>
      

    
      <h1>Add Subervisor</h1>

      <>
      {user.err && Array.isArray(user.err) && user.err.map((error, index) => (
              <Alert key={index} variant='danger' className='p-2'>
                {error.msg}
              </Alert>
            ))}

            {user.success && (
              <Alert variant="success" className="p-2">
                {user.success}
              </Alert>
            )}
      </>
      <Form  onSubmit={createUser}>
        <Form.Group className="mb-3">
          <Form.Control
            value={user.email}
            type="email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
            style={{width:'  15cm'}}
            placeholder="Email"
          />
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Control
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            type="password"
            required
            style={{width:'  15cm'}}
            placeholder="password"
          />
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Control
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            style={{width:'  15cm'}}
            type="phone"
            required
            placeholder="phone"
          />
        </Form.Group>
        <Form.Group className="mb-3">
        <Form.Control
            value={user.status}
            onChange={(e) => setUser({ ...user, status: e.target.value })}
            style={{width:'  15cm'}}
            type="text"
            required
            placeholder="status"
          />
        </Form.Group>
        <Form.Group className="mb-3">
        <Form.Control
            value={user.type}
            onChange={(e) => setUser({ ...user, type: e.target.value })}
            style={{width:'  15cm'}}
            type="text"
            placeholder="type"
          />
        </Form.Group>

        <Button variant="dark"  type="submit">
          Add New User
        </Button>
      </Form>
    
    </div></div> 
    
    </>
  );
}

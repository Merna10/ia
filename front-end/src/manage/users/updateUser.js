import { AdminHeader } from "../../Pages/shared/header/admiHeader";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { getAuthUser } from "../../helper/Storage";
import'../../css/register.css'

export const UpdateUser = () => {

  let { id } = useParams();
  const auth = getAuthUser();


  const [user, setUser] = useState({
    email: "",
    password:"",
    phone: "",
    status: "",
    type: "",
    err: [],
    loading: false,
    reload: false,
    success: null,
  });


  const updateUser = (e) => {
    e.preventDefault();
    setUser({ ...user, loading: true });
    axios
      .put("http://localhost:5000/auth/update/" + id, {
        email: user.email,
        password: user.password,
        phone: user.phone,
        status: user.status,
        type: user.type
      }, {
        headers: {
          token: auth.token
        }
      }).then((resp) => {
        setUser({
          ...user,
          loading: false,
          success: "user updated successfully !",
          reload: user.reload + 1,
        })
      }).catch((err) => {
        setUser({

          loading: false,
          success: null,
          err: err.response.data.errors,

        })
      })
  }

  
  useEffect(() => {
    axios
    .get("http://localhost:5000/auth/getUser/" + id,{
      headers:{
        token: auth.token
      }
    })

      .then((resp) => {
        console.log(resp);
        setUser({
          ...user,
          email: resp.data.user.email,
          phone: resp.data.user.phone,
          status: resp.data.user.status,
          type: resp.data.user.type,
        });
      })
      .catch((err) => {
        setUser({
          ...user,
          loading: false,
          success: null,
          err: "Something went wrong!",
        });
      });
  }, [user.reload]);

  return (
    <><AdminHeader />
      <div className='updateSv'>
        <br></br>
        <div className='updateSv1'>
          <div className="login-container w-75 ">
            <h1>Update User Form</h1>

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

            <Form onSubmit={updateUser}>
             
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
                  type="password"
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  required
                  style={{width:'  15cm'}}
                  maxLength="16" 
                  minLength="8"
                  placeholder="fill it with your orignal password if you won't change it "
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  maxLength="11" 
                  minLength="11"
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

              <Button  variant="dark" type="submit">
                Update user
              </Button>
            </Form>
          </div>

         
        </div></div>
    </>
  );
}

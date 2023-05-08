import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import { setAuthUser } from '../../helper/Storage';
import { useNavigate } from 'react-router-dom';

import '../../css/login.css';

export const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    email: '',
    password: '',
    loading: false,
    err: [],
  });

  const loginFun = (e) => {
    e.preventDefault();
    setLogin({ ...login, loading: true, err: [] });
    axios
      .post('http://localhost:5000/auth/login', {
        email: login.email,
        password: login.password,
      })
      .then((resp) => {
        setLogin({ ...login, loading: false, err: [] });
        setAuthUser(resp.data);
        if (resp.data.type === 'supervisor') {
          navigate('/svhome');
        } else {
          navigate('/adminhome');
        }
      })
      .catch((errors) => {
        setLogin({
          ...login,
          loading: false,
          err: errors.response.data.errors,
        });
      });
  };

  return (
    <div className='login'>
      <br />
      <div className='login1'>
        {login.err.map((error, index) => (
          <Alert key={index} variant='danger' className='p-2'>
            {error.msg}
          </Alert>
        ))}
        <Form onSubmit={loginFun}>
          <Form.Group className='mb-3'>
          <Form.Label>Email</Form.Label>
            <Form.Control
              type='email'
              placeholder='Email'
              required
              style={{width:'  10cm'}}
              value={login.email}
              onChange={(e) =>
                setLogin({ ...login, email: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className='mb-3'>
          <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Password'
              required
              style={{width:'  10cm'}}
              value={login.password}
              onChange={(e) =>
                setLogin({ ...login, password: e.target.value })
              }
            />
          </Form.Group>

          <Button
            variant='primary'
            type='submit'
            style={{width:'  5cm'}}
            disabled={login.loading}>
            {login.loading ? 'Loading...' : 'Login'}
          </Button>
        </Form>
      </div>
    </div>
  );
};

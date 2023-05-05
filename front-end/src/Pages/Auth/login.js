// import React, { useState } from 'react';
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import '../../css/login.css';
// import Alert from 'react-bootstrap/Alert';
// import axios from 'axios'
// import { setAuthUser } from "../../helper/Storage";
// import { useNavigate } from "react-router-dom";

// export const Login = () => {

//   const navigate = useNavigate();
//   const [login, setLogin] = useState({
//     email: "",
//     password: "",
//     loading: false,
//     err: [],
//   });
//   const loginFun = (e) => {
//     e.preventDefault();
//     setLogin({ ...login, loading: true, err: [] });
//     axios
//       .post("http://localhost:5000/auth/login", {
//         email: login.email,
//         password: login.password,
//       })
//       .then((resp) => {
//         setLogin({ ...login, loading: false, err: [] });
//         setAuthUser(resp.data);
//         navigate('/adminhome');
//       })
//       .catch((errors) => {
//         setLogin({
//           ...login,
//           loading: false,
//           err: errors.response.data.errors,
//         });
//       });
//   };

//   return (

//     <div className='login' >
//       <br></br>
//       <div className='login1'>
//       <h1>Login Form</h1>
//       {login.err.map((error, index) => (
//         <Alert key={index} variant="danger" className="p-2">
//           {error.msg}
//         </Alert>
//       ))}
//         <Form onSubmit={loginFun}>

//           <Form.Group className="mb-3">
//             <Form.Control
//               type="email"
//               placeholder="Email"
//               required
//               value={login.email}
//               onChange={(e) => setLogin({ ...login, email: e.target.value })}
//             />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Control
//               type="password"
//               placeholder="Password"
//               required
//               value={login.password}
//               onChange={(e) => setLogin({ ...login, password: e.target.value })}
//             />
//           </Form.Group>

//           <Button
//             className="btn btn-dark w-100"
//             variant="primary"
//             type="submit"
//             disabled={login.loading === true}>
//             Login
//           </Button>
//         </Form>
//       </div>
//     </div>
//   );
// }

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
        <h1>Login</h1>
        {login.err.map((error, index) => (
          <Alert key={index} variant='danger' className='p-2'>
            {error.msg}
          </Alert>
        ))}
        <Form onSubmit={loginFun}>
          <Form.Group className='mb-3'>
            <Form.Control
              type='email'
              placeholder='Email'
              required
              value={login.email}
              onChange={(e) =>
                setLogin({ ...login, email: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className='mb-3'>
            <Form.Control
              type='password'
              placeholder='Password'
              required
              value={login.password}
              onChange={(e) =>
                setLogin({ ...login, password: e.target.value })
              }
            />
          </Form.Group>

          <Button
            className='btn btn-dark w-100'
            variant='primary'
            type='submit'
            disabled={login.loading}>
            {login.loading ? 'Loading...' : 'Login'}
          </Button>
        </Form>
      </div>
    </div>
  );
};

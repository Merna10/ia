
import "../css/supervCard.css";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import Card from 'react-bootstrap/Card';
import { getAuthUser } from "../helper/Storage";
import axios from "axios";
import Alert from 'react-bootstrap/Alert';
import { useParams } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
export const User = (props) => {
 
  let { id } = useParams();
  const auth = getAuthUser();

  const [users, setUsers] = useState({
    loading: true,
    results: [],
    err : [],
    success: '',
    reload: false
  });
 
  // delete Function
  const DeleteFun = (id) => {
    axios
      .delete("http://localhost:5000/auth/delete/" + id, {
        headers: {
          token: auth.token,
        },
      })
      .then((resp) => {
        setUsers((prevState) => ({
          ...prevState,
          reload: true,
          success:"deleted successfully"
        }));
      })
      .catch((err) => {
        setUsers((prevState) => ({
          ...prevState,
          loading: false,
          err: err.response.data.errors,
        }));
      });
  }

  return (
    <div>
      <>
        {users.err.map((error, index) => (
          <Alert key={index} variant='danger' className='p-2'>
            {error.msg}
          </Alert>
        ))}

        {users.success && (
          <Alert variant="success" className="p-2">
            {users.success}
          </Alert>
        )}
      </>
     
      <Card className="userCard">
      <DropdownButton className="userdr" variant="" >
      <Dropdown.Item ><Link  to={'/assign/'+ props.id}>Assign</Link></Dropdown.Item>
      <Dropdown.Item ><Link  to={'/updateUser/'+ props.id }>Update</Link></Dropdown.Item>
      <Dropdown.Item > <Link to={'/userList'} onClick={(e) => { DeleteFun(props.id) }} >Delete</Link></Dropdown.Item>
    </DropdownButton>
    
        <Card.Body>
          <Card.Title>ID: {props.id}</Card.Title>
          
          <Card.Text >Email: {props.email}</Card.Text>
          <Card.Text>
            Phone: {props.phone}
          </Card.Text>
          <Card.Text>
            Status: {props.status}
          </Card.Text>
          <Card.Text>
            Type: {props.type}
          </Card.Text>
          </Card.Body>
      </Card>
    </div> 
  );
};

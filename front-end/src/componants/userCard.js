
import "../css/supervCard.css";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import Card from 'react-bootstrap/Card';
import { getAuthUser } from "../helper/Storage";
import axios from "axios";
import Alert from 'react-bootstrap/Alert';
import { useParams } from "react-router-dom";


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
        <Card.Body>
          <Card.Title>User ID: {props.id}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Email: {props.email}</Card.Subtitle>
          <Card.Text>
            Phone: {props.phone}
          </Card.Text>
          <Card.Text>
            Status: {props.status}
          </Card.Text>
          <Card.Text>
            Type: {props.type}
          </Card.Text>
          <Link className="btn btn-sm btn-primary mx-2 " to={'/assign/'+ props.id}>Assign</Link>
          <Link className="btn btn-sm btn-warning mx-2 " to={'/updateUser/'+ props.id }>Update</Link>
          <Link className="btn btn-sm btn-danger mx-2" to={'/userList'} onClick={(e) => { DeleteFun(props.id) }} >Delete</Link>
        </Card.Body>
      </Card>
    </div> 
  );
};

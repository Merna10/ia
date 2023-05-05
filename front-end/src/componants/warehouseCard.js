import "../css/warehouseCard.css";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { MdLocationPin,MdOutlinePermIdentity } from 'react-icons/md';
import Card from 'react-bootstrap/Card';
import { getAuthUser } from "../helper/Storage";
import axios from "axios";
import Alert from 'react-bootstrap/Alert';
import { useParams } from "react-router-dom";

export const Warehouse = (props) => {

  let { id } = useParams();
  const auth = getAuthUser();
  
  const [warehouse, setWarehouse] = useState({
    loading: true,
    results: [],
    err : [],
    success: '',
    reload: false
  });

  // delete Function
  const DeleteFun = (id) => {
    axios
      .delete("http://localhost:5000/warehouse/delete/" + id, {
        headers: {
          token: auth.token,
        },
      })
      .then((resp) => {
        setWarehouse((prevState) => ({
          ...prevState,
          reload: true,
          success:"deleted successfully"
        }));
      })
      .catch((err) => {
        setWarehouse((prevState) => ({
          ...prevState,
          loading: false,
          err: err.response.data.errors,
        }));
      });
  }

  return (
    <div>
       <Card className="warehouseCard">

       <>
        {warehouse.err.map((error, index) => (
          <Alert key={index} variant='danger' className='p-2'>
            {error.msg}
          </Alert>
        ))}

        {warehouse.success && (
          <Alert variant="success" className="p-2">
            {warehouse.success}
          </Alert>
        )}
      </>

      <Card.Body>
        <Card.Title><MdOutlinePermIdentity/>{props.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">ID: {props.id}</Card.Subtitle>
        <Card.Text>
          Status: {props.status}
        </Card.Text>
        <Card.Text><MdLocationPin/>
          Location: {props.location}
        </Card.Text>
        <Link className="btn btn-sm btn-primary mx-2" to={'/productList/'+ props.id }>View </Link>
        <Link className="btn btn-sm btn-warning mx-2" to={'/updatewh/'+ props.id }>Update </Link>
        <Link className="btn btn-sm btn-danger mx-2"  onClick={(e) => { DeleteFun(props.id) }} to={'/whList'}>Delete </Link>
      </Card.Body>
    </Card>
    </div>
    
  );
};

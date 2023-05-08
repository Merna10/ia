import "../css/warehouseCard.css";
import "../css/supervCard.css";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { MdLocationPin,MdOutlinePermIdentity } from 'react-icons/md';
import Card from 'react-bootstrap/Card';
import { getAuthUser } from "../helper/Storage";
import axios from "axios";
import Alert from 'react-bootstrap/Alert';
import { useParams } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

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
      
      <Card className="warehouseCard">
      <DropdownButton className="wareHdr" variant="" >
      <Dropdown.Item ><Link to={'/productList/'+ props.id }>View </Link></Dropdown.Item>
      <Dropdown.Item ><Link  to={'/updatewh/'+ props.id }>Update </Link></Dropdown.Item>
      <Dropdown.Item ><Link onClick={(e) => { DeleteFun(props.id) }} to={'/whList'}>Delete </Link></Dropdown.Item>
    </DropdownButton>
      <Card.Body>
        <Card.Title><MdOutlinePermIdentity/>{props.name}</Card.Title>
        <Card.Text >ID: {props.id}</Card.Text>
        <Card.Text>
          Status: {props.status}
        </Card.Text>
        <Card.Text><MdLocationPin/>
          Location: {props.location}
        </Card.Text>
        </Card.Body>
    </Card>
    </div>
    
  );
};

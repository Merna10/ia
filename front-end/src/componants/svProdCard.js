import "../css/productCard.css";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from "react-router-dom";

import { getAuthUser } from "../helper/Storage";
import axios from "axios";
import Alert from 'react-bootstrap/Alert';
import { useParams } from "react-router-dom";
import React, { useState } from "react";


export const SvProduct = (props) => {

  let { id } = useParams();
  const auth = getAuthUser();

  const [product, setProduct] = useState({
    loading: true,
    results: [],
    err : [],
    success: '',
    reload: false
  });

  
  return (

    <div>
    <Card>

    <>
      {product.err.map((error, index) => (
        <Alert key={index} variant='danger' className='p-2'>
          {error.msg}
        </Alert>
      ))}

      {product.success && (
        <Alert variant="success" className="p-2">
          {product.success}
        </Alert>
      )}
    </>

      <Card.Img className="card-image" variant="top" src={props.photo} />
      <Card.Body>
        <Card.Title>{props.name}</Card.Title>
        <Card.Text>
          {props.description}
        </Card.Text>
        <ListGroup className="list-group-flush">
        <ListGroup.Item key={`product-${props.id}-id`}>ID: {props.id}</ListGroup.Item>
        <ListGroup.Item key={`product-${props.id}-stock`}>Quantity: {props.stock}</ListGroup.Item>
        <ListGroup.Item key={`product-${props.id}-warehouse`}>Warehouse id: {props.warehouse_id}</ListGroup.Item>
      </ListGroup>
      <Link className="btn btn-sm btn-primary mx-2" to={'/request/'+ props.id + '/' + props.supervisor_id }>Stock Request</Link>
      </Card.Body>
    </Card>
  </div>

  );
};

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
    <Card className="productCard">

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
          <Card.Text>
          Quantity: {props.stock}
          </Card.Text>
      <Link className="btn  btn-primary mx-2" to={'/request/'+ props.id + '/' + props.supervisor_id }>Stock Request</Link>
      </Card.Body>
    </Card>
  </div>

  );
};

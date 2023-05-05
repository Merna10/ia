import "../css/productCard.css";
import { Link } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

import { getAuthUser } from "../helper/Storage";
import axios from "axios";
import Alert from 'react-bootstrap/Alert';
import { useParams } from "react-router-dom";
import React, { useState } from "react";


export const Product = (props) => {

  let { id } = useParams();
  const auth = getAuthUser();

  const [product, setProduct] = useState({
    loading: true,
    results: [],
    err : [],
    success: '',
    reload: false
  });

  // delete Function
  const DeleteFun = (id) => {
    axios
      .delete("http://localhost:5000/product/delete/" + id, {
        headers: {
          token: auth.token,
        },
      })
      .then((resp) => {
        setProduct((prevState) => ({
          ...prevState,
          reload: true,
          success:"deleted successfully"
        }));
      })
      .catch((err) => {
        setProduct((prevState) => ({
          ...prevState,
          loading: false,
          err: err.response.data.errors,
        }));
      });
  }


  return (
    
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
          <ListGroup className="list-group-flush">
          <ListGroup.Item key={`product-${props.id}-id`}>ID: {props.id}</ListGroup.Item>
          <ListGroup.Item key={`product-${props.id}-stock`}>Quantity: {props.stock}</ListGroup.Item>
          <ListGroup.Item key={`product-${props.id}-warehouse`}>Warehouse id: {props.warehouse_id}</ListGroup.Item>
        </ListGroup>
        <Link className="btn btn-sm btn-warning mx-2" to={'/updateproduct/'+ props.id }>Update </Link>
        <Link className="btn btn-sm btn-danger mx-2"  onClick={(e) => { DeleteFun(props.id) }} >Delete </Link>
        </Card.Body>
      </Card>
    
  );
  
};

export default Product;

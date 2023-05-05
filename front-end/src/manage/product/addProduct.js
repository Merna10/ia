import { AdminHeader } from "../../Pages/shared/header/admiHeader";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import'../../css/addProduct.css'

import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";


export const AddProduct = (props) => {
  
  const auth = getAuthUser();
  let { id } = useParams();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    stock:"",
    warehouse_id:id,
    err: [],
    loading: false,
    success: null,
  });

  const photo = useRef(null);

  const createProduct = (e) => {

    e.preventDefault();
    setProduct({ ...product, loading: true });

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("stock", product.stock);
    formData.append("warehouse_id", product.warehouse_id );
    if (photo.current.files && photo.current.files[0]) {
      formData.append("photo", photo.current.files[0]);
    }


    axios
      .post("http://localhost:5000/Product/create", formData, {
        headers: {
          token: auth.token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((resp) => {
        setProduct({
          name: "",
          description: "",
          stock:"",
          err: null,
          loading: false,
          success: "product Created Successfully !",
        });
        photo.current.value = null;
      })
      .catch((err) => {
        setProduct({
          ...product,
          loading: false,
          success: null,
          err: err.response.data.errors,
        });
      });
  };





  return (
    <><AdminHeader/>
    <div className='addpro'>
      <br></br>
    <div className='addpro1'>

    <>
    {product.err && Array.isArray(product.err) && product.err.map((error, index) => (
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
      
    <Form onSubmit={createProduct} >
    <Form.Label>Add Product</Form.Label>
      
      <Row className="mb-3">
        <Form.Group   md="4" controlId="validationCustomUsername">
          <Form.Label>Name</Form.Label>
          <InputGroup hasValidation>
            <Col >
            <Form.Control
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })} 
              type="text"
              placeholder="Name"
              style={{width:'    15cm'}}
              aria-describedby="inputGroupPrepend"
              required
            /></Col>
           
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group   md="4" controlId="validationCustomUsername">
          <Form.Label>Description</Form.Label>
          <InputGroup hasValidation>
            <Col >
            <Form.Control
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })} 
              type="text"
              placeholder="Description"
              style={{width:'    15cm'}}
              aria-describedby="inputGroupPrepend"
              required
            /></Col>
           
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group   md="4" controlId="validationCustomUsername">
          <Form.Label>photo</Form.Label>
          <InputGroup hasValidation>
            <Col >
            <Form.Control
               ref={photo}
              type="file"
              placeholder="Image URL"
              style={{width:'    15cm'}}
              aria-describedby="inputGroupPrepend"
              required
            /></Col>
           
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group md="4" controlId="validationCustomUsername">
          <Form.Label>Stock</Form.Label>
          <InputGroup hasValidation>
            <Col >
            <Form.Control
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: e.target.value })} 
              type="Number"
              placeholder="Stock"
              style={{width:'    15cm'}}
              aria-describedby="inputGroupPrepend"
              required
            /></Col>
            
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group   md="4" controlId="validationCustomUsername">
          <Form.Label>Warehouse ID</Form.Label>
          <InputGroup hasValidation>
            <Col >
            <Form.Control
              value={id}
              type="Number"
              placeholder={id}
              style={{width:'    15cm'}}
              aria-describedby="inputGroupPrepend"
              disabled
            /></Col>
           
          </InputGroup>
        </Form.Group>
      </Row>
      <Button className="btn btn-dark w-100" variant="primary" type="submit">
          Add New product
        </Button>
    </Form>
    </div></div>
    </>
  );
}

import { AdminHeader } from "../../Pages/shared/header/admiHeader";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import'../../css/addProduct.css'

import React, { useState, useRef, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";
import { useParams } from "react-router-dom";


export const UpdateProduct = () => {

  let { id } = useParams();
  const auth = getAuthUser();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    photo: null,
    warehouse_id:"",
    stock:"",
    err: [],
    loading: false,
    reload: false,
    success: null,
  });
  
  const photo = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/product/" + id,{
        headers:{
          token: auth.token
        }
      })
      .then((resp) => {
        console.log(resp);
        setProduct({
          ...product,
          name: resp.data.product.name,
          description: resp.data.product.description,
          photo: resp.data.product.photo,
          warehouse_id: resp.data.product.warehouse_id,
          stock: resp.data.product.stock
        });
      })
      .catch((err) => {
        setProduct({
          ...product,
          loading: false,
          success: null,
          err: [],
          
        });
      });
  }, [product.reload]);

  const updateProduct =(e) =>{

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
    .put("http://localhost:5000/product/update/" + id, formData, {
      headers: {
        token: auth.token,
        "Content-Type": "multipart/form-data",
      },
    })
    .then((resp) => {
      setProduct({
        ...product,
        loading: false,
        success: "product updated successfully !",
        reload: product.reload + 1,
      });
    })
    .catch((err) => {
      setProduct({
        ...product,
        loading: false,
        success: null,
        err: err.response.data.errors,
      });
    });

  }


  return (
    <><AdminHeader/>
    <div className='updatepro'>
      <br></br>
    <div className='updatepro1'>
      
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


    <Form onSubmit={updateProduct}>
    <Form.Label>Update Product</Form.Label>
    
    <Row className="mb-3">
    <img
          alt={product.name}
          style={{
            width: "50%",
            height: "100px",
            objectFit: "cover",
            borderRadius: "10px",
            border: "1px solid #ddd",
            marginBottom: "10px",
          }}
          src={product.photo}
        />
    </Row>
        
      <Row className="mb-3">
        <Form.Group   md="4" controlId="validationCustomUsername">
          <Form.Label>Name</Form.Label>
          <InputGroup hasValidation>
            <Col >
            <Form.Control
              type="text"
              placeholder="Name"
              style={{width:'    15cm'}}
              aria-describedby="inputGroupPrepend"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
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
              type="text"
              placeholder="Description"
              style={{width:'    15cm'}}
              aria-describedby="inputGroupPrepend"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            /></Col>
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group   md="4" controlId="validationCustomUsername">
          <Form.Label>Image</Form.Label>
          <InputGroup hasValidation>
            <Col >
            <Form.Control
              type="file"
              placeholder="Image URL"
              style={{width:'    15cm'}}
              aria-describedby="inputGroupPrepend"
              ref={photo}
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
              type="Number"
              placeholder={product.warehouse_id}
              style={{width:'    15cm'}}
              aria-describedby="inputGroupPrepend"
              value={product.warehouse_id}
              onChange={(e) => setProduct({ ...product, warehouse_id: e.target.value })}
              disabled
            /></Col>
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group   md="4" controlId="validationCustomUsername">
          <Form.Label>Stock</Form.Label>
          <InputGroup hasValidation>
            <Col >
            <Form.Control
              type="Number"
              placeholder="Stock"
              style={{width:'      15cm'}}
              aria-describedby="inputGroupPrepend"
              value={product.stock}
              onChange={(e) => setProduct({ ...product, stock: e.target.value })}
              required
            /></Col>
            
          </InputGroup>
        </Form.Group>
      </Row>
      <Button className="btn btn-dark w-100" variant="primary" type="submit">
          Update product
        </Button>   
         </Form>
    </div></div>
    </>
  );
}

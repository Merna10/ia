import { SvHeader } from "../../Pages/shared/header/superVheader";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import'../../css/request.css'

import Alert from "react-bootstrap/Alert";


import axios from "axios";
import { getAuthUser } from "../../helper/Storage";
import React, { useState } from "react";
import { useParams } from "react-router-dom";


export const Request = () => {

  let {product_id, supervisor_id} = useParams();
  const auth = getAuthUser();

  const [reqeust, setReqeust] = useState({
    stock:'',
    err: [],
    loading: false,
    reload: false,
    success: null,
  });


  const createReqeust = (e) => {
    e.preventDefault();
    setReqeust({ ...reqeust, loading: true });
    
    axios
      .post("http://localhost:5000/stockRequest/create", {
        products_id: product_id,
        supervisor_id:supervisor_id,
        quantity :reqeust.stock
      }, {
        headers: {
          token: auth.token
        }
      }).then((resp) => {
        setReqeust({
          ...reqeust,
          loading: false,
          success: "reqeust created successfully !",
          reload: reqeust.reload + 1,
        })
      }).catch((err) => {
        setReqeust({

          loading: false,
          success: null,
          err: err.response.data.errors,

        })
      })
  }


 
  return (
    <><SvHeader/>
    <div className='request'>
      <br></br>
    <div className='request1'>

    {reqeust.err && Array.isArray(reqeust.err) && reqeust.err.map((error, index) => (
              <Alert key={index} variant='danger' className='p-2'>
                {error.msg}
              </Alert>
            ))}

            {reqeust.success && (
              <Alert variant="success" className="p-2">
                {reqeust.success}
              </Alert>
            )}
      
    <Form onSubmit={createReqeust}>
    <Form.Label>Update Product</Form.Label>
      
      
      <Row className="mb-3">
        <Form.Group   md="4" controlId="validationCustomUsername">
          <Form.Label>Product ID</Form.Label>
          <InputGroup hasValidation>
            <Col >
            <Form.Control
              type="Number"
              value={product_id}
              placeholder={product_id}
              style={{width:'12cm'}}
              aria-describedby="inputGroupPrepend"
              disabled
            /></Col>
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group   md="4" controlId="validationCustomUsername">
          <Form.Label>Supervisor ID</Form.Label>
          <InputGroup hasValidation>
            <Col >
            <Form.Control
              type="Number"
              value={supervisor_id}
              placeholder={supervisor_id}
              style={{width:'      12cm'}}
              aria-describedby="inputGroupPrepend"
              disabled
            /></Col>
          </InputGroup>
        </Form.Group>
      </Row>
      
      <Row className="mb-3">
        <Form.Group   md="4" controlId="validationCustomUsername">
          <Form.Label>Change Stock To</Form.Label>
          <InputGroup hasValidation>
            <Col >
            <Form.Control
              type="Number"
              value={reqeust.stock}
              onChange={(e) => setReqeust({ ...reqeust, stock: e.target.value })}                
              placeholder="Stock"
              style={{width:'      12cm'}}
              aria-describedby="inputGroupPrepend"
              required
            /></Col>
          </InputGroup>
        </Form.Group>
      </Row>
      <Button className="btn btn-sm btn-primary mx-2 " type="submit">Create Reqeust</Button>
    </Form>
    </div></div>
    </>
  );
}

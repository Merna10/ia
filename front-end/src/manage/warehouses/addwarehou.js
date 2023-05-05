import { AdminHeader } from "../../Pages/shared/header/admiHeader";
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import'../../css/addwarehou.css'

import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { getAuthUser } from "../../helper/Storage";
import axios from "axios";
import React, { useRef, useState } from "react";

export const AddWarehouse = () => {

  const auth = getAuthUser();

  const [warehouse, setWarehouse] = useState({
    name: "",
    location: "",
    status: "",
    err:[],
    loading: false,
    success: null,
  });

  const createWarehouse = (e)=>{
    e.preventDefault();
    setWarehouse({ ...warehouse, loading: true });

    axios
    .post("http://localhost:5000/warehouse/create",{
      name:warehouse.name,
      location:warehouse.location,
      status:warehouse.status,
    },{
      headers:{
        token: auth
      }
    }).then((resp)=>{
      setWarehouse({
        name: "",
        location: "",
        status: "",
    err:[],
    loading: false,
    success: "warehouse Created successfully",
      })
    }).catch((err)=>{
      setWarehouse({
        
    loading: false,
    success:null,
    err: err.response.data.errors,
  })
    })
  }



  return (
    <><AdminHeader/>
    <div className='addware'>
      <br></br>
    <div className='addware1'>
    <>
    {warehouse.err && Array.isArray(warehouse.err) && warehouse.err.map((error, index) => (
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

    <Form onSubmit={createWarehouse}>
    <h1><Form.Label>Add Warehouse</Form.Label></h1>
  
      <Row className="mb-3">
        <Form.Group   md="4" controlId="validationCustomUsername">
          <Form.Label>Name</Form.Label>
          <InputGroup hasValidation><Col>
            <Form.Control
              type="text"
              value={warehouse.name}
            onChange={(e) => setWarehouse({ ...warehouse, name: e.target.value })}
              placeholder="Name"
              style={{width:'  15cm'}}
              aria-describedby="inputGroupPrepend"
              required
            /></Col>
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group   md="4" controlId="validationCustomUsername">
          <Form.Label>Location</Form.Label>
          <InputGroup hasValidation><Col>
            <Form.Control
            value={warehouse.location}
            onChange={(e) => setWarehouse({ ...warehouse, location: e.target.value })}
              
              type="text"
              placeholder="Location"
              style={{width:' 15cm'}}
              aria-describedby="inputGroupPrepend"
              required
            /></Col>
          </InputGroup>
        </Form.Group>
      </Row>
      
      <Row className="mb-3">
        <Form.Group   md="4" controlId="validationCustomUsername">
          <Form.Label>Status</Form.Label>
          <InputGroup hasValidation>
          <Col><Form.Control
          value={warehouse.status}
          onChange={(e) => setWarehouse({ ...warehouse, status: e.target.value })}
            
              type="Text"
              placeholder="Status"
              style={{width:'      15cm'}}
              aria-describedby="inputGroupPrepend"
              required
            /></Col>
          </InputGroup>
        </Form.Group>
      </Row>
      <Button  variant="dark" type="submit">
          Submit
        </Button>    
          </Form>
    </div></div>
    </>
  );
}

import { AdminHeader } from "../../Pages/shared/header/admiHeader";
import React, { useState , useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import'../../css/addwarehou.css'
import { useParams } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { getAuthUser } from "../../helper/Storage";

export const UpdateWarehous = () => {
  
  let { id } = useParams();
  const auth = getAuthUser();

  const [warehouse, setWarehouse] = useState({
    name:"",
    location:"",
    status:"",
    err: [],
    loading: false,
    reload: false,
    success: null,
  });

  useEffect(() => {
    axios
    .get("http://localhost:5000/warehouse/" + id,{
      headers:{
        token: auth.token
      }
    })

      .then((resp) => {
        console.log(resp);
        setWarehouse({
          ...warehouse,
          name:resp.data.warehouse.name,
          location:resp.data.warehouse.location,
          status:resp.data.warehouse.status
        });
      })
      .catch((err) => {
        setWarehouse({
          ...warehouse,
          loading: false,
          success: null,
          err: "Something went wrong!",
        });
      });
  }, [warehouse.reload]);

  const updateWarehouse = (e) => {
    e.preventDefault();
    setWarehouse({ ...warehouse, loading: true });
    axios
      .put("http://localhost:5000/warehouse/update/" + id, {
        name: warehouse.name,
        location: warehouse.location,
        status: warehouse.status
      }, {
        headers: {
          token: auth.token
        }
      }).then((resp) => {
        setWarehouse({
          ...warehouse,
          loading: false,
          success: "warehouse updated successfully !",
          reload: warehouse.reload + 1,
        })
      }).catch((err) => {
        setWarehouse({

          loading: false,
          success: null,
          err: err.response.data.errors,

        })
      })
  }


  return (
    <><AdminHeader/>
    <div className='updateware'>
      <br></br>
    <div className='updateware1'>

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

    <Form onSubmit={updateWarehouse}>
    <h1><Form.Label>Update Warehouse</Form.Label></h1>
  
      <Row className="mb-3">
        <Form.Group   md="4" controlId="validationCustomUsername">
          <Form.Label>Name</Form.Label>
          <InputGroup hasValidation><Col>
            <Form.Control
              value={warehouse.name}
              onChange={(e) => setWarehouse({ ...warehouse, name: e.target.value })}
              type="text"
              required
              placeholder="Name"
              style={{width:'  15cm'}}
              aria-describedby="inputGroupPrepend"
              
            /></Col>
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-3">
        <Form.Group   md="4" controlId="validationCustomUsername">
          <Form.Label>Location</Form.Label>
          <InputGroup hasValidation><Col>
            <Form.Control
              onChange={(e) => setWarehouse({ ...warehouse, location: e.target.value })}
              value={warehouse.location}
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
            onChange={(e) => setWarehouse({ ...warehouse, status: e.target.value })}
            value={warehouse.status}

              type="Text"
              placeholder="Status"
              style={{width:'      15cm'}}
              aria-describedby="inputGroupPrepend"
              required
            /></Col>
            <Form.Control.Feedback type="invalid">
              Please enter Status.
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      
      <Button variant="dark" type="submit">
                Update warehouse
       </Button>   
          </Form>
    </div></div>
    </>
  );
}

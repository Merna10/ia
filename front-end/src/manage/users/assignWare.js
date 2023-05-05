import { AdminHeader } from "../../Pages/shared/header/admiHeader";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import '../../css/register.css'
import Alert from "react-bootstrap/Alert";


import axios from "axios";
import { getAuthUser } from "../../helper/Storage";
import React, { useState } from "react";
import { useParams } from "react-router-dom";



export const AssignbSuberv = () => {

  let { id } = useParams();
  const auth = getAuthUser();

  const [supervisor, setSupervisor] = useState({
    warehouse_id:'',
    err: [],
    loading: false,
    reload: false,
    success: null,
  });


  const AssignWarehouse = (e) => {
    e.preventDefault();
    setSupervisor({ ...supervisor, loading: true });
    
    axios
      .post("http://localhost:5000/superviser/create", {
        user_id: id,
        warehouse_id:supervisor.warehouse_id
      }, {
        headers: {
          token: auth.token
        }
      }).then((resp) => {
        setSupervisor({
          ...supervisor,
          loading: false,
          success: "supervisor created successfully !",
          reload: supervisor.reload + 1,
        })
      }).catch((err) => {
        setSupervisor({

          loading: false,
          success: null,
          err: err.response.data.errors,

        })
      })
  }

  
  return (
    <><AdminHeader />
      <div className='register'>
        <br></br>
        <div className='register1'>

        {supervisor.err && Array.isArray(supervisor.err) && supervisor.err.map((error, index) => (
              <Alert key={index} variant='danger' className='p-2'>
                {error.msg}
              </Alert>
            ))}

            {supervisor.success && (
              <Alert variant="success" className="p-2">
                {supervisor.success}
              </Alert>
            )}

          <Form onSubmit={AssignWarehouse}>
            <Form.Label>Assign Subervisor</Form.Label>
            <Row className="mb-3">
              <Form.Group md="4" controlId="validationCustomUsername">
                <Form.Label>ID</Form.Label>
                <InputGroup hasValidation>
                  <Col>
                    <Form.Control
                      type="number"
                      value= {id}
                      placeholder= {id}
                      style={{ width: '15cm' }}
                      aria-describedby="inputGroupPrepend"
                      disabled
                    />
                  </Col>
                </InputGroup>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group md="4" controlId="">
                <Form.Label>Warehouse ID</Form.Label>
                <InputGroup >
                  <Col>
                    <Form.Control
                      type="number"
                      value={supervisor.warehouse_id}
                      onChange={(e) => setSupervisor({ ...supervisor, warehouse_id: e.target.value })}
                      placeholder="Warehouse ID"
                      style={{ width: '      15cm' }}
                      aria-describedby="inputGroupPrepend"
                      required
                    /></Col>
                </InputGroup>
              </Form.Group>
            </Row>
            <Button className="btn btn-sm btn-primary mx-2 " type="submit">Assign Warehouse</Button>
          </Form>
        </div></div>
    </>
  )
}
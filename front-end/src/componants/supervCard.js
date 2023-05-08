
import "../css/supervCard.css";
import React, { useState } from "react";
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import axios from 'axios'
import { getAuthUser } from "../helper/Storage";
import { useParams , Link} from "react-router-dom";

export const Supervisor = (props) => {

  let { id } = useParams();
  const auth = getAuthUser();
  const [supervisors, setSupervisors] = useState({
    loading: true,
    results: [],
    err : [],
    success: '',
    reload: 0
  });
  // delete Function
  const DeleteFun = (id) => {
    axios
      .delete("http://localhost:5000/superviser/delete/" + id, {
        headers: {
          token: auth.token,
        },
      })
      .then((resp) => {
        setSupervisors((prevState) => ({
          ...prevState,
          reload: true,
          success:"deleted successfully"
        }));
      })
      .catch((err) => {
        setSupervisors((prevState) => ({
          ...prevState,
          loading: false,
          err: err.response.data.errors,
        }));
      });
  }
  return (
    
    <div>
      
      
      <>
        {supervisors.err.map((error, index) => (
          <Alert key={index} variant='danger' className='p-2'>
            {error.msg}
          </Alert>
        ))}

        {supervisors.success && (
          <Alert variant="success" className="p-2">
            {supervisors.success}
          </Alert>
        )}
      </>
      
    <Card className="supervCard">
    <Card.Body>
        <Card.Text>
        Supervisor with ID: {props.user} Assigned to Warehouse with ID: {props.warehouse}
        <Link className="supervCardButton"  onClick={(e) => { DeleteFun(props.id) }} to={'/whList'}>Delete </Link>

        </Card.Text>
        
      </Card.Body>
    </Card>
    </div> 
  );
};

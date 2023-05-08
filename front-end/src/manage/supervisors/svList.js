import React, { useEffect, useState } from "react";
import { Supervisor } from "../../componants/supervCard";

import { AdminHeader } from "../../Pages/shared/header/admiHeader";
import "../../css/svList.css";
import axios from 'axios'
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

export const SvList = () => {

  const [supervisors, setSupervisors] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0
  });

  useEffect(() => {
    setSupervisors({ ...supervisors, loading: true })

    axios
      .get('http://localhost:5000/superviser')
      .then(resp => {
        console.log(resp);
        setSupervisors({ ...supervisors, results: resp.data.supervisors, loading: false })
      })
      .catch(err => {
        setSupervisors({ ...supervisors, err: "Something went wrong", loading: false })
      }
      )
    }, [])


  return (
    
    <div className="svlist">
      
      <AdminHeader />
      <br></br>
            <div className="home-container p-5">
             {/* loader */}
        {supervisors.loading === true && (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
      
      {supervisors.loading === false && supervisors.err == null && (
          <div className="row">
            {Array.isArray(supervisors.results) &&
              supervisors.results.map((supervisor) => (
                <div className="container-fluid" key={supervisor.id}>

                  <Supervisor

                    id={supervisor.id}
                    user={supervisor.user_id}
                    warehouse={supervisor.warehouse_id}
                  />
                  <br></br>
                </div>

              ))}
          </div>
        )}

</div>

    </div>
  );
};

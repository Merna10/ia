import React, { useEffect, useState } from "react";
import { User } from "../../componants/userCard";
import {  Link } from "react-router-dom";
import "../../css/svList.css";
import axios from 'axios'
import Spinner from 'react-bootstrap/Spinner';
import { AdminHeader } from "../../Pages/shared/header/admiHeader";

export const UserList = () => {

  const [users, setUsers] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0
  });
 
  useEffect(() => {
    setUsers({ ...users, loading: true })

    axios
      .get('http://localhost:5000/auth/')
      .then(resp => {
        console.log(resp);
        setUsers({ ...users, results: resp.data.Users, loading: false })
      })
      .catch(err => {
        setUsers({ ...users, err: "Something went wrong", loading: false })

      })
  }, [])


  return (
    <div className="userlist">
      
      <AdminHeader />
      <br></br>
      <Link className="assign" to={'/svlist'} >Assigned</Link>
      <Link className="abutton" to={'/addUser'} >Add New User</Link>


      
         <div className="home-container p-5">
             {/* loader */}
        {users.loading === true && (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
      
      {users.loading === false && users.err == null && (
          <div className="row">
            {Array.isArray(users.results) &&
              users.results.map((user) => (
                <div className="container-fluid" key={user.id}>

                  <User

                    id={user.id}
                    email={user.email}
                    phone={user.phone}
                    status={user.status}
                    type={user.type}

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

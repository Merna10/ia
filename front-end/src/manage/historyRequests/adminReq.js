
import { AdminHeader } from "../../Pages/shared/header/admiHeader";
import { Link } from "react-router-dom";

import Table from 'react-bootstrap/Table';


import axios from 'axios'
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAuthUser } from "../../helper/Storage";

export const AdminHistorList = () => {
  const auth = getAuthUser();
  const { id } = useParams();

  const [requests, setRequests] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0
  });

  useEffect(() => {
    setRequests({ ...requests, loading: true });
    axios
      .get(`http://localhost:5000/stockRequest/`, {
        headers: {
          token: auth.token
        }
      })
      .then(resp => {
        console.log(resp);
        setRequests({ ...requests, results: resp.data.stockRequests, loading: false });
      })
      .catch(err => {
        setRequests({ ...requests, err: err.response.data.errors, loading: false });
      });
  }, [auth.token, id, requests.reload]);

  const deleteFun = (id) => {
    axios.put(
      'http://localhost:5000/stockRequest/decline',
      { id, status: 'Declined' },
      { headers: { token: auth.token } }
    )
      .then((resp) => {
        // Reload the list of stock requests
        setRequests({ ...requests, reload: requests.reload + 1 });
      })
      .catch((err) => {
        console.error(err);
      });
  }



  const approveFun = (requestId, productId, newStock) => {
    axios.put(`http://localhost:5000/stockRequest/Approve`, {
      id: requestId,
      status: 'approved',
      stock: newStock
    }, {
      headers: {
        token: auth.token
      }
    })
      .then(resp => {
        console.log(resp);
        setRequests({
          ...requests,
          results: requests.results.map(request => {
            if (request.id === requestId) {
              return {
                ...request,
                status: 'approved'
              };
            } else {
              return request;
            }
          })
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (

    <div className="">
      <AdminHeader/>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>StockRequest ID</th>
            <th>User</th>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Requested Stock</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {requests.loading && (
            <tr>
              <td colSpan="5">
                <Spinner animation="border" variant="primary" />
              </td>
            </tr>
          )}
          {!requests.loading && requests.results.length === 0 && (
            <tr>
              <td colSpan="5">
                <Alert variant="warning">No stock requests found!</Alert>
              </td>
            </tr>
          )}
          {!requests.loading &&
            requests.results.map(request => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td>{request.supervisor.user.email}</td>
                <td>{request.product.id}</td>
                <td>{request.product.name}</td>
                <td>{request.quantity}</td>
                <td>{request.status}</td>
                <td>
                  <Link
                    className="btn btn-sm btn-success mx-2"
                    onClick={() => approveFun(request.id, request.product.id, request.quantity)}
                  >
                    Approve
                  </Link>
                  <Link
                    className="btn btn-sm btn-danger mx-2"
                    onClick={() => deleteFun(request.id)}
                  >
                    Decline
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};
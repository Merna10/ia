import { SupervisorRequest } from "../../componants/supervhistoryrequest";
import {SvHeader} from "../../Pages/shared/header/superVheader";
import Table from 'react-bootstrap/Table';

import axios from 'axios'
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAuthUser } from "../../helper/Storage";

export const SvHistorList = () => {
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
      .get(`http://localhost:5000/stockRequest/supervisor/${id}`, {
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

  return (
    <div className="">
      <SvHeader />
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th style={{ width: '7cm' }}>StockRequest ID</th>
            <th style={{ width: '7cm' }}>Product ID</th>
            <th style={{ width: '7cm' }}>Product Name</th>
            <th style={{ width: '7cm' }}>Requested Stock</th>
            <th style={{ width: '7cm' }}>Status</th>
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
                <td>{request.product.id}</td>
                <td>{request.product.name}</td>
                <td>{request.quantity}</td>
                <td>{request.status}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};
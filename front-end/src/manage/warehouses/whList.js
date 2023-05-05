import React, { useEffect, useState } from "react";
import { Warehouse } from "../../componants/warehouseCard";
import { Link } from "react-router-dom";
import "../../css/whList.css";
import axios from 'axios'
import Spinner from 'react-bootstrap/Spinner';

export const WhList = () => {

  const [warehouses, setWarehouses] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0
  });

  useEffect(() => {
    setWarehouses({ ...warehouses, loading: true })

    axios
      .get('http://localhost:5000/warehouse')
      .then(resp => {
        console.log(resp);
        setWarehouses({ ...warehouses, results: resp.data.warehouses, loading: false })
      })
      .catch(err => {
        setWarehouses({ ...warehouses, err: "Something went wrong", loading: false })
      }
      )
    }, [])

    return (
      <div>
        <div className="whlist">
          <ul >
            <li >
              <Link to={'/adminhome'} >Home</Link>
            </li>

            <li >
              <Link to={'/addwh'} >Add Warehouse</Link>
            </li>
          </ul>
        
        <div className="home-container p-5">
          {/* loader */}
          {warehouses.loading === true && (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          )}
        </div>


        {warehouses.loading === false && warehouses.err == null && (
          <div className="row">
            {Array.isArray(warehouses.results) &&
              warehouses.results.map((warehouse) => (
                <div className="col-3 card-product-container" key={warehouse.id}>

                  <Warehouse

                    id={warehouse.id}
                    name={warehouse.name}
                    location={warehouse.location}
                    status={warehouse.status}
                  />
                </div>

              ))}
          </div>
        )}
</div>
      </div>

    );
};

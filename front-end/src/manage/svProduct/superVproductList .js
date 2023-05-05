import { SvProduct } from "../../componants/svProdCard";
import { Link } from "react-router-dom";
import "../../css/productList.css";
import axios from 'axios'
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAuthUser } from "../../helper/Storage";

export const SvProductList = () => {
  const auth = getAuthUser();

  let { id } = useParams();

  const [products, setProducts] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0
  });

  useEffect(() => {
    setProducts({ ...products, loading: true })
  axios
      .get('http://localhost:5000/product//supervisor/'+ id,{
        headers:{
          token: auth.token
        }
      })
      .then(resp => {
        console.log(resp);
        setProducts({ ...products, results: resp.data.products, loading: false })
      })
      .catch(err => {
        setProducts({ ...products, err: err.response.data.errors , loading: false })

      })
  }, [])

  return (
    <div>
    <div className="productList">
      <ul >
          <li >
              <Link to={'/svhome'} >Back</Link>
            </li>
            </ul>

    <div className="home-container p-5">
       {/* loader */}
       {products.loading === true && (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading</span>
            </Spinner>
          </div>
        )}

{products.loading === false && products.err == null && (
          <div className="row">
            {Array.isArray(products.results) &&
              products.results.map((product) => (
                <div className="col-3 card-product-container" key={product.id}>

                  <SvProduct

                    id={product.id}
                    name={product.name}
                    description={product.description}
                    photo={product.photo}
                    stock={product.stock}
                    warehouse_id= {product.warehouse.id}
                    supervisor_id = {id}


                  />
                </div>

              ))}
          </div>
        )}

         {/* ERRORS HANDLING  */}
         {products.loading === false && products.err != null && (
          <Alert variant="danger" className="p-2">
            {products.err}
          </Alert>
        )
        }

        {products.loading === false &&
          products.err == null &&
          products.results.length === 0 && (
            <Alert variant="info" className="p-2">
              No Products, please try again later!
            </Alert>
          )
        }

    </div>
    </div>
    </div>
  );
};

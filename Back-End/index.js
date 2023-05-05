//====================================== Intialize Express App ======================================//
const express = require("express");
const app = express();

 

//====================================== Global MiddleWare ======================================//
app.use(express.json())
app.use(express.urlencoded({extended: true})) // to access url form encoded
app.use(express.static("Upload"))
const cors = require("cors")
app.use(cors()) //allow HTTP request localhosts


//====================================== Required Modules ======================================//
const admin = require("./Routes/SuperviserRoutes")
const auth = require("./Routes/AuthRoutes")
const product = require("./Routes/ProductRoutes")
const stockRequest = require("./Routes/stockRequestRoutes")
const warehouse = require("./Routes/warehousesRoutes")

//====================================== Run The APP ======================================//
app.listen(process.env.PORT || 5000, process.env.HOST || "localhost", () => {
  console.log("server is running");
});

//====================================== API Routes [EndPoints] ======================================//
app.use("/auth", auth)
app.use("/superviser", admin)
app.use("/product", product)
app.use("/stockRequest", stockRequest)
app.use("/warehouse", warehouse)
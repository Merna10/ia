import { createBrowserRouter } from "react-router-dom";
import { ProductList } from "./manage/product/productList";
import { SvProductList } from "./manage/svProduct/superVproductList ";
import { Request } from "./manage/svProduct/request";
import { Login } from "./Pages/Auth/login";
import { AddWarehouse } from "./manage/warehouses/addwarehou";
import { UpdateWarehous } from "./manage/warehouses/updatewarehou";
import { SvHome } from "./Pages/home/svhome";
import { AdminHome } from "./Pages/home/adminhome";
import { App } from "./App";
import { Admin } from "./middlewares/Admin";
import { Supervisor5 } from "./middlewares/supervisor";
import { AddProduct } from "./manage/product/addProduct";
import { UpdateProduct } from "./manage/product/updateProduct";
import { AddSuberv } from "./manage/supervisors/addSv";
import { AddUser } from "./manage/users/addUser";
import { AssignbSuberv } from "./manage/users/assignWare";
import { UpdateSuber } from "./manage/supervisors/updateSv";
import { UpdateUser } from "./manage/users/updateUser";
import { WhList } from "./manage/warehouses/whList";
import { SvList } from "./manage/supervisors/svList";
import { UserList } from "./manage/users/userList";
import { SvHistorList } from "./manage/historyRequests/svReq";
import { AdminHistorList } from "./manage/historyRequests/adminReq";
// List of Routes (Pages)
// Route is (url displayed in browser + which component to display)

// Here we have 1 Route (that contains nested routes)
export const routes = createBrowserRouter([
  
  {

    path: "/",
    element: <App />,
    // App component children routes
    children: [
      
      
      {
        path: "/",
        element: <Login />,
      },
      // Guest
      {
        element: <Supervisor5 />,
        children: [
          {
            path: "/svhome",
            element: <SvHome />,
          },
          
          
          {
            path: "/SvProductList/:id",
            element: <SvProductList />,
          },
          {
            path: "/request/:product_id/:supervisor_id",
            element: <Request />,
          },
          {
            path: "/supervisorHistory/:id",
            element: <SvHistorList />,
          },
          
        ]
      },
      {
        element: <Admin />,
        children: [
          {
            path: "/adminhome",
            element: <AdminHome />,
          },
          {
            path: "/addUser",
            element: <AddUser />,
          },
          {
            path: "/userList",
            element: <UserList />,
          },
          {
            path: "/updateUser/:id",
            element: <UpdateUser />,
          },
          {
            path: "/addsv",
            element: <AddSuberv />,
          },
          {
            path: "/assign/:id",
            element: <AssignbSuberv />,
          },
          {
            path: "/svList",
            element: <SvList />,
          },
          {
            path: "/updatesv/:id",
            element: <UpdateSuber />,
          },
          {
            path: "/addProduct/:id",
            element: <AddProduct />,
          },
          {
            path: "/updateproduct/:id",
            element: <UpdateProduct />,
          },
          {
            path: "/productList/:id",
            element: <ProductList />,
          },
          {
            path: "/addwh",
            element: <AddWarehouse />,
          },
          {
            path: "/whList/",
            element: <WhList />,
          },
          {
            path: "/updatewh/:id",
            element: <UpdateWarehous />,
          },
          
      {
        path: "/adminhistory",
        element: <AdminHistorList />,
      },
        ]
      },
      
    
      
    ],
  },
]);



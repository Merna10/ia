// import image
import { Link } from "react-router-dom";
import '../../../css/adminHeader.css'

export const AdminHeader = () => {
  return (
    <>
      <nav >
        <div >

          <ul >
          <li >
              <Link to={'/adminhome'} >Home</Link>
            </li>
            <li >
              <Link to={'/userList'} >Users</Link>
            </li>

            <li >
              <Link to={'/svlist'} >Supervisors</Link>
            </li>
            
           
            <li >
              <Link to={'/whList'}>Warehouses</Link>
            </li>
            <li >
              <Link to={'/adminhistory'}>Requests</Link>
            </li>
            <li className="nav-item2" >
            <Link to={'/'} >LogOut</Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

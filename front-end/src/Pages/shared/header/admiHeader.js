// import image
import { Link } from "react-router-dom";
import '../../../css/adminHeader.css'

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
export const AdminHeader = () => {
  return (
    <>
      <nav >
        <div >

          
            <DropdownButton className="navbar" id="dropdown-basic-button" variant="" title="Menu" >
      <Dropdown.Item ><Link to={'/adminhome'} >Home</Link></Dropdown.Item>
      <Dropdown.Item > <Link to={'/userList'} >Users</Link></Dropdown.Item>
      <Dropdown.Item > <Link to={'/whList'}>Warehouses</Link></Dropdown.Item>
      <Dropdown.Item > <Link to={'/'} >LogOut</Link></Dropdown.Item>
    </DropdownButton>
            
          
        </div>
      </nav>
    </>
  );
};

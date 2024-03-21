import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom';

const UserRoute = () => {
    const user=JSON.parse(localStorage.getItem('user'));
    const navigate=useNavigate();
  return user!=null && user.isAdmin==false && user.isSuperAdmin==false ? <Outlet/> : navigate('/login')

}

export default UserRoute
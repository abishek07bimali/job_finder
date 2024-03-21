import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const AdminRoute = () => {
    const user=JSON.parse(localStorage.getItem('user'));
    const navigate=useNavigate();
  return user!=null && user.isAdmin==true || user!=null && user.isSuperAdmin==true ? <Outlet/> : navigate('/login')

}

export default AdminRoute
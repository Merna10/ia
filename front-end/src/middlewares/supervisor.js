import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { getAuthUser } from "../helper/Storage";

export const Supervisor5 = () => {
  const auth = getAuthUser();
  return <>{auth && auth.type === 'supervisor' ? <Outlet /> : <Navigate to={"/"} />}</>;
};

/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { AuthContext } from "../../providers/AuthProvider";

export const UserDropdown = () => {

  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth(null);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="absolute w-[185px] flex items-center justify-center flex-col bg-black top-[48px] right-0 rounded-lg text-start text-white z-10">
      <div className="flex w-full my-auto flex-col items-center justify-center gap-1">
        <div className="w-full h-auto pt-2 font-semibold text-center">
          <h2>{`${auth?.user.first_name} ${auth?.user.last_name}`}</h2>
        </div>
        <small className="text-[10px] font-thin">{auth?.user.role}</small>
      </div>
      <div className="text-xs font-thin p-3">
        <Link to="/cambiar-contraseña" className="flex items-center gap-1 mb-3">
          <SettingsIcon />
          <p>Cambiar contraseña</p>
        </Link>
        <button className="flex items-center gap-1" onClick={handleLogout}>
          <ExitToAppIcon />
          <p>Salir</p>
        </button>
      </div>
    </div>
  );
};

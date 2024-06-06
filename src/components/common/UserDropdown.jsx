/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { AuthContext } from "../../providers/AuthProvider";

export function UserDropdown({ setShowUserDropdown }) {

  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem('auth_mga');
    navigate("/login");
  };

  return (
    <div
      className="absolute w-[185px] flex items-center justify-center flex-col bg-black top-[48px] right-0 rounded-lg text-start text-white z-10"
      onMouseLeave={() => setShowUserDropdown(false)}
    >
      <div className="flex w-full my-auto flex-col items-center justify-center gap-1">
        <div className="w-full h-auto pt-2 font-semibold text-center">
          <h2>{`${auth?.user.first_name} ${auth?.user.last_name}`}</h2>
        </div>
        <small className="text-[10px] font-thin">{auth?.user.role}</small>
      </div>
      <div className="text-xs font-thin p-3">
        <Link
          to="/cambiar-contraseña"
          className="flex items-center gap-1 mb-1 p-1 rounded-md hover:text-gray-950 hover:bg-gray-50"
          style={{ transition: '300ms all' }}
        >
          <SettingsIcon />
          <p>Cambiar contraseña</p>
        </Link>
        <button
          className="flex items-center gap-1 w-full p-1 rounded-md hover:text-gray-950 hover:bg-gray-50"
          onClick={handleLogout}
        >
          <ExitToAppIcon />
          <p>Salir</p>
        </button>
      </div>
    </div>
  )
}
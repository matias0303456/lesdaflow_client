/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

//components import
import { Avatar } from "@mui/material";

//icons import
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export const UserDropdown = ({children, sx, mobileOpen}) => {
console.log(mobileOpen)
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth(null);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className={`${mobileOpen ? '' : 'w-[185px] h-[200px] flex items-center justify-center flex-col bg-black/80 absolute top-[70px] 2xl:top-[75px] right-2 2xl:right-3 rounded-lg py-4 text-start text-white gap-5'} `}>
      <div className={`${mobileOpen ? 'hidden' : 'flex'} w-full my-auto flex-col items-center justify-center gap-1`}>
        <Avatar
        sx={sx}
        >
          {children}
        </Avatar>
        {/* name section */}
        <div className="w-full h-auto flex items-center justify-center pt-2  font-semibold gap-1">
          <h2>{auth.user.first_name}</h2>
          <h2>{auth.user.last_name}</h2>
        </div>
        <small className="text-[10px] font-thin">{auth.user.role.name}</small>
        {/* email section */}
        <p className="text-sm ">{auth.user.email}</p>
      </div>
      {/* action menu */}
      <div className={`${mobileOpen ? 'w-[90%] gap-7 justify-start hover:text-white' : 'w-[90%] flex-col justify-center mx-auto  gap-1'} flex items-center text-xs font-thin `}>
        <Link 
        to="/cambiar-contraseña"
        className="w-[50%] h-auto flex items-center justify-center gap-1 ">
          <SettingsIcon className="w-5 h-5" />
          <p className="w-[50%]">Cambiar contraseña</p>
        </Link>
        <button
          className="w-[50%] h-auto flex items-center justify-center gap-1"
          onClick={handleLogout}
        >
          <ExitToAppIcon className="w-5 h-5" />
          <p className="w-[50%]">Salir</p>
        </button>
      </div>
    </div>
  );
};

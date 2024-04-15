/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../providers/AuthProvider";
import { Logo } from "./Logo";
import { nav_items_admin, nav_items_user } from "../../data/navigation-items";

//components imports
import Avatar from '@mui/material/Avatar';
import { Dropdown } from "./Dropdown";
//icons import
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { deepPurple } from '@mui/material/colors';
import { UserDropdown } from "./UserDropdown";

export function Layout({ children, title }) {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [submenu, setSubmenu] = useState(false);
  const [itemToShow, setItemToShow] = useState("");
  // user avatar menu state
  const [userDropdown, setUserDropdown] = useState(false)

  useEffect(() => {
    if (!auth) return navigate("/login");
  }, []);

  return (
   <>
     <nav className="w-full h-[85px] lg:h-[90px] 2xl:h-[98px] sticky top-0 z-20 bg-[#288bcd] mx-auto grid grid-cols-[20%,80%] xl:grid-cols-[12%,80%,8%] items-center justify-center gap-2 xl:px-3">
      {/* logo image component */}
      <div className="">
        <Logo />
      </div>
      {/* drawer menu */}
      <div className="flex xl:hidden">
        <div className="w-full h-8 flex items-center justify-end pr-3">
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </div>
      </div>
      {/* items */}
      <div className="hidden xl:flex">
        <ul className="w-[100%] static h-14 flex items-center justify-center gap-1">
          {auth.user.role.name === "ADMINISTRADOR"
            ? nav_items_admin.map((item, index) => (
                <li
                  className="bg-[#288bcd] text-center rounded-lg  cursor-pointer flex flex-col items-center justify-center w-[100%] h-20 decoration-transparent text-white px-2 py-5"
                  key={index}
                  onMouseEnter={() => {
                    setSubmenu(true);
                    setItemToShow(item.title);
                  }}
                  onMouseLeave={() => {
                    setSubmenu(false);
                    setItemToShow("");
                  }}
                >
                  <div className="flex items-center justify-center">
                    <Link
                      className="font-semibold lg:text-[14px]"
                      to={item.path}
                    >
                      {item.title}
                    </Link>
                    <KeyboardArrowDownIcon className="lg:text-base text-xs" />
                  </div>
                  <div className="w-[100%] mx-auto flex items-center justify-center">
                    {submenu && itemToShow === item.title ? (
                      <Dropdown item={item.submenu} itemToShow={itemToShow} />
                    ) : null}
                  </div>
                </li>
              ))
            : nav_items_user.map((item, index) => (
              <li
                className="bg-[#288bcd] text-center  cursor-pointer flex flex-col items-center justify-between h-fit decoration-transparent text-white px-1 py-2 gap-5"
                key={index}
                onMouseEnter={() => {
                  setSubmenu(true);
                  setItemToShow(item.title);
                }}
                onMouseLeave={() => {
                  setSubmenu(false);
                  setItemToShow("");
                }}
              >
                <div className="flex items-center justify-center">
                  <Link
                    className="font-semibold lg:text-[14px]"
                    to={item.path}
                  >
                    {item.title}
                  </Link>
                  <KeyboardArrowDownIcon className="lg:text-base text-xs" />
                </div>
                <div className="w-[100%] absolute mt-2 mx-auto flex items-center justify-center rounded-md">
                  {submenu && itemToShow === item.title ? (
                    <Dropdown item={item.submenu} itemToShow={itemToShow} />
                  ) : null}
                </div>
              </li>
            ))}
        </ul>
      </div>
      {/* user avatar & menu */}
      <div className="hidden xl:flex ">
            <button className="w-auto p-2 h-auto flex items-center justify-center rounded-full bg-transparent hover:bg-slate-400"
            onClick={()=> setUserDropdown(prev => !prev)}
            >
            <Avatar sx={{ bgcolor: deepPurple[500] }}>OP</Avatar>
            </button>
            {
              userDropdown ? (
                <div className="mt-2 mx-auto flex items-center justify-center rounded-md">
                  <UserDropdown />
                </div>
              ) : null
            }
      </div>
    </nav>
     {/* page content */}
     <div className="w-[100%] h-screen flex-1 overflow-auto">
     <h6 className="text-gray-700 bg-white p-1 pl-3">
         {title}
     </h6>
     <div className="p-2 lg:overflow-x-auto">
         {children}
     </div>
 </div>
   </>
  );
}

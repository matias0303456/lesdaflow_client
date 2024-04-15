/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
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
     <nav className={`${mobileOpen ? 'w-full h-screen flex-col flex items-start justify-start absolute left-[-100%] transition-all ease-out duration-100' : 'xl:h-[90px] 2xl:h-[98px] sticky top-0 z-20 bg-[#288bcd] mx-auto grid grid-cols-[20%,80%] xl:grid-cols-[12%,80%,8%] items-center justify-center gap-2 xl:px-3'} `}>
      {/* logo image component */}
      <div className={`${mobileOpen ?'absolute z-40 h-[100%] w-[100%] right-[0%] top-0':'logo flex items justify-center'}`}>
        <Logo mobileOpen={mobileOpen}/>
      </div>
      {/* drawer menu */}
      <div 
      className={` ${mobileOpen ? 'flex items-start absolute z-40 h-[100%] right-[-100%] w-[100%] top-0' : ' flex xl:hidden w-full h-8  items-center justify-end pr-3'}`}
      >
        <div 
        onClick={()=> setMobileOpen(prev => !prev)}
        className={` ${mobileOpen ? 'flex items-start bg-[#288bcd] absolute z-40 h-[100%] right-[0%] w-[100%] top-0 transition-all ease-out duration-100' : 'flex xl:hidden w-full h-8  items-center justify-end pr-3 '}`}
        >
          {mobileOpen ? <CloseIcon
          className="absolute text-white right-7 top-7  transition-all ease-out duration-100"
          /> : <MenuIcon 
          className="text-white"
          />}
        </div>
      </div>
      {/* items */}
      <div className={`${mobileOpen ? 'text-white flex flex-col items-start justify-start z-40 absolute h-[90vh] right-[-100%] top-[50px] w-[100%]' : 'hidden xl:flex w-[100%] static h-14 items-center justify-center gap-1'}`}>
        <ul 
       className={`${mobileOpen ? 'text-white flex flex-col items-start justify-start z-40 absolute h-auto right-0 top-0 w-[100%]' : 'hidden xl:flex w-[100%] static h-14 items-center justify-center gap-1'}`}
        >
          {auth.user.role.name === "ADMINISTRADOR"
            ? nav_items_admin.map((item, index) => (
                <li
                  className={`${mobileOpen ? 'bg-[#288bcd] text-center ' : 'bg-[#288bcd] text-center rounded-lg '}cursor-pointer flex flex-col items-center justify-center w-[100%] h-20 decoration-transparent text-white px-2 py-5`}
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
            <div className={`${mobileOpen ? 'float-right' : 'flex-col'} flex  items-center justify-center`}>
                    <div className="flex items-center gap-1 justify-center">
                    <Link
                      className="font-semibold lg:text-[14px]"
                      to={item.path}
                    >
                      {item.title}
                    </Link>
                    {
                      mobileOpen ? (
                        <KeyboardArrowRightIcon className="lg:text-base text-xs"/>
                      ) : (
                        <KeyboardArrowDownIcon className="lg:text-base text-xs" />
                      )
                      
                    }
                    </div>
                    
                  <div className={`${mobileOpen ? 'ml-24 mt-14' : 'mx-auto'} w-[100%] flex  items-center justify-center`}>
                    {submenu && itemToShow === item.title ? (
                      <Dropdown item={item.submenu} mobileOpen={mobileOpen} />
                    ) : null}
                  </div>
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

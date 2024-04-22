/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../providers/AuthProvider";
import { Logo } from "./Logo";
import { nav_items_admin, nav_items_user } from "../../data/navigation-items";

//components imports
import Avatar from "@mui/material/Avatar";
import { Dropdown } from "./Dropdown";
//icons import
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

import { UserDropdown } from "./UserDropdown";
import useScreenSize from "../hooks/useScreenSize";
import { stringAvatar } from "../utils/avatarName";

export function Layout({ children, title }) {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [submenu, setSubmenu] = useState(false);
  const [itemToShow, setItemToShow] = useState("");

  // user avatar menu state & name rearrange
  const [userDropdown, setUserDropdown] = useState(false);
  const name = stringAvatar(`${auth.user.first_name} ${auth.user.last_name}`);

  useEffect(() => {
    if (!auth) return navigate("/login");
  }, []);

  //custom hook screen size
  const screenSize = useScreenSize();
  useEffect(() => {
    if (screenSize.width >= 960) {
      setMobileOpen(false);
    }
  }, [screenSize.width]);
  //handle userInfo dropdown state by responsive measures
  useEffect(() => {
    if (!mobileOpen) {
      setUserDropdown(false);
    } else {
      setUserDropdown(true);
    }
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`${
          mobileOpen
            ? "w-full h-screen items-start grid grid-cols-[20%,80%] justify-start absolute left-[-100%] transition-all ease-out duration-100"
            : "h-[80px] 2xl:h-[100px] sticky top-0 z-40 mx-auto grid grid-cols-[20%,80%] xl:grid-cols-[12%,80%,8%] items-center justify-center gap-2 xl:px-3"
        } bg-[#288bcd] `}
      >
        {/* logo image component */}
        <div
          className={`${
            mobileOpen ? "hidden" : "logo flex ml-2 items-center justify-center"
          }`}
        >
          <Logo mobileOpen={mobileOpen} />
        </div>
        {/* drawer menu */}
        <div
          className={` ${
            mobileOpen
              ? "flex flex-col items-start absolute z-40 h-[100%] right-[-100%] w-[100%] top-0 transition-colors ease-in-out delay-400"
              : " flex xl:hidden w-full h-8  items-center justify-end pr-3"
          }`}
        >
          <div
            onClick={() => setMobileOpen((prev) => !prev)}
            className={` ${
              mobileOpen
                ? "flex items-start bg-[#288bcd] absolute z-40 h-[100%] right-[0%] w-[100%] top-0 transition-all ease-out duration-100"
                : "flex xl:hidden w-full h-8  items-center justify-end "
            }`}
          >
            {mobileOpen ? (
              <CloseIcon className="absolute z-60 text-white right-6 top-7  transition-all ease-out duration-100" />
            ) : (
              <MenuIcon className="text-white right-6 top-7" />
            )}
          </div>
        </div>

        {/* items */}
        <div
          className={`${
            mobileOpen
              ? "text-white flex flex-col items-start justify-start z-40 absolute h-[70vh] right-[-100%] top-[55px] w-[100%]"
              : "hidden xl:flex w-[100%] static h-[100%] items-center justify-center gap-1"
          }`}
        >
          <ul
            className={`${
              mobileOpen
                ? "text-white flex flex-col items-start justify-start z-40 absolute h-full right-0 top-5 w-[100%]"
                : "hidden xl:flex w-[100%] static h-[100%] items-center justify-center gap-1"
            }`}
          >
            {auth.user.role.name === "ADMINISTRADOR"
              ? nav_items_admin.map((item, index) => (
                  <li
                    className={`${
                      mobileOpen
                        ? "bg-[#288bcd] text-center px-0 py-1 h-[55px]"
                        : "bg-[#288bcd] text-center rounded-md px-2 py-5 h-[100%] hover:bg-[#3276B1]"
                    } cursor-pointer flex flex-col items-center justify-center w-[100%] h-full decoration-transparent text-white `}
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
                    <div
                      className={`${
                        mobileOpen ? "float-right" : "flex-col"
                      } flex  items-center justify-start`}
                    >
                      <div className="flex items-center gap-1 justify-center">
                        <Link
                          className="font-semibold lg:text-[14px]"
                          to={item.path}
                        >
                          {item.title}
                        </Link>
                        {mobileOpen ? (
                          <KeyboardArrowRightIcon className="lg:text-base text-xs" />
                        ) : (
                          <KeyboardArrowDownIcon className="lg:text-base text-xs" />
                        )}
                      </div>

                      <div
                        className={`${
                          mobileOpen ? "ml-[92px] mt-[20px]" : "mx-auto"
                        } w-[100%] flex  items-center justify-center`}
                      >
                        {submenu && itemToShow === item.title ? (
                          <Dropdown
                            item={item.submenu}
                            mobileOpen={mobileOpen}
                            setMobileOpen={setMobileOpen}
                          />
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
        <div
          className={`${
            mobileOpen
              ? " grid grid-cols-[40%,60%] py-2 px-5 items-center justify-start absolute z-40 w-[100%] mx-auto right-[-100%] bottom-0"
              : "hidden xl:flex"
          }`}
        >
          <button
            title={`${auth.user.first_name} ${auth.user.last_name}`}
            className={`${
              mobileOpen
                ? " justify-start "
                : "justify-center hover:bg-slate-400"
            } w-auto p-2 h-auto flex items-center  rounded-full bg-transparent `}
            onClick={() => {
              if (!mobileOpen) {
                setUserDropdown((prev) => !prev);
              }
            }}
          >
            <Avatar sx={name.sx}>{name.children}</Avatar>
          </button>
          {userDropdown ? (
            <div
              className={`${
                mobileOpen ? "w-[100%] pl-2 h-5 justify-end" : "justify-center"
              } mt-2 mx-auto flex items-center  rounded-md`}
            >
              <UserDropdown
                {...stringAvatar(
                  `${auth.user.first_name} ${auth.user.last_name}`
                )}
                mobileOpen={mobileOpen}
              />
            </div>
          ) : null}
        </div>
      </nav>
      {/* page content */}
      <div className="w-[100%] h-screen ">
        <h6 className="text-[#455a64] text-[20px] leading-7 bg-white px-4 py-2">
          {title}
        </h6>
        <div className="px-4 py-2 mt-2">{children}</div>
      </div>
    </>
  );
}

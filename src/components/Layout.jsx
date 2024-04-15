import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../providers/AuthProvider";
import { Logo } from "./Logo";
import { nav_items_admin, nav_items_user } from "../../data/navigation-items";

//icons import
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Dropdown } from "./Dropdown";

export function Layout({ children, title }) {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [submenu, setSubmenu] = useState(false);
  const [itemToShow, setItemToShow] = useState("");

  console.log(auth.user.role.name);
  useEffect(() => {
    if (!auth) return navigate("/login");
  }, []);

  const handleLogout = () => {
    setAuth(null);
    localStorage.clear();
    navigate("/login");
  };
  console.log(itemToShow);
  return (
    <nav className="w-full h-[84px] sticky top-0 z-20 p-2 lg:p-4 bg-[#288bcd] mx-auto grid grid-cols-[20%,80%] xl:grid-cols-[10%,80%,10%] items-center justify-center gap-2">
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
            ))}
        </ul>
      </div>
    </nav>
  );
}

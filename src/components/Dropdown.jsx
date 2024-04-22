/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";


export const Dropdown = ( {item,mobileOpen, setMobileOpen}) => {

  return (
    <ul
      className={`${
        mobileOpen ? "float-right" : "top-[80px] shadow-2xl z-10"
      } w-32 h-auto absolute  xl:top-[80px] 2xl:top-[100px] text-start list-none text-[#288bcd]`}
    >
      {item?.map((subitem, index) => (
        <li
          key={index}
          className={
            `${mobileOpen ? "h-[35px] text-[12px]" : "h-[50px] text-sm"} bg-white rounded-[4px] cursor-pointer flex items-center justify-start w-[100%] mt-[1px] mx-auto  decoration-transparent p-1 hover:bg-[#3276B1] hover:text-white`
          }
        >
          <Link
            to={subitem.path}
            className="h-full flex items-center justify-center"
            onClick={() => setMobileOpen(false)}
          >
            {subitem.subtitle}
          </Link>
        </li>
      ))}
    </ul>
  );
};
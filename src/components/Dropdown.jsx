/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";


export const Dropdown = ( {item,mobileOpen, setMobileOpen}) => {

  return (
    <ul className={`${mobileOpen ? 'float-right' : 'top-[80px] shadow-2xl z-10'} w-32 h-auto absolute  xl:top-[85px] 2xl:top-[100px] text-start list-none text-[#288bcd]`}>
      {item?.map((subitem, index) => (
        <li key={index} className="bg-white rounded-[4px] rounded-t-none cursor-pointer flex items-center justify-start w-[100%] mx-auto h-[50px] decoration-transparent text-sm p-1 hover:bg-[#288bcd] hover:text-white">
          <Link to={subitem.path}
          className=""
          onClick={()=>setMobileOpen(false)}
          >
            {subitem.subtitle}
          </Link>
        </li>
      ))}
    </ul>

  );
};

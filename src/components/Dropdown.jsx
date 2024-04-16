/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";


export const Dropdown = ( {item,mobileOpen, setMobileOpen}) => {

  return (
    <ul className={`${mobileOpen ? 'float-right' : 'top-[80px]'} w-32 h-[100px] absolute  xl:top-[85px] 2xl:top-[90px] text-start list-none`}>
      {item?.map((subitem, index) => (
        <li key={index} className="bg-[#288bcd] rounded-[4px] cursor-pointer flex items-center justify-start w-[100%] mx-auto h-[50px] decoration-transparent text-white text-sm p-1 hover:bg-[#288bcd]/90">
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

/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

export const Dropdown = ({ item, mobileOpen, setMobileOpen }) => {

  const navigate = useNavigate();

  return (
    <ul
      className={`${mobileOpen ? "float-right" : "top-[80px] shadow-2xl z-10"
        } w-32 h-auto absolute xl:top-[56px] text-start list-none text-[#288bcd]`}
    >
      {item?.map((subitem, index) => (
        <li
          key={index}
          className={
            `${mobileOpen ? "h-[35px] text-[12px]" : "h-[50px] text-sm"} bg-white cursor-pointer flex items-center justify-start w-[100%] mx-auto decoration-transparent p-1 hover:bg-[#3276B1] hover:text-white`
          }
          onClick={() => {
            setMobileOpen(false)
            navigate(subitem.path)
          }}
        >
          {subitem.subtitle}
        </li>
      ))}
    </ul>
  );
};

import { Link } from "react-router-dom";


export const Dropdown = (item) => {

  return (
    <ul className="w-[10rem] h-[100px] absolute top-[5rem] text-start list-none ">
      {item?.item?.map((subitem, index) => (
        <li key={index} className="bg-[#288bcd] rounded-[4px] cursor-pointer flex items-center justify-start w-[100%] mx-auto h-[50px] decoration-transparent text-white text-sm p-1 hover:bg-[#288bcd]/80">
          <Link to={subitem.path}
          className=""
          >
            {subitem.subtitle}
          </Link>
        </li>
      ))}
    </ul>

  );
};

/* eslint-disable react/prop-types */
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Dropdown = ({ item, setMobileOpen }) => {

  const navigate = useNavigate();

  return (
    <Box sx={{
      position: 'absolute',
      backgroundColor: '#fff',
      top: 40,
      width: 200,
      zIndex: 10,
      boxShadow: '0 0 20px gray',
      left: 0
    }}>
      {item?.map((subitem, index) => (
        <Box key={index}
          sx={{
            color: '#078BCD',
            paddingY: 0.7,
            paddingX: 2,
            cursor: 'pointer',
            ':hover': { backgroundColor: '#3276B1', color: '#fff' }
          }}
          onClick={() => {
            setMobileOpen(false)
            navigate(subitem.path)
          }}>
          {subitem.subtitle}
        </Box>
      ))}
    </Box>
  );
};

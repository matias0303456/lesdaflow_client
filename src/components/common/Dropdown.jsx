/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

export const Dropdown = ({ item }) => {

  const navigate = useNavigate();

  return (
    <Box sx={{
      position: 'absolute',
      backgroundColor: '#fff',
      top: { xs: -7.5, md: 40 },
      width: 200,
      zIndex: 10,
      boxShadow: { xs: 'none', md: '0 0 20px gray' },
      left: { xs: 130, md: 0 }
    }}>
      {item?.map((subitem, index) => (
        <Box key={index}
          sx={{
            color: '#078BCD',
            paddingY: 1,
            paddingX: 2,
            cursor: 'pointer',
            ':hover': { backgroundColor: '#3276B1', color: '#fff' }
          }}
          onClick={() => navigate(subitem.path)}>
          {subitem.subtitle}
        </Box>
      ))}
    </Box>
  );
};

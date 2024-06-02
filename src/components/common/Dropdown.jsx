/* eslint-disable react/prop-types */
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

import { AuthContext } from "../../providers/AuthProvider";

export const Dropdown = ({ item }) => {

  const { auth } = useContext(AuthContext)

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
      {item?.filter(item => item.can_access.includes(auth.user.role)).map((subitem, index) => (
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

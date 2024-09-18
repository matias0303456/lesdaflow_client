/* eslint-disable react/prop-types */
// /* eslint-disable react/prop-types */
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar } from "@mui/material";

import { AuthContext } from '../../providers/AuthProvider';

import { UserDropdown } from "./UserDropdown"

import { nav_items } from "../../utils/navigation-items"
import Logo from '../../assets/logo.png'

export function Layout({ children, title }) {

  const { auth } = useContext(AuthContext)

  const navigate = useNavigate()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  const drawerWidth = 330

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const menuOptions = (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' }, width: '100%' }}>
      {nav_items.map((item) => (
        <Box
          key={item.name}
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: '#fff',
            paddingY: { xs: 2.5, md: 0 },
            ':hover': { backgroundColor: '#3276B1' }
          }}
          onClick={() => navigate(item.path)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.4, paddingX: 1.5, fontSize: 15, position: 'relative' }}>
            <Box>{item.title}</Box>
          </Box>
        </Box>
      ))}
    </Box>
  )

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#078BCD', paddingX: 1 }}>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' }, color: '#fff' }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', gap: 1, height: '100%' }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
              <img src={Logo} style={{ maxWidth: 80 }} />
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {menuOptions}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', paddingY: 1 }}>
            <Avatar sx={{ cursor: 'pointer' }} onClick={() => setShowUserDropdown(!showUserDropdown)}>
              {auth?.user.username.charAt(0).toUpperCase()}
            </Avatar>
            {showUserDropdown && <UserDropdown setShowUserDropdown={setShowUserDropdown} />}
          </Box>
        </Box>
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            }
          }}
        >
          <Box sx={{ display: { xs: 'flex', md: 'none' }, backgroundColor: '#078BCD', height: '100%' }}>
            {menuOptions}
          </Box>
        </Drawer>
        <Box className="w-[100%] h-screen">
          <h6 className="text-[#455a64] text-[20px] leading-7 bg-white px-4 py-2">
            {title}
          </h6>
          {children}
        </Box>
      </Box>
    </>
  )
}
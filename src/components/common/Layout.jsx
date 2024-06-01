/* eslint-disable react/prop-types */
// /* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import { Avatar } from "@mui/material";

import { AuthContext } from '../../providers/AuthProvider';

import { Dropdown } from "./Dropdown"
import { UserDropdown } from "./UserDropdown"

import { nav_items } from "../../utils/navigation-items"
import Logo from '../../assets/logo.png'

export function Layout({ children, title }) {

  const { auth } = useContext(AuthContext)

  const navigate = useNavigate()
  // const { pathname } = useLocation()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [submenu, setSubmenu] = useState(null)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [itemToShow, setItemToShow] = useState("")

  const drawerWidth = 240

  useEffect(() => {
    if (!auth) return navigate('/login')
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const menuOptions = (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'column', md: 'row' } }}>
      {nav_items.map((item, index) => (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          color: '#fff',
          ':hover': { backgroundColor: '#3276B1' }
        }}
          key={index}
          onMouseEnter={() => {
            setSubmenu(true)
            setItemToShow(item.title)
          }}
          onMouseLeave={() => {
            setSubmenu(false)
            setItemToShow("")
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.4, paddingX: 1, fontSize: 15 }}>
            <Box>{item.title}</Box>
            {mobileOpen ? (
              <KeyboardArrowRightIcon className='text-xs' />
            ) : (
              <KeyboardArrowDownIcon className='text-xs' />
            )}
          </Box>
          <Box className={`${mobileOpen ? "ml-[92px] mt-[20px]" : "mx-auto"} w-[100%] flex  items-center justify-center`}>
            {submenu && itemToShow === item.title ? (
              <Dropdown
                item={item.submenu}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
              />
            ) : null}
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
              {`${auth?.user.first_name.charAt(0).toUpperCase()}${auth?.user.last_name.charAt(0).toUpperCase()}`}
            </Avatar>
            {showUserDropdown && <UserDropdown />}
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
          <Box sx={{ display: { xs: 'flex', md: 'none' }, backgroundColor: '#078BCD' }}>
            {menuOptions}
          </Box>
        </Drawer>
        <Box className="w-[100%] h-screen">
          <h6 className="text-[#455a64] text-[20px] leading-7 bg-white px-4 py-2">
            {title}
          </h6>
          <Box className="px-4 py-2 mt-2">{children}</Box>
        </Box>
      </Box>
    </>
  );
}
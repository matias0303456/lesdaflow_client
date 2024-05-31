// /* eslint-disable react/prop-types */
// import { useContext, useEffect, useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import Avatar from "@mui/material/Avatar"
// import MenuIcon from "@mui/icons-material/Menu"
// import CloseIcon from "@mui/icons-material/Close"
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
// import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"

// import { AuthContext } from "../../providers/AuthProvider"
// import useScreenSize from "../../hooks/useScreenSize"

// import { Logo } from "./Logo"
// import { Dropdown } from "./Dropdown"
import { UserDropdown } from "./UserDropdown"

import { nav_items_admin, nav_items_user } from "../../utils/navigation-items"

// export function Layout({ children, title }) {

//   const { auth } = useContext(AuthContext)

//   const navigate = useNavigate()

//   const [mobileOpen, setMobileOpen] = useState(false)
//   const [submenu, setSubmenu] = useState(false)
//   const [itemToShow, setItemToShow] = useState("")
//   const [userDropdown, setUserDropdown] = useState(false)

//   const screenSize = useScreenSize()

//   useEffect(() => {
//     if (!auth) return navigate("/login")
//   }, [])

//   const name = stringAvatar(`${auth?.user.first_name} ${auth?.user.last_name}`)

//   useEffect(() => {
//     if (screenSize.width >= 960) {
//       setMobileOpen(false)
//     }
//   }, [screenSize.width])

//   useEffect(() => {
//     if (!mobileOpen) {
//       setUserDropdown(false)
//     } else {
//       setUserDropdown(true)
//     }
//   }, [mobileOpen])

//   return (
//     <>
//       <nav className={`${mobileOpen
//         ? "w-full h-screen items-start grid grid-cols-[20%,80%] justify-start absolute left-[-100%] transition-all ease duration-1000"
//         : "sticky top-0 z-40 mx-auto grid grid-cols-[20%,80%] xl:grid-cols-[12%,80%,8%] items-center justify-center gap-2 xl:px-3 transition-all ease-out duration-1000"
//         } bg-[#288bcd] `}
//       >
//         <div className={`${mobileOpen ? "hidden" : "logo flex ml-2 items-center justify-center w-28"}`}>
//           <Logo mobileOpen={mobileOpen} />
//         </div>
//         <div className={`${mobileOpen
//           ? "flex flex-col items-start absolute z-40 h-[100%] right-[-100%] w-[100%] top-0 transition-colors ease-in-out delay-1000"
//           : " flex xl:hidden w-full h-8  items-center justify-end pr-3"}`}
//         >
//           <div
//             onClick={() => setMobileOpen((prev) => !prev)}
//             className={` ${mobileOpen
//               ? "flex items-start bg-[#288bcd] absolute z-40 h-[100%] right-[0%] w-[100%] top-0 transition ease duration-2000"
//               : "flex xl:hidden w-full h-8  items-center justify-end transition ease duration-2000"
//               }`}
//           >
//             {mobileOpen ? (
//               <CloseIcon className="absolute z-60 text-white md:right-10 top-7 right-6" />
//             ) : (
//               <MenuIcon className="absolute text-white right-6 top-4" />
//             )}
//           </div>
//         </div>
//         <div className={`${mobileOpen
//           ? "text-white flex flex-col items-start justify-start z-40 absolute h-[70vh] right-[-100%] top-[55px] w-[100%]"
//           : "hidden xl:flex w-[100%] static h-[100%] items-center justify-center gap-1"}`}
//         >
//           <ul className={`${mobileOpen
//             ? "text-white flex flex-col items-start justify-start z-40 absolute h-full right-0 top-5 w-[100%]"
//             : "hidden xl:flex w-[100%] static h-[100%] items-center justify-center gap-1"
//             }`}
//           >
//             {auth?.user.role === "ADMINISTRADOR"
//               ? nav_items_admin.map((item, index) => (
//                 <li className={`${mobileOpen
//                   ? "text-center px-0 py-1 h-[55px] w-[30%] mx-auto"
//                   : "bg-[#288bcd] text-center px-2 h-[100%] hover:bg-[#3276B1] w-[100%]"
//                   } cursor-pointer flex flex-col items-center justify-center h-full decoration-transparent text-white`}
//                   key={index}
//                   onMouseEnter={() => {
//                     setSubmenu(true)
//                     setItemToShow(item.title)
//                   }}
//                   onMouseLeave={() => {
//                     setSubmenu(false)
//                     setItemToShow("")
//                   }}
//                 >
//                   <div className={`${mobileOpen ? "float-right" : "flex-col"} flex  items-center justify-start`}>
//                     <div className="flex items-center gap-1 justify-center">
//                       <Link className="lg:text-[14px]" to={item.path}>
//                         {item.title}
//                       </Link>
//                       {mobileOpen ? (
//                         <KeyboardArrowRightIcon className="lg:text-base text-xs" />
//                       ) : (
//                         <KeyboardArrowDownIcon className="lg:text-base text-xs" />
//                       )}
//                     </div>
//                     <div className={`${mobileOpen ? "ml-[92px] mt-[20px]" : "mx-auto"} w-[100%] flex  items-center justify-center`}>
//                       {submenu && itemToShow === item.title ? (
//                         <Dropdown
//                           item={item.submenu}
//                           mobileOpen={mobileOpen}
//                           setMobileOpen={setMobileOpen}
//                         />
//                       ) : null}
//                     </div>
//                   </div>
//                 </li>
//               ))
//               : nav_items_user.map((item, index) => (
//                 <li
//                   className="bg-[#288bcd] text-center  cursor-pointer flex flex-col items-center justify-between h-fit decoration-transparent text-white px-1 py-2 gap-5"
//                   key={index}
//                   onMouseEnter={() => {
//                     setSubmenu(true)
//                     setItemToShow(item.title)
//                   }}
//                   onMouseLeave={() => {
//                     setSubmenu(false)
//                     setItemToShow("")
//                   }}
//                 >
//                   <div className="flex items-center justify-center">
//                     <Link className="lg:text-[14px]" to={item.path}>
//                       {item.title}
//                     </Link>
//                     <KeyboardArrowDownIcon className="lg:text-base text-xs" />
//                   </div>
//                   <div className="w-[100%] absolute mt-2 mx-auto flex items-center justify-center">
//                     {submenu && itemToShow === item.title ? (
//                       <Dropdown item={item.submenu} itemToShow={itemToShow} />
//                     ) : null}
//                   </div>
//                 </li>
//               ))}
//           </ul>
//         </div>
//         <div className={`${mobileOpen
//           ? " grid grid-cols-[40%,60%] py-2 px-5 items-center justify-start absolute z-40 w-[100%] mx-auto right-[-100%] bottom-0"
//           : "hidden xl:flex"}`}
//         >
//           <button
//             title={`${auth?.user.first_name} ${auth?.user.last_name}`}
//             className={`${mobileOpen
//               ? " justify-end mr-3"
//               : "justify-center hover:bg-slate-400"
//               } w-auto p-2 h-auto flex items-center rounded-full bg-transparent`}
//             onClick={() => {
//               if (!mobileOpen) {
//                 setUserDropdown((prev) => !prev)
//               }
//             }}
//           >
//             <Avatar sx={name.sx}>{name.children.toUpperCase()}</Avatar>
//           </button>
//           {userDropdown ? (
//             <div className={`${mobileOpen ? "w-[100%] pl-2 h-auto ml-3 justify-start" : "justify-center"} mt-2 mx-auto flex items-center`}>
//               <UserDropdown
//                 {...stringAvatar(`${auth?.user.first_name} ${auth?.user.last_name} capitalize`)}
//                 mobileOpen={mobileOpen}
//               />
//             </div>
//           ) : null}
//         </div>
//       </nav>
//       <div className="w-[100%] h-screen">
//         <h6 className="text-[#455a64] text-[20px] leading-7 bg-white px-4 py-2">
//           {title}
//         </h6>
//         <div className="px-4 py-2 mt-2">{children}</div>
//       </div>
//     </>
//   )
// }

import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import { AuthContext } from '../../providers/AuthProvider';

import Logo from '../../assets/logo.png'
import { Avatar } from "@mui/material";

export function Layout({ children, title }) {

  const { auth, setAuth } = useContext(AuthContext)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [submenu, setSubmenu] = useState(null)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const drawerWidth = 240

  useEffect(() => {
    if (!auth) return navigate('/login')
  }, [])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#078BCD',
          paddingY: 1,
          paddingX: 2
        }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, color: '#fff' }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ width: '70%', display: 'flex', gap: 3 }}>
            <Box sx={{ display: { xs: 'none', sm: 'none', md: 'flex' }, alignItems: 'center' }}>
              <img src={Logo} width={80} />
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'start', width: '70%' }}>

            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
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
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', backgroundColor: '#078BCD' }}>

          </Box>
        </Drawer>
        <div className="w-[100%] h-screen">
          <h6 className="text-[#455a64] text-[20px] leading-7 bg-white px-4 py-2">
            {title}
          </h6>
          <div className="px-4 py-2 mt-2">{children}</div>
        </div>
      </Box>
    </>
  );
}
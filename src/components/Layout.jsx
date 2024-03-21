import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

import { AuthContext } from '../providers/AuthProvider';

import Logo from '../assets/logo.jpeg'

export function Layout({ children, title }) {
    const { auth, setAuth } = useContext(AuthContext)
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [submenu, setSubmenu] = useState(null)

    const drawerWidth = 240

    useEffect(() => {
        if (!auth) return navigate('/login')
    }, [])

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column', // Change to column layout
            height: '100vh' // Make sure the container spans the full viewport height
        }}>
            <Box sx={{ // Top bar
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#078BCD',
                padding: 1
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
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '10%' }}>
                        <img src={Logo} width={80} />
                    </Box>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'space-between', width: '90%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onMouseEnter={() => setSubmenu('clients')} onMouseLeave={() => setSubmenu(null)}>
                            <Typography variant='p' color="#fff" sx={{ position: 'relative' }}>
                                Clientes <span style={{ fontSize: '.7rem' }}>▼</span>
                                <Box sx={{ position: 'absolute', top: '100%', left: '0', display: submenu === 'clients' ? 'block' : 'none', background: '#fff', padding: '10px', zIndex: 2 }}>
                                    <ul style={{ listStyle: 'none' }}>
                                        <li>ABM Clientes</li>
                                        <li>Visitas</li>
                                        <li>Cuentas Corrientes</li>
                                        <li>Reporte Cuenta Corriente</li>
                                    </ul>
                                </Box>
                            </Typography>
                        </Box>

                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '30%', justifyContent: 'end' }}>
                    <Typography variant='p' color="#fff">
                        {auth.user.username} <span style={{ fontSize: '.7rem' }}>▼</span>
                    </Typography>
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
                    },
                }}
            >
                <div>
                    {/* Your drawer content here */}
                </div>
            </Drawer>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                {/* Main content */}
                {children}
            </Box>
        </Box>
    );
}

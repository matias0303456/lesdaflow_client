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

    const handleLogout = () => {
        setAuth(null)
        localStorage.clear()
        navigate('/login')
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
                paddingLeft: 2,
                paddingRight: 2
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
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'start', width: '70%' }}>
                        <Box className="sections" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 2, paddingLeft: 1, paddingRight: 1 }} onMouseEnter={() => setSubmenu('clients')} onMouseLeave={() => setSubmenu(null)}>
                            <Typography variant='p' color="#fff" sx={{ position: 'relative', whiteSpace: 'nowrap' }}>
                                Clientes <span style={{ fontSize: '.7rem' }}>▼</span>
                                <Box sx={{ boxShadow: '0 0 10px gray', position: 'absolute', top: '168%', left: '-7px', width: '220px', display: submenu === 'clients' ? 'block' : 'none', background: '#fff', zIndex: 2 }}>
                                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                        <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/clientes')}>ABM Clientes</li>
                                        <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/visitas')}>Visitas</li>
                                        {/* <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption'>Cuentas Corrientes</li> */}
                                        <li style={{ color: '#078BCD', padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/reporte-cta-cte')}>Reporte Cuenta Corriente</li>
                                    </ul>
                                </Box>
                            </Typography>
                        </Box>
                        <Box className="sections" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', paddingLeft: 1, paddingRight: 1 }} onMouseEnter={() => setSubmenu('seller')} onMouseLeave={() => setSubmenu(null)}>
                            <Typography variant='p' color="#fff" sx={{ position: 'relative', whiteSpace: 'nowrap' }}>
                                Vendedor <span style={{ fontSize: '.7rem' }}>▼</span>
                                <Box sx={{ boxShadow: '0 0 10px gray', position: 'absolute', top: '168%', left: '-7px', width: '220px', display: submenu === 'seller' ? 'block' : 'none', background: '#fff', zIndex: 2 }}>
                                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                        <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/vendedor')}>ABM Vendedor</li>
                                    </ul>
                                </Box>
                            </Typography>
                        </Box>
                        {auth.user.role.name === 'ADMINISTRADOR' &&
                            <Box className="sections" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', paddingLeft: 1, paddingRight: 1 }} onMouseEnter={() => setSubmenu('suppliers')} onMouseLeave={() => setSubmenu(null)}>
                                <Typography variant='p' color="#fff" sx={{ position: 'relative', whiteSpace: 'nowrap' }}>
                                    Proveedores <span style={{ fontSize: '.7rem' }}>▼</span>
                                    <Box sx={{ boxShadow: '0 0 10px gray', position: 'absolute', top: '168%', left: '-7px', width: '220px', display: submenu === 'suppliers' ? 'block' : 'none', background: '#fff', zIndex: 2 }}>
                                        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                            <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/proveedores')}>ABM Proveedores</li>
                                        </ul>
                                    </Box>
                                </Typography>
                            </Box>
                        }
                        <Box className="sections" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', paddingLeft: 1, paddingRight: 1 }} onMouseEnter={() => setSubmenu('sales')} onMouseLeave={() => setSubmenu(null)}>
                            <Typography variant='p' color="#fff" sx={{ position: 'relative', whiteSpace: 'nowrap' }}>
                                Ventas <span style={{ fontSize: '.7rem' }}>▼</span>
                                <Box sx={{ boxShadow: '0 0 10px gray', position: 'absolute', top: '168%', left: '-7px', width: '220px', display: submenu === 'sales' ? 'block' : 'none', background: '#fff', zIndex: 2 }}>
                                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                        <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/ventas')}>ABM Ventas</li>
                                        {/* <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption'>Búsqueda de Ventas</li> */}
                                        <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/reporte-ventas')}>Reporte de Ventas</li>
                                    </ul>
                                </Box>
                            </Typography>
                        </Box>
                        <Box className="sections" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', paddingLeft: 1, paddingRight: 1 }} onMouseEnter={() => setSubmenu('products')} onMouseLeave={() => setSubmenu(null)}>
                            <Typography variant='p' color="#fff" sx={{ position: 'relative', whiteSpace: 'nowrap' }}>
                                Productos <span style={{ fontSize: '.7rem' }}>▼</span>
                                <Box sx={{ boxShadow: '0 0 10px gray', position: 'absolute', top: '168%', left: '-7px', width: '220px', display: submenu === 'products' ? 'block' : 'none', background: '#fff', zIndex: 2 }}>
                                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                        {auth.user.role.name === 'ADMINISTRADOR' &&
                                            <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/productos')}>ABM Productos</li>
                                        }
                                        <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/productos')}>Lista de Precios</li>
                                        <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/reporte-productos')}>Reporte de Productos</li>
                                    </ul>
                                </Box>
                            </Typography>
                        </Box>
                        <Box className="sections" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', paddingLeft: 1, paddingRight: 1 }} onMouseEnter={() => setSubmenu('budgets')} onMouseLeave={() => setSubmenu(null)}>
                            <Typography variant='p' color="#fff" sx={{ position: 'relative', whiteSpace: 'nowrap' }}>
                                Presupuestos <span style={{ fontSize: '.7rem' }}>▼</span>
                                <Box sx={{ boxShadow: '0 0 10px gray', position: 'absolute', top: '168%', left: '-7px', width: '220px', display: submenu === 'budgets' ? 'block' : 'none', background: '#fff', zIndex: 2 }}>
                                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                        <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/presupuestos')}>ABM Presupuesto</li>
                                    </ul>
                                </Box>
                            </Typography>
                        </Box>
                        <Box className="sections" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', paddingLeft: 1, paddingRight: 1 }} onMouseEnter={() => setSubmenu('registers')} onMouseLeave={() => setSubmenu(null)}>
                            <Typography variant='p' color="#fff" sx={{ position: 'relative', whiteSpace: 'nowrap' }}>
                                Cajas <span style={{ fontSize: '.7rem' }}>▼</span>
                                <Box sx={{ boxShadow: '0 0 10px gray', position: 'absolute', top: '168%', left: '-7px', width: '220px', display: submenu === 'registers' ? 'block' : 'none', background: '#fff', zIndex: 2 }}>
                                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                        <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/cajas')}>Movimientos de Cajas</li>
                                    </ul>
                                </Box>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box className="sections" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 2, paddingLeft: 1, paddingRight: 1 }} onMouseEnter={() => setSubmenu('user')} onMouseLeave={() => setSubmenu(null)}>
                    <Typography variant='p' color="#fff" sx={{ position: 'relative', whiteSpace: 'nowrap' }}>
                        {auth.user.username} <span style={{ fontSize: '.7rem' }}>▼</span>
                        <Box sx={{ boxShadow: '0 0 10px gray', position: 'absolute', top: '168%', left: '-40px', display: submenu === 'user' ? 'block' : 'none', background: '#fff', zIndex: 2 }}>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/cambiar-contraseña')}>Cambiar contraseña</li>
                                <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={handleLogout}>Salir</li>
                            </ul>
                        </Box>
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
                    }
                }}
            >
                <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', backgroundColor: '#078BCD' }}>
                    <Box className="sections" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 2 }} onClick={() => !submenu ? setSubmenu('clients') : setSubmenu(null)}>
                        <Typography variant='p' color="#fff" sx={{ position: 'relative', whiteSpace: 'nowrap' }}>
                            Clientes <span style={{ fontSize: '.7rem' }}>▼</span>
                            <Box sx={{ boxShadow: '0 0 10px gray', position: 'absolute', top: '168%', left: '-15px', width: '240px', display: submenu === 'clients' ? 'block' : 'none', background: '#fff', zIndex: 2 }}>
                                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                    <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/clientes')}>ABM Clientes</li>
                                    <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/visitas')}>Visitas</li>
                                    {/* <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption'>Cuentas Corrientes</li> */}
                                    <li style={{ color: '#078BCD', padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/reporte-cta-cte')}>Reporte Cuenta Corriente</li>
                                </ul>
                            </Box>
                        </Typography>
                    </Box>
                    <Box className="sections" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 2 }} onClick={() => !submenu ? setSubmenu('seller') : setSubmenu(null)}>
                        <Typography variant='p' color="#fff" sx={{ position: 'relative', whiteSpace: 'nowrap' }}>
                            Vendedor <span style={{ fontSize: '.7rem' }}>▼</span>
                            <Box sx={{ boxShadow: '0 0 10px gray', position: 'absolute', top: '168%', left: '-15px', width: '240px', display: submenu === 'seller' ? 'block' : 'none', background: '#fff', zIndex: 2 }}>
                                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                    <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/vendedor')}>ABM Vendedor</li>
                                </ul>
                            </Box>
                        </Typography>
                    </Box>
                    {auth.user.role.name === 'ADMINISTRADOR' &&
                        <Box className="sections" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 2 }} onClick={() => !submenu ? setSubmenu('suppliers') : setSubmenu(null)}>
                            <Typography variant='p' color="#fff" sx={{ position: 'relative', whiteSpace: 'nowrap' }}>
                                Proveedores <span style={{ fontSize: '.7rem' }}>▼</span>
                                <Box sx={{ boxShadow: '0 0 10px gray', position: 'absolute', top: '168%', left: '-15px', width: '240px', display: submenu === 'suppliers' ? 'block' : 'none', background: '#fff', zIndex: 2 }}>
                                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                        <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/proveedores')}>ABM Proveedores</li>
                                    </ul>
                                </Box>
                            </Typography>
                        </Box>
                    }
                    <Box className="sections" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 2 }} onClick={() => !submenu ? setSubmenu('sales') : setSubmenu(null)}>
                        <Typography variant='p' color="#fff" sx={{ position: 'relative', whiteSpace: 'nowrap' }}>
                            Ventas <span style={{ fontSize: '.7rem' }}>▼</span>
                            <Box sx={{ boxShadow: '0 0 10px gray', position: 'absolute', top: '168%', left: '-15px', width: '240px', display: submenu === 'sales' ? 'block' : 'none', background: '#fff', zIndex: 2 }}>
                                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                    <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/ventas')}>ABM Ventas</li>
                                    {/* <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption'>Búsqueda de Ventas</li> */}
                                    <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/reporte-ventas')}>Reporte de Ventas</li>
                                </ul>
                            </Box>
                        </Typography>
                    </Box>
                    <Box className="sections" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 2 }} onClick={() => !submenu ? setSubmenu('products') : setSubmenu(null)}>
                        <Typography variant='p' color="#fff" sx={{ position: 'relative', whiteSpace: 'nowrap' }}>
                            Productos <span style={{ fontSize: '.7rem' }}>▼</span>
                            <Box sx={{ boxShadow: '0 0 10px gray', position: 'absolute', top: '168%', left: '-15px', width: '240px', display: submenu === 'products' ? 'block' : 'none', background: '#fff', zIndex: 2 }}>
                                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                    {auth.user.role.name === 'ADMINISTRADOR' &&
                                        <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/productos')}>ABM Productos</li>
                                    }
                                    <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/productos')}>Lista de Precios</li>
                                    <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/reporte-productos')}>Reporte de Productos</li>
                                </ul>
                            </Box>
                        </Typography>
                    </Box>
                    <Box className="sections" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 2 }} onClick={() => !submenu ? setSubmenu('budgets') : setSubmenu(null)}>
                        <Typography variant='p' color="#fff" sx={{ position: 'relative', whiteSpace: 'nowrap' }}>
                            Presupuestos <span style={{ fontSize: '.7rem' }}>▼</span>
                            <Box sx={{ boxShadow: '0 0 10px gray', position: 'absolute', top: '168%', left: '-15px', width: '240px', display: submenu === 'budgets' ? 'block' : 'none', background: '#fff', zIndex: 2 }}>
                                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                    <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/presupuestos')}>ABM Presupuesto</li>
                                </ul>
                            </Box>
                        </Typography>
                    </Box>
                    <Box className="sections" sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 2 }} onClick={() => !submenu ? setSubmenu('registers') : setSubmenu(null)}>
                        <Typography variant='p' color="#fff" sx={{ position: 'relative', whiteSpace: 'nowrap' }}>
                            Cajas <span style={{ fontSize: '.7rem' }}>▼</span>
                            <Box sx={{ boxShadow: '0 0 10px gray', position: 'absolute', top: '168%', left: '-15px', width: '240px', display: submenu === 'registers' ? 'block' : 'none', background: '#fff', zIndex: 2 }}>
                                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                    <li style={{ color: '#078BCD', marginBottom: 1, padding: 5, paddingLeft: 15, paddingRight: 15 }} className='menuOption' onClick={() => navigate('/cajas')}>Movimientos de Cajas</li>
                                </ul>
                            </Box>
                        </Typography>
                    </Box>
                </Box>
            </Drawer>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
                <Typography variant='h6' sx={{
                    color: 'gray',
                    backgroundColor: '#fff',
                    padding: 1,
                    paddingLeft: 3
                }}>
                    {title}
                </Typography>
                <Box sx={{ padding: 2 }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
}

import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Dropdown } from '@mui/base/Dropdown';
import { Menu } from '@mui/base/Menu';
import { MenuButton as BaseMenuButton } from '@mui/base/MenuButton';
import { MenuItem as BaseMenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { styled } from '@mui/system';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputSharpIcon from '@mui/icons-material/InputSharp';
import OutputSharpIcon from '@mui/icons-material/OutputSharp';
import MonetizationOnSharpIcon from '@mui/icons-material/MonetizationOnSharp';
import ProductionQuantityLimitsSharpIcon from '@mui/icons-material/ProductionQuantityLimitsSharp';
import Person2SharpIcon from '@mui/icons-material/Person2Sharp';
import LocalShippingSharpIcon from '@mui/icons-material/LocalShippingSharp';
import ManageAccountsSharpIcon from '@mui/icons-material/ManageAccountsSharp';
import PermContactCalendarSharpIcon from '@mui/icons-material/PermContactCalendarSharp';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import AssessmentSharpIcon from '@mui/icons-material/AssessmentSharp';
import PaymentsSharpIcon from '@mui/icons-material/PaymentsSharp';

import { AuthContext } from '../providers/AuthProvider';

import Logo from '../assets/logo.png'

export function Layout({ children, title }) {

    const { auth, setAuth } = useContext(AuthContext)

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [mobileOpen, setMobileOpen] = useState(false)

    const drawerWidth = 240

    useEffect(() => {
        if (!auth) return navigate('/veroshop/login')
    }, [])

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen)
    }

    const drawer = (
        <div>
            <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <img src={Logo} width={80} />
                </Box>
            </Toolbar>
            <Divider />
            <List>
                <ListItem key={1} disablePadding sx={{ background: pathname === '/veroshop/productos' ? grey[100] : '#fff' }}>
                    <ListItemButton onClick={() => navigate('/veroshop/productos')}>
                        <ListItemIcon>
                            <ProductionQuantityLimitsSharpIcon />
                        </ListItemIcon>
                        <ListItemText primary="Productos" />
                    </ListItemButton>
                </ListItem>
                {auth?.user.role.name === 'ADMINISTRADOR' &&
                    <>
                        <ListItem key={2} disablePadding sx={{ background: pathname === '/veroshop/ingresos' ? grey[100] : '#fff' }}>
                            <ListItemButton onClick={() => navigate('/veroshop/ingresos')}>
                                <ListItemIcon>
                                    <InputSharpIcon />
                                </ListItemIcon>
                                <ListItemText primary="Ingresos" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={2} disablePadding sx={{ background: pathname === '/veroshop/egresos' ? grey[100] : '#fff' }}>
                            <ListItemButton onClick={() => navigate('/veroshop/egresos')}>
                                <ListItemIcon>
                                    <OutputSharpIcon />
                                </ListItemIcon>
                                <ListItemText primary="Egresos" />
                            </ListItemButton>
                        </ListItem>
                    </>
                }
                <ListItem key={3} disablePadding sx={{ background: pathname === '/veroshop/ventas' ? grey[100] : '#fff' }}>
                    <ListItemButton onClick={() => navigate('/veroshop/ventas')}>
                        <ListItemIcon>
                            <MonetizationOnSharpIcon />
                        </ListItemIcon>
                        <ListItemText primary="Ventas" />
                    </ListItemButton>
                </ListItem>
                <ListItem key={4} disablePadding sx={{ background: pathname === '/veroshop/clientes' ? grey[100] : '#fff' }}>
                    <ListItemButton onClick={() => navigate('/veroshop/clientes')}>
                        <ListItemIcon>
                            <Person2SharpIcon />
                        </ListItemIcon>
                        <ListItemText primary="Clientes" />
                    </ListItemButton>
                </ListItem>
                {auth?.user.role.name === 'ADMINISTRADOR' &&
                    <>
                        <ListItem key={6} disablePadding sx={{ background: pathname === '/veroshop/proveedores' ? grey[100] : '#fff' }}>
                            <ListItemButton onClick={() => navigate('/veroshop/proveedores')}>
                                <ListItemIcon>
                                    <LocalShippingSharpIcon />
                                </ListItemIcon>
                                <ListItemText primary="Proveedores" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key={7} disablePadding sx={{ background: pathname === '/veroshop/usuarios' ? grey[100] : '#fff' }}>
                            <ListItemButton onClick={() => navigate('/veroshop/usuarios')}>
                                <ListItemIcon>
                                    <PermContactCalendarSharpIcon />
                                </ListItemIcon>
                                <ListItemText primary="Usuarios" />
                            </ListItemButton>
                        </ListItem>
                    </>
                }
                <ListItem key={8} disablePadding sx={{ background: pathname === '/veroshop/reportes' ? grey[100] : '#fff' }}>
                    <ListItemButton onClick={() => navigate('/veroshop/reportes')}>
                        <ListItemIcon>
                            <AssessmentSharpIcon />
                        </ListItemIcon>
                        <ListItemText primary="Reportes" />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{
                        display: 'flex',
                        width: '100%',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        gap: { xs: 1, sm: 2 },
                        padding: { xs: 2, sm: 0 }
                    }}>
                        <Typography variant="h6" noWrap component="div">
                            {title}
                        </Typography>
                        <Dropdown>
                            <MenuButton>{auth?.user.username}</MenuButton>
                            <Menu slots={{ listbox: Listbox }}>
                                {auth?.user.role.name === 'ADMINISTRADOR' &&
                                    <MenuItem
                                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                        onClick={() => navigate('/veroshop/perfil')}>
                                        <ManageAccountsSharpIcon />
                                        Perfil
                                    </MenuItem>
                                }
                                <MenuItem
                                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                                    onClick={() => {
                                        navigate('/veroshop/login')
                                        setAuth(null)
                                        localStorage.removeItem('auth')
                                    }}>
                                    <LogoutSharpIcon />
                                    Salir
                                </MenuItem>
                            </Menu>
                        </Dropdown>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}

const blue = {
    50: '#F0F7FF',
    100: '#C2E0FF',
    200: '#99CCF3',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E6',
    700: '#0059B3',
    800: '#004C99',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const Listbox = styled('ul')(
    ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    box-sizing: border-box;
    padding: 6px;
    margin: 12px 0;
    min-width: 200px;
    border-radius: 12px;
    overflow: auto;
    outline: 0px;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    box-shadow: 0px 4px 30px ${theme.palette.mode === 'dark' ? grey[900] : grey[200]};
    z-index: 1;
    `,
);

const MenuItem = styled(BaseMenuItem)(
    ({ theme }) => `
    list-style: none;
    padding: 8px;
    border-radius: 8px;
    cursor: default;
    user-select: none;
    cursor: pointer;
  
    &:last-of-type {
      border-bottom: none;
    }
  
    &.${menuItemClasses.focusVisible} {
      outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
      background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    }
  
    &.${menuItemClasses.disabled} {
      color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
    }
  
    &:hover:not(.${menuItemClasses.disabled}) {
      background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[50]};
      color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
    }
    `,
);

const MenuButton = styled(BaseMenuButton)(
    ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 8px 16px;
    border-radius: 8px;
    color: white;
    transition: all 150ms ease;
    cursor: pointer;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  
    &:hover {
      background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
    }
  
    &:active {
      background: ${theme.palette.mode === 'dark' ? grey[700] : grey[100]};
    }
  
    &:focus-visible {
      box-shadow: 0 0 0 4px ${theme.palette.mode === 'dark' ? blue[300] : blue[200]};
      outline: none;
    }
    `,
);

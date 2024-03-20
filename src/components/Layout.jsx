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
import AccountBalanceWalletSharpIcon from '@mui/icons-material/AccountBalanceWalletSharp';

import { AuthContext } from '../providers/AuthProvider';

import Logo from '../assets/logo.jpeg'

export function Layout({ children, title }) {

    const { auth, setAuth } = useContext(AuthContext)

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [mobileOpen, setMobileOpen] = useState(false)

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
            justifyContent: 'space-between',
            backgroundColor: '#078BCD',
            padding: 1
        }}>
            <Box sx={{ width: '70%', display: 'flex', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '10%' }}>
                    <img src={Logo} width={80} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '90%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='p' color="#fff">
                            Clientes
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='p' color="#fff">
                            Vendedor
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='p' color="#fff">
                            Vendedor
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='p' color="#fff">
                            Ventas
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='p' color="#fff">
                            Productos
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='p' color="#fff">
                            Presupuestos
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='p' color="#fff">
                            Cajas
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '30%', justifyContent: 'end' }}>
                <Typography variant='p' color="#fff">
                    {auth.user.username}
                </Typography>
            </Box>
        </Box>
    );
}

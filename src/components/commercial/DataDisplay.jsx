/* eslint-disable react/prop-types */
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

export function DataDisplay({ data }) {
    return (
        <>
            <Box>
                <Typography variant="h6">Descuentos</Typography>
                {data.map((supplier, index) => (
                    <Box key={index}>
                        <Typography variant="p" gutterBottom>
                            {supplier.supplier_name}
                        </Typography>
                        <List sx={{ display: 'flex', p: 0 }}>
                            {supplier.discounts.map((i, idx) => (
                                <ListItem key={idx} sx={{ width: 50, p: 0 }}>
                                    <ListItemText
                                        primary={i.name || 's/n'}
                                        secondary={`${i.value}%`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                ))}
            </Box>
            <Box>
                <Typography variant="h6">Recargos</Typography>
                {data.map((supplier, index) => (
                    <Box key={index}>
                        <Typography variant="p" gutterBottom>
                            {supplier.supplier_name}
                        </Typography>
                        <List sx={{ display: 'flex', p: 0 }}>
                            {supplier.surcharges.map((i, idx) => (
                                <ListItem key={idx} sx={{ width: 50, p: 0 }}>
                                    <ListItemText
                                        primary={i.name || 's/n'}
                                        secondary={`${i.value}%`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                ))}
            </Box>
        </>
    );
}

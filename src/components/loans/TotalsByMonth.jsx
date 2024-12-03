/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";

import { getLoansPendingInterest, getLoansTotalInterest } from "../../utils/helpers";

export function TotalsByMonth({ loans }) {
    return (
        <Box sx={{ mt: 1 }}>
            <Typography variant="body2" align="right">
                Total prestado: {`$${loans.reduce((prev, curr) => prev + parseFloat(curr.amount), 0).toFixed(2)}`}
            </Typography>
            <Typography variant="body2" align="right">
                Interés total: {`$${getLoansTotalInterest(loans)}`}
            </Typography>
            <Typography variant="body2" align="right">
                Interés pendiente: {`$${getLoansPendingInterest(loans)}`}
            </Typography>
        </Box>
    )
}
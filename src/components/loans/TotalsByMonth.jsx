/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";

import { getLoansPendingInterest, getLoansTotalInterest, getLoansTotalInterestWithSpendings } from "../../utils/helpers";

export function TotalsByMonth({ loans, includeSpendings, spendings }) {
    return (
        <Box sx={{ mt: 1 }}>
            <Typography variant="body2" align="right">
                Interés total: {`$${getLoansTotalInterestWithSpendings(getLoansTotalInterest(loans), includeSpendings, spendings)}`}
            </Typography>
            <Typography variant="body2" align="right">
                Interés pendiente: {`$${getLoansPendingInterest(loans)}`}
            </Typography>
        </Box>
    )
}
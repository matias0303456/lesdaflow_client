/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";

import { getLoansMonths, getLoansYears } from "../../utils/helpers";

export function ShowLoansDetails({ loans, frequency }) {

    const loansYears = getLoansYears(loans)
    const loansMonths = getLoansMonths(loans)

    return (
        <Box>
            {loans.length > 0 ?
                <Box>

                </Box> :
                <Typography variant="body1" align="center" mt={3}>
                    No hay datos para mostrar.
                </Typography>
            }
        </Box>
    )
}
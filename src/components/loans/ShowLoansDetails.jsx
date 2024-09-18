import { Box, Typography } from "@mui/material";

import { getLoansDates } from "../../utils/helpers";

export function ShowLoansDetails({ loans, frequency }) {

    const dates = getLoansDates(loans)

    return (
        <Box>
            {dates.length > 0 ?
                <></> :
                <Typography variant="body1" align="center" mt={3}>
                    No hay datos para mostrar.
                </Typography>
            }
        </Box>
    )
}
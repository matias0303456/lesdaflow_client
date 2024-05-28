import Typography from '@mui/material/Typography';

import { Layout } from "../components/common/Layout";

export function Error() {
    return (
        <Layout title="Error 404">
            <Typography variant="h6" noWrap component="div">
                Página no encontrada.
            </Typography>
        </Layout>
    )
}
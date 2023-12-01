import { Layout } from "../components/Layout";
import { DataGrid } from '../components/DataGrid'

export function Inventory() {

    const headCells = [
        {
            id: 'name',
            numeric: false,
            disablePadding: true,
            label: 'Dessert (100g serving)',
        },
        {
            id: 'calories',
            numeric: true,
            disablePadding: false,
            label: 'Calories',
        },
        {
            id: 'fat',
            numeric: true,
            disablePadding: false,
            label: 'Fat (g)',
        },
        {
            id: 'carbs',
            numeric: true,
            disablePadding: false,
            label: 'Carbs (g)',
        },
        {
            id: 'protein',
            numeric: true,
            disablePadding: false,
            label: 'Protein (g)',
        },
    ];

    const rows = [
        { id: 1, name: 'asd', calories: 2, fat: 4, carbs: 23, protein: 234 },
        { id: 2, name: 'sds', calories: 4, fat: 2, carbs: 233, protein: 2234 }
    ]

    return (
        <Layout title="Inventario">
            <DataGrid title="Inventario actual" headCells={headCells} rows={rows} />
        </Layout>
    )
}
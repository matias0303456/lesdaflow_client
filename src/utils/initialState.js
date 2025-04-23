export const initialState = {
    'clients': [],
    'articles': [],
    'sales': [],
    'payments': {
        count: 0,
        data: [],
        page: 0,
        offset: 25,
        filter_fields: { sale_id: '', from: '', to: '', p_type: '', created_by: '', loaded: false },
        filters: ''
    },
    'users': [],
    'registers': [],
    'suppliers': [],
    'budgets': []
}
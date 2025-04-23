export const initialState = {
    'clients': {
        count: 0,
        data: [],
        page: 0,
        offset: 25,
        filter_fields: { first_name: '', last_name: '', loaded: false },
        filters: ''
    },
    'articles': {
        count: 0,
        data: [],
        page: 0,
        offset: 25,
        filter_fields: { code: '', details: '', supplier_id: '', loaded: false },
        filters: ''
    },
    'sales': {
        count: 0,
        data: [],
        page: 0,
        offset: 25,
        filter_fields: { client: '', id: '', user: '', date: '', type: '', loaded: false },
        filters: ''
    },
    'payments': {
        count: 0,
        data: [],
        page: 0,
        offset: 25,
        filter_fields: { sale_id: '', from: '', to: '', p_type: '', created_by: '', loaded: false },
        filters: ''
    },
    'users': [],
    'registers': {
        count: 0,
        data: [],
        page: 0,
        offset: 25,
        filter_fields: { user: '', loaded: false },
        filters: ''
    },
    'suppliers': [],
    'budgets': {
        count: 0,
        data: [],
        page: 0,
        offset: 25,
        filter_fields: { from: '', to: '', user: '', client: '', type: '', loaded: false },
        filters: ''
    },
    'discounts': {
        count: 0,
        data: [],
        page: 0,
        offset: 25,
        filter_fields: { loaded: false },
        filters: ''
    }
}
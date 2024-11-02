export const initialState = {
    'clients': {
        count: 0,
        data: [],
        page: 0,
        offset: 25,
        filter_fields: { first_name: '', last_name: '', work_place: '', loaded: false },
        filters: ''
    },
    'products': {
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
        filter_fields: { client: '', work_place: '', id: '', user: '', date: '', type: '', loaded: false },
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
    'users': {
        count: 0,
        data: [],
        page: 0,
        offset: 25,
        filter_fields: { name: '', role: '', loaded: false },
        filters: ''
    },
    'registers': {
        count: 0,
        data: [],
        page: 0,
        offset: 25,
        filter_fields: { user: '', loaded: false },
        filters: ''
    },
    'suppliers': {
        count: 0,
        data: [],
        page: 0,
        offset: 25,
        filter_fields: { name: '', loaded: false },
        filters: ''
    },
    'budgets': {
        count: 0,
        data: [],
        page: 0,
        offset: 25,
        filter_fields: { from: '', to: '', user: '', client: '', type: '', loaded: false },
        filters: ''
    }
}
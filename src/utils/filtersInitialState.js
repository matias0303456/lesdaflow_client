export const filtersInitialState = {
    'clients': {
        page: 0,
        offset: 25,
        filters: { first_name: '', last_name: '', work_place: '' }
    },
    'products': {
        page: 0,
        offset: 25,
        filters: { code: '', details: '', supplier_id: '' }
    },
    'sales': {
        page: 0,
        offset: 25,
        filters: { client: '', work_place: '', id: '', user: '', date: '', type: '' }
    },
    'payments': {
        page: 0,
        offset: 25,
        filters: ''
    },
    'users': {
        page: 0,
        offset: 25,
        filters: { name: '', role: '' }
    },
    'registers': {
        page: 0,
        offset: 25,
        filters: { user: '' }
    },
    'suppliers': {
        page: 0,
        offset: 25,
        filters: { name: '' }
    },
    'budgets': {
        page: 0,
        offset: 25,
        filters: { from: '', to: '', user: '', client: '', type: '' }
    },
    'discounts': {
        page: 0,
        offset: 25,
        filters: ''
    }
}
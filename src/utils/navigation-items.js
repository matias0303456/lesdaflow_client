export const nav_items = [
  {
    title: "Usuarios",
    name: "users",
    submenu: [
      {
        subtitle: "ABM Usuarios",
        path: "/usuarios",
        can_access: ['ADMINISTRADOR']
      }
    ],
    can_access: ['ADMINISTRADOR']
  },
  {
    title: "Clientes",
    name: "clients",
    submenu: [
      {
        subtitle: "ABM Clientes",
        path: "/clientes",
        can_access: ['ADMINISTRADOR', 'VENDEDOR', 'CHOFER']
      },
      {
        subtitle: "Cuentas Corrientes",
        path: "/cta-cte",
        can_access: ['ADMINISTRADOR', 'VENDEDOR']
      },
      // {
      //   subtitle: "Reporte Cuenta Corriente",
      //   path: "/reporte-cta-cte",
      //   can_access: ['ADMINISTRADOR', 'VENDEDOR']
      // },
      {
        subtitle: "Clientes por Vendedor",
        path: "/clientes-vendedor",
        can_access: ['ADMINISTRADOR']
      }
    ],
    can_access: ['ADMINISTRADOR', 'VENDEDOR', 'CHOFER']
  },
  {
    title: "Proveedores",
    name: "suppliers",
    submenu: [
      {
        subtitle: "ABM Proveedores",
        path: "/proveedores",
        can_access: ['ADMINISTRADOR']
      }
    ],
    can_access: ['ADMINISTRADOR']
  },
  {
    title: "Ventas",
    name: "sales",
    submenu: [
      {
        subtitle: "ABM Ventas",
        path: "/ventas",
        can_access: ['ADMINISTRADOR', 'VENDEDOR']
      },
      {
        subtitle: "Busqueda de ventas",
        path: "/ventas-busqueda",
        can_access: ['ADMINISTRADOR', 'VENDEDOR']
      },
      {
        subtitle: "Reporte de Ventas",
        path: "/reporte-ventas",
        can_access: ['ADMINISTRADOR', 'VENDEDOR']
      },
      {
        subtitle: "Preparación de Ventas",
        path: "/prep-ventas",
        can_access: ['CHOFER']
      },
      {
        subtitle: "Entrega de Ventas",
        path: "/entrega-ventas",
        can_access: ['CHOFER']
      },
      {
        subtitle: "Comisiones",
        path: "/comisiones",
        can_access: ['ADMINISTRADOR', 'VENDEDOR']
      }
    ],
    can_access: ['ADMINISTRADOR', 'CHOFER', 'VENDEDOR']
  },
  {
    title: "Productos",
    name: "products",
    submenu: [
      {
        subtitle: "ABM de Productos",
        path: "/productos",
        can_access: ['ADMINISTRADOR', 'VENDEDOR', 'CHOFER']
      },
      {
        subtitle: "Lista de Precios",
        path: "/lista-precios",
        can_access: ['ADMINISTRADOR', 'VENDEDOR']
      },
      {
        subtitle: "Reporte de Productos",
        path: "/reporte-productos",
        can_access: ['ADMINISTRADOR', 'VENDEDOR', 'CHOFER']
      },
      {
        subtitle: "Actualizar Precios Por Proveedor",
        path: "/producto-actualiza-precio-proveedor",
        can_access: ['ADMINISTRADOR']
      },
      {
        subtitle: "Actualizar Precios Por Producto",
        path: "/producto-actualiza-precio",
        can_access: ['ADMINISTRADOR']
      },
      {
        subtitle: "Ingresos por cantidad",
        path: "/ingresos-cantidad",
        can_access: ['ADMINISTRADOR']
      },
      {
        subtitle: "Historial",
        path: "/historial",
        can_access: ['ADMINISTRADOR']
      }
    ],
    can_access: ['ADMINISTRADOR', 'VENDEDOR', 'CHOFER']
  },
  {
    title: "Presupuestos",
    name: "budgets",
    submenu: [
      {
        subtitle: "ABM Presupuesto",
        path: "/presupuestos",
        can_access: ['ADMINISTRADOR', 'VENDEDOR']
      }
    ],
    can_access: ['ADMINISTRADOR', 'VENDEDOR']
  },
  {
    title: "Cajas",
    name: "registers",
    submenu: [
      {
        subtitle: "Movimientos de cajas",
        path: "/movimientos-caja",
        can_access: ['ADMINISTRADOR', 'CHOFER', 'VENDEDOR']
      }
    ],
    can_access: ['ADMINISTRADOR', 'CHOFER', 'VENDEDOR']
  },
  {
    title: "Reportes",
    name: "reports",
    submenu: [
      // {
      //   subtitle: "Movimientos de cajas",
      //   path: "/reporte-movimientos-caja",
      //   can_access: ['ADMINISTRADOR', 'CHOFER', 'VENDEDOR']
      // },
      {
        subtitle: "Clientes bloqueados",
        path: "/reportes-clientes-bloqueados",
        can_access: ['ADMINISTRADOR']
      },
      {
        subtitle: "Liquidaciones",
        path: "/liquidaciones",
        can_access: ['ADMINISTRADOR', 'VENDEDOR']
      }
    ],
    can_access: ['ADMINISTRADOR', 'VENDEDOR']
  }
]

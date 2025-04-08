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
        can_access: ['ADMINISTRADOR', 'VENDEDOR']
      },
    ],
    can_access: ['ADMINISTRADOR', 'VENDEDOR']
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
        subtitle: "Descuentos",
        path: "/descuentos",
        can_access: ['ADMINISTRADOR']
      }
    ],
    can_access: ['ADMINISTRADOR', 'VENDEDOR']
  },
  {
    title: "Artículos",
    name: "articles",
    submenu: [
      {
        subtitle: "ABM de Artículos",
        path: "/articulos",
        can_access: ['ADMINISTRADOR', 'VENDEDOR']
      },
      {
        subtitle: "Lista de Precios",
        path: "/lista-precios",
        can_access: ['ADMINISTRADOR', 'VENDEDOR']
      },
      {
        subtitle: "Reporte de Artículos",
        path: "/reporte-articulos",
        can_access: ['ADMINISTRADOR', 'VENDEDOR']
      },
      {
        subtitle: "Actualizar Precios Por Proveedor",
        path: "/articulo-actualiza-precio-proveedor",
        can_access: ['ADMINISTRADOR']
      },
      {
        subtitle: "Actualizar Precios Por Artículo",
        path: "/articulo-actualiza-precio",
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
    can_access: ['ADMINISTRADOR', 'VENDEDOR']
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
        can_access: ['ADMINISTRADOR', 'VENDEDOR']
      }
    ],
    can_access: ['ADMINISTRADOR', 'VENDEDOR']
  }
]

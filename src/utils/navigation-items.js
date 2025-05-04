export const nav_items = [
  {
    title: "Usuarios",
    path: "/usuarios",
    can_access: ['ADMINISTRADOR']
  },
  {
    title: "Clientes",
    path: "/clientes",
    can_access: ['ADMINISTRADOR', 'VENDEDOR']
  },
  {
    title: "Proveedores",
    path: "/proveedores",
    can_access: ['ADMINISTRADOR']
  },
  {
    title: "Boletas",
    path: "/boletas",
    can_access: ['ADMINISTRADOR', 'VENDEDOR']
  },
  {
    title: "Artículos",
    path: "/articulos",
    can_access: ['ADMINISTRADOR', 'VENDEDOR']
  },
  {
    title: "Presupuestos",
    path: "/presupuestos",
    can_access: ['ADMINISTRADOR', 'VENDEDOR']
  },
  {
    title: "Cajas",
    path: "/cajas",
    can_access: ['ADMINISTRADOR', 'VENDEDOR']
  }
]

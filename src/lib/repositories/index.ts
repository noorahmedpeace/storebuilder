/**
 * Repository layer barrel. Each vertical owns its own module so parallel
 * feature work never collides on a single shared file. Tenant scoping lives
 * in ./tenant (`tenantWhere`).
 */
export { tenantWhere } from "./tenant";
export { listStores, createStore } from "./stores";
export { listProducts, createProduct } from "./products";
export { listOrders } from "./orders";
export { listCustomers } from "./customers";
export { listInventory } from "./inventory";
export { listCategories } from "./catalog";
export { listCoupons } from "./marketing";

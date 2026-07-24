# Ordering API

The backend for the mobile ordering app: serves the menu and turns a guest's chosen lines into a paid order. Mock-first — data lives in memory so the app runs before a database exists.

## Language

**Menu**:
The list of products a guest can order. Served whole; the backend owns the canonical copy.
_Avoid_: Catalog, listing

**Product**:
A single orderable item on the menu, with a base price and optional modifiers.
_Avoid_: Item, dish, SKU

**Modifier**:
An option on a product that changes its price (size, extras).
_Avoid_: Option, addon, customization

**Order line**:
One product plus its chosen modifiers and quantity within an order. Arrives as references only — the backend prices it, the caller never sends a price.
_Avoid_: Line item, cart line, order item

**Order**:
A priced, paid set of order lines belonging to one guest. The result of a successful checkout.
_Avoid_: Purchase, transaction, receipt

**Guest**:
A person ordering without an account. Identity arrives with the order, not from a login.
_Avoid_: User, customer, account

**Operator**:
Whoever runs the shop. Sees every order, may cancel any of them. Unauthenticated in this prototype — nothing tells an operator from a guest (see ADR-0003).
_Avoid_: Admin, staff, manager

**Payment**:
The mock charge run while creating an order. Succeeds, or declines the whole order.
_Avoid_: Transaction, charge

## Not in this context

**Cart** lives only on the device — see `front/CONTEXT.md`. The backend never stores one, so a cart has no backend representation and `Cart line` is not a term here.

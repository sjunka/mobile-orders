# Ordering

The mobile ordering app: a guest browses a menu, customizes products, fills a cart, and checks out with mock payment. Built mock-first so the UI runs before the backend exists.

## Language

**Menu**:
The list of products a guest can order, fetched from the backend.
_Avoid_: Catalog, listing

**Product**:
A single orderable item on the menu, with a base price and optional modifiers.
_Avoid_: Item, dish, SKU

**Modifier**:
An option on a product that changes its price (size, extras). Chosen when adding to the cart.
_Avoid_: Option, addon, customization

**Cart**:
The guest's in-progress selection before checkout. Local to the device, not yet an order.
_Avoid_: Basket, bag

**Cart line**:
One product plus its chosen modifiers and quantity within the cart. Carries its own computed price.
_Avoid_: Line item, cart item, entry

**Checkout**:
The step that turns a cart into an order: collects guest identity and runs mock payment.
_Avoid_: Purchase, buy

**Order**:
A cart the guest has paid for. The result of a successful checkout.
_Avoid_: Purchase, transaction, receipt

**Cancelled order**:
An order an operator has called off. Stays in the list; one-way, no un-cancel; no refund is modelled.
_Avoid_: Deleted, voided, refunded

**Guest**:
A person ordering without an account. Identity is collected at checkout, not via login.
_Avoid_: User, customer, account

**Operator**:
Whoever runs the shop. Sees every order, may cancel any of them. Unauthenticated in this prototype — the Orders screen is a header button on the Menu that any guest can tap.
_Avoid_: Admin, staff, manager

**Payment**:
The mock charge run at checkout. Succeeds or is declined based on the input.
A card number ending in `0002` is declined (e.g. `4000000000000002`); any other
16-digit number is paid.
_Avoid_: Transaction, charge

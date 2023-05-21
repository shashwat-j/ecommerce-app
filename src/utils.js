export function getItemCount(cartItems){
    return cartItems.reduce((sum, cartItem)=> cartItem.quantity+sum, 0);
}

export function getSubtotal(cartItem){
    return cartItem.reduce((sum, {product, quantity})=> product.price * quantity + sum, 0)
}
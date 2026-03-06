import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty = 1, color = null, size = null) => {
        const productId = product._id || product.id;
        const stock = product.stock || product.countInStock || 0;

        setCartItems((prevItems) => {
            const existItem = prevItems.find((x) =>
                (x._id === productId || x.id === productId) && x.color === color && x.size === size
            );

            if (existItem) {
                const newQty = existItem.qty + qty;
                if (newQty > stock) {
                    toast.error(`Only ${stock} items available in stock`);
                    return prevItems;
                }
                return prevItems.map((x) =>
                    (x._id === productId || x.id === productId) && x.color === color && x.size === size
                        ? { ...x, qty: newQty }
                        : x
                );
            } else {
                if (qty > stock) {
                    toast.error(`Only ${stock} items available in stock`);
                    return prevItems;
                }
                return [...prevItems, {
                    _id: productId,
                    name: product.name,
                    image: product.images?.[0]?.url || product.image,
                    price: product.discountPrice || product.price,
                    countInStock: stock,
                    qty,
                    color,
                    size
                }];
            }
        });
    };

    const removeFromCart = (id, color, size) => {
        setCartItems((prevItems) =>
            prevItems.filter((x) => !(x._id === id && x.color === color && x.size === size))
        );
    };

    const updateQty = (id, color, size, qty) => {
        const newQty = Number(qty);
        setCartItems((prevItems) =>
            prevItems.map((x) => {
                if (x._id === id && x.color === color && x.size === size) {
                    if (newQty > x.countInStock) {
                        toast.error(`Only ${x.countInStock} items available`);
                        return x;
                    }
                    return { ...x, qty: newQty };
                }
                return x;
            })
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 5000 ? 0 : 250;
    const totalPrice = itemsPrice + shippingPrice;

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQty,
            clearCart,
            itemsPrice,
            shippingPrice,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};

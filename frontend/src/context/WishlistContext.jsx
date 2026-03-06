import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState(() => {
        const savedWishlist = localStorage.getItem('wishlistItems');
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });

    useEffect(() => {
        localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const toggleWishlist = (product) => {
        setWishlistItems((prevItems) => {
            const isExist = prevItems.find((x) => x._id === product._id);
            if (isExist) {
                return prevItems.filter((x) => x._id !== product._id);
            } else {
                return [...prevItems, {
                    _id: product._id,
                    name: product.name,
                    image: product.images?.[0]?.url || product.image,
                    price: product.discountPrice || product.price,
                    rating: product.rating,
                    reviewsCount: product.reviewsCount
                }];
            }
        });
    };

    const isInWishlist = (id) => {
        return wishlistItems.some((x) => x._id === id);
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            toggleWishlist,
            isInWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

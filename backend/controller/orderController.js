import asyncHandler from 'express-async-handler';
import Order from '../models/order.js';
import Product from '../models/product.js';
import sendEmail from '../utils/sendEmail.js';
import User from '../models/user.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const processedOrderItems = orderItems.map((x) => {
            const productId = x.product || x._id || x.id;
            if (!productId) {
                res.status(400);
                throw new Error(`Product ID is missing for item: ${x.name}`);
            }
            return {
                ...x,
                product: productId,
                _id: undefined,
            };
        });

        const order = new Order({
            user: req.user._id,
            orderItems: processedOrderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        // Decrement stock and increment soldCount for each item
        for (const item of processedOrderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: {
                    stock: -item.qty,
                    soldCount: item.qty
                }
            });
        }

        // Send Confirmation Email
        try {
            const user = await User.findById(req.user._id);
            if (user && user.email) {
                await sendEmail({
                    email: user.email,
                    userName: user.name,
                    orderId: createdOrder._id.toString().toUpperCase().slice(-6),
                    totalPrice: createdOrder.totalPrice,
                });
            }
        } catch (emailError) {
            console.error('Order confirmation email failed to send:', emailError);
        }

        res.status(201).json(createdOrder);
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
        .populate('user', 'id name email')
        .sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        // Only admin or the user who placed the order can see it
        if (req.user.role === 'admin' || order.user._id.toString() === req.user._id.toString()) {
            res.json(order);
        } else {
            res.status(401);
            throw new Error('Not authorized to view this order');
        }
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        const oldStatus = order.status;
        order.status = req.body.status || order.status;

        if (order.status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        // Restore stock and decrement soldCount if order is cancelled
        if (order.status === 'Cancelled' && oldStatus !== 'Cancelled') {
            for (const item of order.orderItems) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: {
                        stock: item.qty,
                        soldCount: -item.qty
                    }
                });
            }
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

export {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus
};

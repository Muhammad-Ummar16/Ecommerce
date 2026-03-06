import asyncHandler from 'express-async-handler';
import Product from '../models/product.js';
import Order from '../models/order.js';
import User from '../models/user.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments({ role: 'user' });
    const orderCount = await Order.countDocuments();

    // Revenue calculation
    const orders = await Order.find({ isPaid: true });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Status counts
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });
    const processingOrders = await Order.countDocuments({ status: 'Processing' });
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });

    // Recent orders
    const recentOrders = await Order.find({})
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

    res.json({
        stats: {
            products: productCount,
            users: userCount,
            orders: orderCount,
            revenue: totalRevenue.toFixed(2),
            cancelled: cancelledOrders,
            processing: processingOrders,
            pending: pendingOrders,
            delivered: deliveredOrders
        },
        recentOrders
    });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Cannot delete admin user');
        }
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export { getDashboardStats, getAllUsers, deleteUser };

import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ClientLayout from '../components/ClientLayout';

// Client Pages
const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const SignupPage = lazy(() => import('../pages/SignupPage'));
const ShopPage = lazy(() => import('../pages/ShopPage'));
const CollectionsPage = lazy(() => import('../pages/CollectionsPage'));
const ProductDetailsPage = lazy(() => import('../pages/ProductDetailsPage'));
const NewArrivalsPage = lazy(() => import('../pages/NewArrivalsPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const WishlistPage = lazy(() => import('../pages/WishlistPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const OrderDetailsPageClient = lazy(() => import('../pages/OrderDetailsPage'));
const OrderHistoryPage = lazy(() => import('../pages/OrderHistoryPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));

// Admin Pages & Layout
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminLayout = lazy(() => import('../components/admin/AdminLayout'));
const ProductListPage = lazy(() => import('../pages/admin/ProductListPage'));
const ProductFormPage = lazy(() => import('../pages/admin/ProductFormPage'));
const OrderListPage = lazy(() => import('../pages/admin/OrderListPage'));
const OrderDetailsPage = lazy(() => import('../pages/admin/OrderDetailsPage'));
const UserListPage = lazy(() => import('../pages/admin/UserListPage'));
const InquiryListPage = lazy(() => import('../pages/admin/InquiryListPage'));
const SettingsPage = lazy(() => import('../pages/admin/SettingsPage'));
const CategoryListPage = lazy(() => import('../pages/admin/CategoryListPage'));

// Fallback Page
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfaf8]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D3028]"></div>
    </div>
);

const AppRoutes = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Client Routes Wrapper */}
                <Route element={<ClientLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/collections" element={<CollectionsPage />} />
                    <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/product/:id" element={<ProductDetailsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order/:id" element={<OrderDetailsPageClient />} />
                    <Route path="/orders" element={<OrderHistoryPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/contact-us" element={<ContactPage />} />
                </Route>

                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />

                    {/* Product Management */}
                    <Route path="products" element={<ProductListPage />} />
                    <Route path="products/add" element={<ProductFormPage />} />
                    <Route path="products/edit/:id" element={<ProductFormPage />} />

                    {/* Order Management */}
                    <Route path="orders" element={<OrderListPage />} />
                    <Route path="orders/:id" element={<OrderDetailsPage />} />

                    {/* Other Admin Routes (Placeholders) */}
                    <Route path="categories" element={<CategoryListPage />} />
                    <Route path="users" element={<UserListPage />} />
                    <Route path="inquiries" element={<InquiryListPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;

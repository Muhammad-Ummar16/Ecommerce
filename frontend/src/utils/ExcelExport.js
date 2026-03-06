import * as XLSX from 'xlsx';

/**
 * Utility to export data to Excel with formatting
 * @param {Array} data - Array of objects to export
 * @param {String} fileName - Name of the file to download
 * @param {String} sheetName - Name of the worksheet
 * @param {Array} columnWidths - Optional array of objects e.g. [{wch: 20}, {wch: 30}]
 */
export const exportToExcel = (data, fileName, sheetName = 'Sheet1', columnWidths = []) => {
    // Create worksheet from data
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Set column widths if provided
    if (columnWidths.length > 0) {
        worksheet['!cols'] = columnWidths;
    }

    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate buffer and trigger download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/**
 * Formatter for Product Data
 */
export const formatProductData = (products) => {
    return products.map(p => ({
        'Product ID': p._id,
        'Name': p.name,
        'Category': p.category?.name || 'N/A',
        'Price (PKR)': p.price,
        'Stock Remaining': p.stock,
        'Total Sold': p.soldCount || 0,
        'Total Revenue (PKR)': (p.price * (p.soldCount || 0)).toLocaleString(),
        'Discount %': p.discountPercent || 0,
        'Created At': new Date(p.createdAt).toLocaleDateString()
    }));
};

/**
 * Formatter for Order Data
 */
export const formatOrderData = (orders) => {
    return orders.map(o => ({
        'Order ID': o._id,
        'Customer': o.user?.name || 'Guest',
        'Email': o.user?.email || 'N/A',
        'Total Items': o.orderItems.length,
        'Amount Paid (PKR)': o.totalPrice,
        'Status': o.status,
        'Payment': o.paymentMethod,
        'Shipping To': `${o.shippingAddress.city}, ${o.shippingAddress.country}`,
        'Date': new Date(o.createdAt).toLocaleDateString()
    }));
};

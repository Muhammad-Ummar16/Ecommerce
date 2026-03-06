import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    whatsappNumber: {
        type: String,
        default: '+923000000000',
    },
    siteName: {
        type: String,
        default: 'MZ Wear',
    },
    orderDeliveryDays: {
        type: String,
        default: '5',
    },
    siteUrl: {
        type: String,
        default: 'https://mzwear.pk',
    },
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;

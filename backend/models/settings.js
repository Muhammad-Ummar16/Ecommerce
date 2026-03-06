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
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;

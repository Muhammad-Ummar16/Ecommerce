import asyncHandler from "express-async-handler";
import Settings from "../models/settings.js";

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public
const getSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = await Settings.create({});
    }
    res.json(settings);
});

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();

    if (settings) {
        settings.whatsappNumber = req.body.whatsappNumber || settings.whatsappNumber;
        settings.siteName = req.body.siteName || settings.siteName;
        settings.orderDeliveryDays = req.body.orderDeliveryDays || settings.orderDeliveryDays;
        settings.siteUrl = req.body.siteUrl || settings.siteUrl;

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } else {
        const newSettings = await Settings.create(req.body);
        res.json(newSettings);
    }
});

export { getSettings, updateSettings };

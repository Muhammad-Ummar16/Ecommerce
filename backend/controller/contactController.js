import asyncHandler from 'express-async-handler';
import Contact from '../models/contact.js';

// @desc    Submit a contact form
// @route   POST /api/contacts
// @access  Public
const submitContact = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({
        name,
        email,
        subject,
        message
    });

    if (contact) {
        res.status(201).json({ message: 'Message sent successfully' });
    } else {
        res.status(400);
        throw new Error('Invalid contact data');
    }
});

// @desc    Get all inquiries
// @route   GET /api/contacts
// @access  Private/Admin
const getAllInquiries = asyncHandler(async (req, res) => {
    const inquiries = await Contact.find({}).sort({ createdAt: -1 });
    res.json(inquiries);
});

// @desc    Update inquiry status
// @route   PUT /api/contacts/:id
// @access  Private/Admin
const updateInquiryStatus = asyncHandler(async (req, res) => {
    const inquiry = await Contact.findById(req.params.id);

    if (inquiry) {
        inquiry.status = req.body.status || inquiry.status;
        const updatedInquiry = await inquiry.save();
        res.json(updatedInquiry);
    } else {
        res.status(404);
        throw new Error('Inquiry not found');
    }
});

// @desc    Delete inquiry
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
const deleteInquiry = asyncHandler(async (req, res) => {
    const inquiry = await Contact.findById(req.params.id);

    if (inquiry) {
        await Contact.deleteOne({ _id: inquiry._id });
        res.json({ message: 'Inquiry removed' });
    } else {
        res.status(404);
        throw new Error('Inquiry not found');
    }
});

export {
    submitContact,
    getAllInquiries,
    updateInquiryStatus,
    deleteInquiry
};

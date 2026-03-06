import express from 'express';
import {
    submitContact,
    getAllInquiries,
    updateInquiryStatus,
    deleteInquiry
} from '../controller/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(submitContact)
    .get(protect, admin, getAllInquiries);

router.route('/:id')
    .put(protect, admin, updateInquiryStatus)
    .delete(protect, admin, deleteInquiry);

export default router;

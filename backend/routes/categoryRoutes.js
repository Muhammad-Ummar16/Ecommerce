import express from 'express';
import { getCategories, createCategory, getCategoryById, updateCategory, deleteCategory } from '../controller/categoryController.js';

const router = express.Router();

router.route('/').get(getCategories).post(createCategory);
router.route('/:id').get(getCategoryById).put(updateCategory).delete(deleteCategory);

export default router;

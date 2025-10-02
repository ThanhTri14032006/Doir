import { Router } from 'express';
import * as categoriesController from '../controllers/categories.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', categoriesController.getCategories);
router.get('/:id', categoriesController.getCategoryById);

router.post('/', authenticate, authorize('admin'), categoriesController.createCategory);
router.put('/:id', authenticate, authorize('admin'), categoriesController.updateCategory);
router.delete('/:id', authenticate, authorize('admin'), categoriesController.deleteCategory);

export default router;
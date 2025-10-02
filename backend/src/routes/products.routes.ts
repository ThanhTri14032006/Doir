import { Router } from 'express';
import { body } from 'express-validator';
import * as productsController from '../controllers/products.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', productsController.getProducts);
router.get('/featured', productsController.getFeaturedProducts);
router.get('/new-arrivals', productsController.getNewArrivals);
router.get('/:id', productsController.getProductById);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('name').trim().notEmpty(),
    body('slug').trim().notEmpty(),
    body('category_id').isInt(),
    body('price').isFloat({ min: 0 }),
    body('sku').trim().notEmpty()
  ],
  productsController.createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  productsController.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  productsController.deleteProduct
);

export default router;
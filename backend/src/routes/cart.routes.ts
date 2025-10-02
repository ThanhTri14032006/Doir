import { Router } from 'express';
import { body } from 'express-validator';
import * as cartController from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/items', [
  body('product_id').isInt(),
  body('quantity').isInt({ min: 1 })
], cartController.addToCart);
router.put('/items/:id', cartController.updateCartItem);
router.delete('/items/:id', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;
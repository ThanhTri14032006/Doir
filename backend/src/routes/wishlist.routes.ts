import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { addToWishlist, clearWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlist.controller';

const router = Router();

router.use(authenticate);

router.get('/', getWishlist);
router.post('/items', body('product_id').isInt({ gt: 0 }), addToWishlist);
router.delete('/items/:productId', param('productId').isInt({ gt: 0 }), removeFromWishlist);
router.delete('/', clearWishlist);

export default router;




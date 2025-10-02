import { Router } from 'express';
import { body } from 'express-validator';
import * as ordersController from '../controllers/orders.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', ordersController.getUserOrders);
router.get('/:id', ordersController.getOrderById);
router.post('/', [
  // Accept either an existing address id OR full address fields
  body('shipping_address_id').optional().isInt().toInt(),
  body('payment_method').notEmpty(),
  body('address_line1').if(body('shipping_address_id').not().exists()).notEmpty(),
  body('city').if(body('shipping_address_id').not().exists()).notEmpty(),
  body('state').if(body('shipping_address_id').not().exists()).notEmpty(),
  body('postal_code').if(body('shipping_address_id').not().exists()).notEmpty(),
  body('country').if(body('shipping_address_id').not().exists()).notEmpty()
], ordersController.createOrder);

router.get('/admin/all', authorize('admin'), ordersController.getAllOrders);
router.put('/:id/status', authorize('admin'), ordersController.updateOrderStatus);

export default router;
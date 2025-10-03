import { Router } from 'express';
import { createContact } from '../controllers/contacts.controller';

const router = Router();

router.post('/', createContact);

export default router;



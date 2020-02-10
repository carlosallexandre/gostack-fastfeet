import { Router } from 'express';
import multer from 'multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import AvatarController from './app/controllers/AvatarController';
import DeliveryController from './app/controllers/DeliveryController';

import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.get('/recipients', RecipientController.index);
routes.get('/recipient/:id', RecipientController.show);
routes.post('/recipient', RecipientController.store);
routes.put('/recipient/:id', RecipientController.update);
routes.delete('/recipient/:id', RecipientController.destroy);

routes.get('/deliverymen', DeliverymanController.index);
routes.get('/deliveryman/:id', DeliverymanController.show);
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.destroy);

routes.get('/deliveries', DeliveryController.index);
routes.get('/delivery/:id', DeliveryController.show);
routes.post('/delivery', DeliveryController.store);
routes.put('/delivery/:id', DeliveryController.update);
routes.delete('/delivery/:id', DeliveryController.destroy);

routes.post('/files', upload.single('file'), AvatarController.store);

export default routes;

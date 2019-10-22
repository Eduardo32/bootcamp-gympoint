import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import UsersController from './app/controllers/UsersController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.post('/users', UsersController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.put('/users', UsersController.update);

export default routes;

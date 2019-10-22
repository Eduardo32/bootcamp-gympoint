import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';

import UsersController from './app/controllers/UsersController';
import SessionController from './app/controllers/SessionController';
import StudentsController from './app/controllers/StudentsController';

const routes = new Router();

routes.post('/users', UsersController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.put('/users', UsersController.update);
routes.post('/students', StudentsController.store);
routes.put('/students/:id', StudentsController.update);

export default routes;

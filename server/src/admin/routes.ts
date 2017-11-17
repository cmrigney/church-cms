import * as express from "express";
import userRoutes from "./user-routes";
import pageTempleRoutes from './page-template-routes';
import pageRoutes from './page-routes';

const adminRoutes = express.Router();

adminRoutes.use('/user', userRoutes);
adminRoutes.use('/pagetemplate', pageTempleRoutes);
adminRoutes.use('/page', pageRoutes);

export default adminRoutes;

import express from 'express';
import { EntityController } from '../controllers/EntityController';

const router = express.Router();
const entityController = new EntityController();

// Routes for CRUD operations on entities
router.post('/entities', (req, res) => entityController.createEntity(req, res));
router.get('/entities', (req, res) => entityController.getAllEntities(req, res));
router.get('/entities/:id', (req, res) => entityController.getEntityById(req, res));
router.put('/entities/:id', (req, res) => entityController.updateEntity(req, res));
router.delete('/entities/:id', (req, res) => entityController.deleteEntity(req, res));
router.delete('/entities/:id/example', (req, res) => entityController.deleteExample(req, res));
router.post('/entities/:id/examples', (req, res) => entityController.createExampleForEntity(req,res));


export default router;

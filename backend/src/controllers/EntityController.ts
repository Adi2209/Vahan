import { Request, Response } from "express";
import { Entity } from "../models/Entity";

export class EntityController {
  // Create new entity with example
  public async createEntity(req: Request, res: Response): Promise<void> {
    try {
      const { name, attributes, example } = req.body;
      const entity = await Entity.create({ name, attributes, examples: example ? [example] : [] });
      res.status(201).json(entity);
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  // Get all entities 
  public async getAllEntities(req: Request, res: Response): Promise<void> {
    try {
      const entities = await Entity.findAll();
      res.status(200).json(entities);
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  // Get entity by ID
  public async getEntityById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const entity = await Entity.findByPk(id);
      if (!entity) {
        res.status(404).json({ error: "Entity not found" });
      } else {
        res.status(200).json(entity);
      }
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  // Update entity by ID and add example
  public async updateEntity(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, attributes, example } = req.body;
      const entity = await Entity.findByPk(id);
      if (!entity) {
        res.status(404).json({ error: 'Entity not found' });
      } else {
        if (example) {
          entity.examples.push(example); // Add new example
        }
        await entity.update({ name, attributes, examples: entity.examples });
        res.status(200).json(entity);
      }
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  // Delete entity by ID
  public async deleteEntity(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const entity = await Entity.findByPk(id);
      if (!entity) {
        res.status(404).json({ error: "Entity not found" });
      } else {
        await entity.destroy();
        res.status(204).send();
      }
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }
}

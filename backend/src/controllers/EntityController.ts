import { Request, Response } from "express";
import { Entity } from "../models/Entity";

export class EntityController {
  // Create new entity with example
  public async createEntity(req: Request, res: Response): Promise<void> {
    try {
      const { name, attributes, examples } = req.body;

      const entity = await Entity.create({ name, attributes, examples });
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
        res.status(404).json({ error: "Entity not found" });
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

  // public async createExampleForEntity(req: Request, res: Response): Promise<void> {
  //   try {
  //     const { id } = req.params;
  //     const exampleData = req.body;
  //     if (!exampleData) {
  //       res.status(400).json({ error: 'Example data is required' });
  //       return;
  //     }
  //     const entity = await Entity.findByPk(id);
  //     if (!entity) {
  //       res.status(404).json({ error: 'Entity not found' });
  //       return;
  //     }

  //     entity.examples.push(exampleData);
  //     const updatedEntity = await entity.save();
  //     if (!updatedEntity) {
  //       res.status(500).json({ error: 'Failed to save entity' });
  //       return;
  //     }

  //     res.status(201).json(updatedEntity);
  //   } catch (error) {
  //     console.error('Error creating example:', error);
  //     res.status(500).json({ error: 'Internal server error' });
  //   }
  // }

  // Assuming Entity model has a field 'examples' which is an array of JSON objects
  public async createExampleForEntity(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params; // ID of the entity to update
      const example = req.body; // New example to add

      // Find the entity by ID
      const entity = await Entity.findByPk(id);
      if (!entity) {
        res.status(404).json({ error: "Entity not found" });
      }

      // Append new example to the existing array
      const updatedExamples = [...entity!.examples, example];

      // Update entity with new example
      await entity!.update({ examples: updatedExamples });

      // Send back the updated entity
      res.status(200).json(entity);
    } catch (error) {
      console.error("Failed to create example for entity:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

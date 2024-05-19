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

  // Update entity by ID and update a specific example
  
  public async updateEntity(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { oldExample, newExample } = req.body;
  
      const entity = await Entity.findByPk(id);
  
      if (!entity) {
        res.status(404).json({ error: "Entity not found" });
        return;
      }
  
      const examples = entity.examples || [];
      const exampleIndex = examples.findIndex((ex: any) => JSON.stringify(ex) === JSON.stringify(oldExample));
  
      if (exampleIndex === -1) {
        res.status(404).json({ error: "Example not found" });
        return;
      }
  
      // Create a new array with the updated example
      const updatedExamples = [...examples];
      updatedExamples[exampleIndex] = newExample;
  
      // Use setDataValue to ensure the update is recognized
      entity.setDataValue('examples', updatedExamples);
      
      await entity.save(); // This should now trigger an update with the new examples and updated timestamp
  
      res.status(200).json(entity);
    } catch (error) {
      console.error("Error updating entity:", error);
      res.status(500).json({ error: "Internal server error" });
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

  public async deleteExample(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { exampleToDelete } = req.body;  // Assuming the example to delete is passed in the request body
  
      const entity = await Entity.findByPk(id);
  
      if (!entity) {
        res.status(404).json({ error: "Entity not found" });
        return;
      }
  
      let examples = entity.examples || [];
      const exampleIndex = examples.findIndex((ex: any) => JSON.stringify(ex) === JSON.stringify(exampleToDelete));
  
      if (exampleIndex === -1) {
        res.status(404).json({ error: "Example not found" });
        return;
      }
  
      examples = examples.filter((_, index) => index !== exampleIndex);
  
      entity.setDataValue('examples', examples);
  
      await entity.save(); 
  
      res.status(200).json({ message: "Example deleted successfully", entity });
    } catch (error) {
      console.error("Error deleting example:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }  
}

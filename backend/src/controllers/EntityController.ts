import { Request, Response } from "express";
import { Entity } from "../models/Entity";

/**
 * Controller for handling CRUD operations related to entities.
 */
export class EntityController {
  /**
   * Create a new entity with example.
   * @param {Request} req - Express Request object.
   * @param {Response} res - Express Response object.
   * @returns {Promise<void>}
   */
  public async createEntity(req: Request, res: Response): Promise<void> {
    try {
      // Extract data from request body
      const { name, attributes, examples } = req.body;

      // Create a new entity in the database
      const entity = await Entity.create({ name, attributes, examples });

      // Send back the newly created entity in the response
      res.status(201).json(entity);
    } catch (error) {
      // Handle errors
      res.status(400).json({ error: error });
    }
  }

  /**
   * Get all entities.
   * @param {Request} req - Express Request object.
   * @param {Response} res - Express Response object.
   * @returns {Promise<void>}
   */
  public async getAllEntities(req: Request, res: Response): Promise<void> {
    try {
      // Retrieve all entities from the database
      const entities = await Entity.findAll();

      // Send back the entities in the response
      res.status(200).json(entities);
    } catch (error) {
      // Handle errors
      res.status(400).json({ error: error });
    }
  }

  /**
   * Get entity by ID.
   * @param {Request} req - Express Request object.
   * @param {Response} res - Express Response object.
   * @returns {Promise<void>}
   */
  public async getEntityById(req: Request, res: Response): Promise<void> {
    try {
      // Extract entity ID from request parameters
      const { id } = req.params;

      // Find entity by ID in the database
      const entity = await Entity.findByPk(id);

      // Check if entity exists
      if (!entity) {
        res.status(404).json({ error: "Entity not found" });
      } else {
        // Send back the entity in the response
        res.status(200).json(entity);
      }
    } catch (error) {
      // Handle errors
      res.status(400).json({ error: error });
    }
  }

  /**
   * Update entity by ID and update a specific example.
   * @param {Request} req - Express Request object.
   * @param {Response} res - Express Response object.
   * @returns {Promise<void>}
   */
  public async updateEntity(req: Request, res: Response): Promise<void> {
    try {
      // Extract entity ID and example data from request body
      const { id } = req.params;
      const { oldExample, newExample } = req.body;
  
      // Find entity by ID in the database
      const entity = await Entity.findByPk(id);
  
      // Check if entity exists
      if (!entity) {
        res.status(404).json({ error: "Entity not found" });
        return;
      }
  
      // Retrieve existing examples from entity
      const examples = entity.examples || [];
      const exampleIndex = examples.findIndex((ex: any) => JSON.stringify(ex) === JSON.stringify(oldExample));
  
      // Check if the example to update exists
      if (exampleIndex === -1) {
        res.status(404).json({ error: "Example not found" });
        return;
      }
  
      // Create a new array with the updated example
      const updatedExamples = [...examples];
      updatedExamples[exampleIndex] = newExample;
  
      // Update entity with the new examples
      entity.setDataValue('examples', updatedExamples);
      await entity.save();
  
      // Send back the updated entity in the response
      res.status(200).json(entity);
    } catch (error) {
      // Handle errors
      console.error("Error updating entity:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Delete entity by ID.
   * @param {Request} req - Express Request object.
   * @param {Response} res - Express Response object.
   * @returns {Promise<void>}
   */
  public async deleteEntity(req: Request, res: Response): Promise<void> {
    try {
      // Extract entity ID from request parameters
      const { id } = req.params;
      
      // Find entity by ID in the database
      const entity = await Entity.findByPk(id);
      
      // Check if entity exists
      if (!entity) {
        res.status(404).json({ error: "Entity not found" });
      } else {
        // Delete the entity from the database
        await entity.destroy();
        res.status(204).send();
      }
    } catch (error) {
      // Handle errors
      res.status(400).json({ error: error });
    }
  }

  /**
   * Create a new example for the entity.
   * @param {Request} req - Express Request object.
   * @param {Response} res - Express Response object.
   * @returns {Promise<void>}
   */
  public async createExampleForEntity(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      // Extract entity ID and example data from request
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

      // Send back the updated entity in the response
      res.status(200).json(entity);
    } catch (error) {
      // Handle errors
      console.error("Failed to create example for entity:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Delete an example from the entity.
   * @param {Request} req - Express Request object.
   * @param {Response} res - Express Response object.
   * @returns {Promise<void>}
   */
  public async deleteExample(req: Request, res: Response): Promise<void> {
    try {
      // Extract entity ID and example data from request
      const { id } = req.params;
      const { exampleToDelete } = req.body;  // Assuming the example to delete is passed in the request body
  
      // Find the entity by ID
      const entity = await Entity.findByPk(id);
  
      // Check if entity exists
      if (!entity) {
        res.status(404).json({ error: "Entity not found" });
        return;
      }
  
      // Retrieve examples from entity
      let examples = entity.examples || [];
      const exampleIndex = examples.findIndex((ex: any) => JSON.stringify(ex) === JSON.stringify(exampleToDelete));
  
      // Check if the example to delete exists
      if (exampleIndex === -1) {
        res.status(404).json({ error: "Example not found" });
        return;
      }
  
      // Remove the example from the array
      examples = examples.filter((_, index) => index !== exampleIndex);
  
      // Update entity with the modified examples
      entity.setDataValue('examples', examples);
      await entity.save(); 
  
      // Send back success message and the updated entity in the response
      res.status(200).json({ message: "Example deleted successfully", entity });
    } catch (error) {
      // Handle errors
      console.error("Error deleting example:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }  
}

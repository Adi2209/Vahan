import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../configuration/database';

/**
 * Attributes for defining an Entity.
 */
interface EntityAttributes {
  name: string;
  attributes: any;
  examples?: any[];
}

/**
 * Model representing an Entity.
 */
export class Entity extends Model<EntityAttributes> implements EntityAttributes {
  public id!: number;
  public name!: string;
  public attributes!: any;
  public examples!: any[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Entity model
Entity.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attributes: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    examples: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'Entity',
    timestamps: true,
  }
);

export default Entity;

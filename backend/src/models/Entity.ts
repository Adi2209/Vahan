import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../configuration/database';

interface EntityAttributes {
  name: string;
  attributes: any;
  examples?: any[]; // Add examples field
}

export class Entity extends Model<EntityAttributes> implements EntityAttributes {
  public name!: string;
  public attributes!: any;
  public examples!: any[]; // Add examples field

  // Other methods or associations can be defined here
}

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
      type: DataTypes.JSONB, // Store examples as JSONB
      allowNull: true,
      defaultValue: [], // Default value as empty array
    },
  },
  {
    sequelize,
    modelName: 'Entity',
  }
);

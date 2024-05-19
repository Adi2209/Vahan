import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../configuration/database';

interface EntityAttributes {
  name: string;
  attributes: any;
  examples?: any[];
}

export class Entity extends Model<EntityAttributes> implements EntityAttributes {
  public id!: number;
  public name!: string;
  public attributes!: any;
  public examples!: any[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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

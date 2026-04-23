import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database'; 

class User extends Model {
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare bio: string;
  declare pseudo: string;
}

User.init({
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  bio: { type: DataTypes.STRING, allowNull: true },
  pseudo: { type: DataTypes.STRING, allowNull: false },
  I_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true, // INDISPENSABLE pour le 1:1
    references: {
      model: 'Image', // Nom de la table dans la DB
      key: 'I_id'
    }
  }
}, {
  sequelize,
  modelName: 'User'
});

export default User;
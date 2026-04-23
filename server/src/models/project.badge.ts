import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database'; 

class Badge extends Model {
  declare id: number;
  declare img: string;
  declare title: string;
}

Badge.init({
  img: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
}, {
  sequelize,
  modelName: 'Badge'
});

export default Badge;
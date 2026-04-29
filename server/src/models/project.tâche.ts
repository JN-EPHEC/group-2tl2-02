import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Tâche extends Model {
    declare TId: number;
    declare title: string;
    declare instruction: string;
}

Tâche.init({
    title: { type: DataTypes.STRING, allowNull: false },
    instruction: { type: DataTypes.STRING, allowNull: false }
}, {
    sequelize,
    modelName: 'Tâche'
});

export default Tâche;
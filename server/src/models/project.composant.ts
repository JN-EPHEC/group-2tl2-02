import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Composant extends Model {
    declare CId: number;
    declare nom: string;
    declare possédé: boolean;
}

Composant.init({
    CId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nom: { type: DataTypes.STRING, allowNull: false },
    possédé: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
    sequelize,
    modelName: 'Composant'
});

export default Composant;
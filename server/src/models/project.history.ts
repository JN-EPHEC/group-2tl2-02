// project.history.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class History extends Model {
    declare userId: number;
    declare projectId: number;
    declare visitedAt: Date;
}

History.init({
    visitedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'History',
    tableName: 'History',
    timestamps: false // On gère notre propre visitedAt
});

export default History;
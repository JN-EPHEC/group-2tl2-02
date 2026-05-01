import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Project extends Model {
    declare PId: number;
    declare title: string;
    declare description: string;
    declare difficulty: string;
    declare duration: string;
    declare date: Date;
    declare I_id: number | null;
}

Project.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    difficulty: {
        type: DataTypes.STRING,
        allowNull: true
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
   
}, {
    sequelize,
    modelName: 'Project',
    tableName: 'Projet'
});

export default Project;
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Project extends Model {
    declare id: number;
    declare title: string;
    declare description: string;
}

Project.init({
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
}, {
    sequelize,
    modelName: 'Project'
});

export default Project;
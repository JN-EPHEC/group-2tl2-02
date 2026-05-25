import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Image extends Model {
    declare I_id: number; 
    declare I_img: string;
    declare I_fileName?: string;
    declare I_url?: string;
}

Image.init({
    I_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true 
    },
    I_img: {
        type: DataTypes.STRING,
        allowNull: false
    },
    I_fileName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    I_url: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Image',
    tableName: 'Image'
});

export default Image;
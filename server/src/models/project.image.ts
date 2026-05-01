import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Image extends Model {
    declare I_id: number; 
    declare I_img: string;
}

Image.init({
    I_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true 
    },
    I_img: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    modelName: 'Image',
    tableName: 'Image'
});

export default Image;
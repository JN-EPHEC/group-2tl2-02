import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database'; 

class video extends Model {
  declare VId: number;
  declare mp4: string;
  declare lien: string;
  declare type: 'link' | 'local';
  declare titre: string;
}

video.init({
  type: {
    type: DataTypes.ENUM('link', 'local'),
    allowNull: false,
    defaultValue: 'link'
  },
  lien: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  mp4: {
    type: DataTypes.STRING,
    allowNull: true
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'video'
});

export default video;
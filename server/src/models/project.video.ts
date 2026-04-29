import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database'; 

class video extends Model {
  declare VId: number;
  declare mp4: string;
  declare lien: string;
}

video.init({
  mp4: { type: DataTypes.STRING, allowNull: true },
  lien: { type: DataTypes.STRING, allowNull: true }
}, {
  sequelize,
  modelName: 'video'
});

export default video;
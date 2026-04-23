import Project from '../project.create';
import Image from '../project.image';
import User from '../project.user';
import video from '../project.video';

// Proj_image
Project.belongsTo(Image, { foreignKey: 'I_id', as: 'Image' });
Image.hasMany(Project, { foreignKey: 'I_id' });


// Proj_user
User.belongsToMany(Project, {
    through: 'Proj_user',
    foreignKey: 'Uid',
    otherKey: 'PId'
});

Project.belongsToMany(User, {
    through: 'Proj_user',
    foreignKey: 'PId',
    otherKey: 'Uid',
    as: 'Auteurs'
});

// User_img
User.belongsTo(Image, { foreignKey: 'I_id', as: 'Avatar' });
Image.hasOne(User, { foreignKey: 'I_id', as: 'Proprietaire' });

// video_projet

video.belongsToMany(Project, {
    through: 'proj_video',
    foreignKey: 'VId',
    otherKey: 'PId'
});

Project.belongsToMany(video, {
    through: 'proj_video',
    foreignKey: 'PId',
    otherKey: 'VId',
    as: 'video'
});

// projet_favoris
User.belongsToMany(Project, {
    through: 'Proj_user',
    foreignKey: 'Uid',
    otherKey: 'PId'
});

Project.belongsToMany(User, {
    through: 'Proj_user',
    foreignKey: 'PId',
    otherKey: 'Uid',
    as: 'favoris'
});

export { Project, Image, User, video };
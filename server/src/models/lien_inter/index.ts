import Project from '../project.create';
import Image from '../project.image';
import User from '../project.user';
import video from '../project.video';
import Badge from '../project.badge';
import Composant from '../project.composant';
import Tâche from '../project.tâche';
import { table } from 'console';

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

// user_badge

User.belongsToMany(Badge, { 
    through: 'User_badge',
    foreignKey: 'Uid',
    otherKey: 'BId',
    as: 'Badge'
})

Badge.belongsToMany(User, { 
    through: 'User_badge', 
    foreignKey: 'BId', 
    otherKey: 'Uid'
});

// Project_composant
Project.belongsToMany(Composant, {
    through: 'Proj_composant',
    foreignKey: 'PId',
    otherKey: 'CId',
    as: 'composant'
})

Composant.belongsToMany( Project, {
    through: 'Proj_composant',
    foreignKey: 'CId',
    otherKey: 'PId'
})

// Project.Tâche

Project.belongsToMany(Tâche, {
    through: 'Proj_Tâche',
    foreignKey: 'PId',
    otherKey: 'TId',
    as: 'Tâche'
}) 
Tâche.belongsToMany( Project, {
    through: 'Proj_Tâche',
    foreignKey: 'TId',
    otherKey: 'PId'
})
export { Project, Image, User, video, Badge, Tâche };
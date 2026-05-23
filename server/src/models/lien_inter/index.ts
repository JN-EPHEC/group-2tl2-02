import Project from '../project.create';
import Image from '../project.image';
import User from '../project.user';
import video from '../project.video';
import Badge from '../project.badge';
import Composant from '../project.composant';
import Tâche from '../project.tâche';


// Proj_image
Project.belongsToMany(Image, {
    through: 'Project_Images',
    foreignKey: 'PId',
    otherKey: 'I_id',
    as: 'Image'
});
Image.belongsToMany(Project, {
    through: 'Project_Images',
    foreignKey: 'I_id',
    otherKey: 'PId'
});


// Proj_user
User.belongsToMany(Project, {
    through: 'Proj_user',
    foreignKey: 'Uid',
    otherKey: 'PId',
    as: 'Auteurs'
});

Project.belongsToMany(User, {
    through: 'Proj_user',
    foreignKey: 'PId',
    otherKey: 'Uid',
    as: 'Auteurs'
});

// User_img
User.belongsToMany(Image, {
    through: 'User_Images',
    foreignKey: 'userId',
    otherKey: 'imageId',
    as: 'Avatar'
});

Image.belongsToMany(User, {
    through: 'User_Images',
    foreignKey: 'imageId',
    otherKey: 'userId'
});

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
    through: 'Proj_favoris',  
    foreignKey: 'Uid',
    otherKey: 'PId',
    as: 'Favoris'
});

Project.belongsToMany(User, {
    through: 'Proj_favoris',  
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


export { Project, Image, User, video, Badge, Tâche, Composant };
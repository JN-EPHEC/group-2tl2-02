import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('mon_projet_db', 'postgres', 'X3IRAYHAMIDE2006@', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
});

export default sequelize;
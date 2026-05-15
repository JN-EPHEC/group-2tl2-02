import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('postgres', 'postgres', 'X3IRAYHAMIDE2006@', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
});

export default sequelize;
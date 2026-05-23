import { Sequelize } from 'sequelize';

class Database {
    private static instance: Sequelize;

    private constructor() {}

    public static getInstance(): Sequelize {
        if (!Database.instance) {
            Database.instance = new Sequelize(
                'postgres',
                'postgres',
                'X3IRAYHAMIDE2006@',
                {
                    host: 'localhost',
                    dialect: 'postgres',
                    logging: false,
                }
            );
        }

        return Database.instance;
    }
}

const sequelize = Database.getInstance();

export default sequelize;
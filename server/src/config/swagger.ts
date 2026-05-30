import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mon API',
      version: '1.0.0',
      description: 'Documentation de mon API Express',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/user.routes.ts'], 
};

export const swaggerSpec = swaggerJsdoc(options);
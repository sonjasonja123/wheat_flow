const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Poljoprivredna proizvodnja API',
      version: '1.0.0',
      description: 'Swagger API dokumentacija za sistem poljoprivredne proizvodnje',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Lokalni server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [path.join(__dirname, 'routes/*.js')], // OVO JE KLJUČNO
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '2.0',
        info: {
            title: 'Sarpheab API',
            version: '1.0.0',
        },
    },
    apis: ['.././routes/*.js'], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);
exports.module = {
    openapiSpecification
}
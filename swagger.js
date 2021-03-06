const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "MetaWall API",
    description: "user post crud",
  },
  host: "protected-refuge-81301.herokuapp.com",
  schemes: ["http", "https"],
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "headers",
      name: "authorization",
      description: "請加上 API Token",
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);

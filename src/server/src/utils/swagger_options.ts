const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ThinkLock API",
      version: "1.0.0",
      description: "ThinkLock API Documentation",
      contact: {
        name: "Eesha Moona",
        email: "eeshamoona@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5555",
      },
    ],
  },
  apis: ["./src/routes/*/*.ts", "./dist/routes/*/*.js"],
};

export default swaggerOptions;

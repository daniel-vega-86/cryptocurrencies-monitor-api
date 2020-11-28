module.exports = {
  openapi: "3.0.1",
  info: {
    version: "1.0.0",
    title: "Cryptocurrencies Monitor",
    description: "Cryptocurrencies Monitor API",
    termsOfService: "http://api_url/terms/",
    contact: {
      name: "Daniel Vega",
      email: "danielvega86@hotmail.com",
      url: "https://www.wolox.com.ar/",
    },
    license: {
      name: "Apache 2.0",
      url: "https://www.apache.org/licenses/LICENSE-2.0.html",
    },
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT}/`,
      description: "Local server",
    },
  ],
  tags: [
    {
      name: "Users",
    },
    {
      name: "Cryptocoins",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      id: {
        type: "string",
        description: "Cryptocurrencies identification string",
        example: "bitcoin",
      },
      firstName: {
        type: "string",
        example: "Arturo",
      },
      lastName: {
        type: "string",
        example: "Ramirez",
      },
      username: {
        type: "string",
        example: "arturo.ramirez",
      },
      password: {
        type: "string",
        description: "Password to access the API",
        example: "artram4321",
      },
      preferedCurrency: {
        type: "string",
        description: "Prefered currency to view the data",
        example: "usd",
      },
      Assing: {
        type: "object",
        properties: {
          id: {
            $ref: "#/components/schemas/id",
          },
        },
      },
      Login: {
        type: "object",
        properties: {
          username: {
            $ref: "#/components/schemas/username",
          },
          password: {
            $ref: "#/components/schemas/password",
          },
        },
      },
      User: {
        type: "object",
        properties: {
          firstName: {
            $ref: "#/components/schemas/firstName",
          },
          lastName: {
            $ref: "#/components/schemas/lastName",
          },
          username: {
            $ref: "#/components/schemas/username",
          },
          password: {
            $ref: "#/components/schemas/password",
          },
          preferedCurrency: {
            $ref: "#/components/schemas/preferedCurrency",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: {
            type: "string",
            example: "Invalid Email.",
          },
        },
      },
    },
  },
  paths: {
    "/users": {
      post: {
        tags: ["Users"],
        description: "Create users",
        operationId: "createUsers",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User",
              },
            },
          },
          required: true,
        },
        responses: {
          201: {
            description: "New user was created",
          },
          400: {
            description: "Invalid parameters",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Username in use",
                },
              },
            },
          },
        },
      },
    },
    "/users/login": {
      post: {
        tags: ["Users"],
        description: "Login user",
        operationId: "loginUsers",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Login",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "User log in",
          },
          400: {
            description: "Invalid parameters",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "user not found",
                },
              },
            },
          },
        },
      },
    },
    "/cryptocoins": {
      get: {
        security: {
          bearerAuth: [],
        },
        tags: ["Cryptocoins"],
        description: "List All cryptocurrencies",
        responses: {
          200: {
            description: "Cryptocurrencies",
          },
          401: {
            description: "Unauthorized user",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Please login",
                },
              },
            },
          },
        },
      },
    },
    "/cryptocoins/assign": {
      post: {
        security: {
          bearerAuth: [],
        },
        tags: ["Cryptocoins"],
        description: "Assign cryptocurrencies to the user",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Assing",
              },
            },
          },
          required: true,
        },
        responses: {
          200: {
            description: "Cryptocurrency",
          },
          401: {
            description: "Unauthorized user",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Please login",
                },
              },
            },
          },
        },
      },
    },
    "/cryptocoins/list": {
      get: {
        security: {
          bearerAuth: [],
        },
        tags: ["Cryptocoins"],
        description:
          "List cryptocurrencies assigned to the user order by price in the prefered currency",
        parameters: [
          {
            name: "top",
            in: "query",
            schema: {
              type: "integer",
              default: 10,
              description: "Number of cryptocurrencies to list.",
            },
            required: false,
          },
          {
            name: "order",
            in: "query",
            schema: {
              type: "string",
              enum: ["asc", "desc"],
              default: "desc",
            },
            required: false,
            description: "order type (ascending, descending)",
          },
        ],
        responses: {
          200: {
            description: "Cryptocurrencies",
          },
          401: {
            description: "Unauthorized user",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
                example: {
                  message: "Please login",
                },
              },
            },
          },
        },
      },
    },
  },
};

import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8001;

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Catalog API",
      version: "1.0.0",
      description: "API documentation for catalog items",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      schemas: {
        Specs: {
          type: "object",
          properties: {
            supplier: { type: "string", example: "Flexitallic" },
            standard: { type: "string", example: "ASME B16.20" },
            nominalSize: { type: "string", example: "2 in" },
            pressureClass: { type: "string", example: "ASME 150" },
            face: { type: "string", example: "RF" },
            windingMaterial: { type: "string", example: "316 SS" },
            fillerMaterial: { type: "string", example: "Graphite" },
            innerRing: { type: "string", example: "316 SS" },
            outerRing: { type: "string", example: "Carbon Steel" },
          },
        },

        CatalogItem: {
          type: "object",
          required: ["id", "name", "category", "supplier", "priceUsd"],
          properties: {
            id: {
              type: "string",
              example: "GST-0001",
            },
            name: {
              type: "string",
              example: "Spiral Wound Gasket",
            },
            category: {
              type: "string",
              example: "Gasket",
            },
            supplier: {
              type: "string",
              example: "Flexitallic",
            },
            manufacturer: {
              type: "string",
              example: "Flexitallic Ltd",
            },
            model: {
              type: "string",
              example: "SWG-150",
            },
            description: {
              type: "string",
              example: "High pressure spiral wound gasket",
            },
            leadTimeDays: {
              type: "number",
              example: 5,
            },
            priceUsd: {
              type: "number",
              example: 45.5,
            },
            inStock: {
              type: "boolean",
              example: true,
            },
            specs: {
              $ref: "#/components/schemas/Specs",
            },
          },
        },
        BulkCatalogItems: {
          type: "object",
          required: ["data"],
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/CatalogItem",
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/api/routes/*.ts", "./src/api/controllers/*.ts"],
};

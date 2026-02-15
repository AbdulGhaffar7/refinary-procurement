import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8002;

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Procurement Service APIs",
      version: "1.0.0",
      description:
        "API documentation for Procurement Service. This service manages purchase orders, supplier catalogs mirror, and procurement workflows.",
    },

    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],

    components: {
      schemas: {
        POAudit: {
          poNumber: {
            type: String,
            example: "PO-2026-0001",
          },
          fromStatus: {
            type: "string",
            enum: ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"],
            example: "DRAFT",
          },
          toStatus: {
            type: "string",
            enum: ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"],
            example: "DRAFT",
          },
          action: {
            type: "string",
            example: "STATUS_UPDATE_SUBMITTED",
          },
        },

        PurchaseOrder: {
          type: "object",
          required: ["poNumber", "requester", "neededBy"],
          properties: {
            _id: { type: "string" },
            poNumber: { type: "string", example: "PO-2026-0001" },
            supplier: { type: "string", example: "Flexitallic" },
            requester: { type: "string", example: "Buyer Name" },
            costCenter: { type: "string", example: "CC-1234" },
            neededBy: {
              type: "string",
              format: "date",
              example: "2026-03-01",
            },
            paymentTerms: {
              type: "string",
              enum: ["Cash", "Credit", "Installments"],
              example: "Credit",
            },
            status: {
              type: "string",
              enum: ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED"],
              example: "DRAFT",
            },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/LineItem" },
            },
            totalAmount: { type: "number", example: 227.5 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        PurchaseOrderItem: {
          data: {
            type: "object",
            items: { $ref: "#/components/schemas/PurchaseOrder" },
          },
          history: {
            type: "object",
            items: { $ref: "#/components/schemas/POAudit" },
          },
        },

        CreateDraftPO: {
          type: "object",
          required: ["requester", "neededBy"],
          properties: {
            requester: { type: "string", example: "Buyer Name" },
            costCenter: { type: "string", example: "CC-1234" },
            neededBy: { type: "string", format: "date", example: "2026-03-01" },
            paymentTerms: {
              type: "string",
              enum: ["Cash", "Credit", "Installments"],
            },
          },
        },

        LineItemRequest: {
          type: "object",
          required: ["catalogItemId", "quantity"],
          properties: {
            catalogItemId: { type: "string", example: "GST-0001" },
            quantity: { type: "number", minimum: 1, example: 5 },
          },
        },

        LineItem: {
          type: "object",
          required: ["catalogItemId", "quantity"],
          properties: {
            catalogItemId: { type: "string", example: "GST-0001" },
            quantity: { type: "number", minimum: 1, example: 5 },
            name: { type: "string", example: "Spiral Wound Gasket" },
            pricePerUnit: { type: "number", example: 45.5 },
            priceTotal: { type: "number", example: 227.5 },
          },
        },

        UpdateStatusRequest: {
          type: "object",
          required: ["status"],
          properties: {
            status: {
              type: "string",
              enum: ["SUBMITTED", "APPROVED", "REJECTED"],
            },
            notes: {
              type: "string",
              example: "Budget approved by finance",
            },
          },
        },

        CatalogMirror: {
          type: "object",
          required: ["productId", "name", "supplier", "priceUsd", "inStock"],
          properties: {
            _id: { type: "string" },
            productId: { type: "string", example: "GST-0001" },
            name: { type: "string", example: "Spiral Wound Gasket" },
            supplier: { type: "string", example: "Flexitallic" },
            priceUsd: { type: "number", example: 45.5 },
            inStock: { type: "boolean", example: true },
            leadTimeDays: { type: "number", example: 5 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        SyncCatalogMirrorRequest: {
          type: "object",
          required: [
            "productId",
            "name",
            "supplier",
            "priceUsd",
            "inStock",
            "leadTimeDays",
          ],
          properties: {
            productId: { type: "string", example: "GST-0001" },
            name: { type: "string", example: "Spiral Wound Gasket" },
            supplier: { type: "string", example: "Flexitallic" },
            priceUsd: { type: "number", example: 45.5 },
            inStock: { type: "boolean", example: true },
            leadTimeDays: { type: "number", example: 5 },
          },
        },
      },
    },
  },
  apis: ["./src/api/routes/*.ts", "./src/api/controllers/*.ts"],
};

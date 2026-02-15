import express from "express";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/catalogController";
import { validateCatalogData } from "../middlewares/validationMiddleware";

const router = express.Router();

router.get("/", getItems);
router.post("/", validateCatalogData, createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;

/**
 * @swagger
 * /api/v1/catalog/:
 *   get:
 *     summary: Get catalog items
 *     description: Retrieve catalog items with optional filtering and sorting

 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search by name, id, supplier, manufacturer, model
 *
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter items by category
 *
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Filter items by inStock status
 *
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, supplier, priceUsd, leadTimeDays]
 *         required: false
 *         description: Field to sort by (default is id)
 *
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         required: false
 *         description: Sort order (default asc)
 *         example: asc
 *
 *     responses:
 *       200:
 *         description: List of catalog items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CatalogItem'
 *
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/catalog/:
 *   post:
 *     summary: Create a catalog item

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CatalogItem'
 *     responses:
 *       201:
 *         description: Data added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CatalogItem'
 */

/**
 * @swagger
 * /api/v1/catalog/{id}:
 *   put:
 *     summary: Update a catalog item by ID. You can only insert fields which need to be updated.

 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: GST-0001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CatalogItem'
 *     responses:
 *       200:
 *         description: Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: application/json
 *               items:
 *                 $ref: '#/components/schemas/CatalogItem'
 */

/**
 * @swagger
 * /api/v1/catalog/{id}:
 *   delete:
 *     summary: Delete a catalog item

 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: GST-0001
 *     responses:
 *       200:
 *         description: Item deleted successfully
 */

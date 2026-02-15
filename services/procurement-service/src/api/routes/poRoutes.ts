import { Router } from "express";
import * as poController from "../controllers/poController";
import { validateSupplierConflict } from "../middlewares/supplierMiddleware";

const router = Router();

router.post("/", poController.createDraft);

router.get("/", poController.getPOs); // Search, Filter, Sort
router.get("/:id", poController.getPOById);

// The core logic endpoint: Adding items with 409 Conflict check
router.post("/:id/items", validateSupplierConflict, poController.addItemToPO);

// Status transitions
router.patch("/:id/status", poController.updateStatus);

export default router;

/**
 * @swagger
 * /api/v1/purchase-order/:
 *   post:
 *     summary: To create a purchase order with status Draft.
 *     description: This is the first step to create a purchase order. It assigns a PO number and sets the status to DRAFT. The PO can then be modified by adding items before submission.

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDraftPO'
 *     responses:
 *       201:
 *         description: Draft PO created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseOrder'
 *       400:
 *         description: Invalid request body

 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/purchase-order/:
 *   get:
 *     summary: Get purchase orders
 *     description: Supports filtering by status, supplier, requester and sorting by various fields. This allows users to easily find and manage their purchase orders based on workflow state and other criteria.

 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, SUBMITTED, APPROVED, REJECTED]
 *       - in: query
 *         name: supplier
 *         schema:
 *           type: string
 *       - in: query
 *         name: requester
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [poNumber, supplier, status, totalAmount, createdAt]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: List of purchase orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PurchaseOrder'
 *       400:
 *         description: Invalid query parameters
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/purchase-order/{id}:
 *   get:
 *     summary: Get purchase order by ID along with history
 *     description: Retrieves a specific purchase order by its ID, including all details and a history of status changes. This allows users to track the lifecycle of the PO and understand its current state in the procurement process.

 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Purchase order found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseOrderItem'
 *       404:
 *         description: PO not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/purchase-order/{id}/items:
 *   post:
 *     summary: Add item to purchase order
 *     description: Adds an item to a draft PO. Returns 409 if supplier conflict occurs.

 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LineItemRequest'
 *     responses:
 *       200:
 *         description: Item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseOrder'
 *       400:
 *         description: Invalid state (cannot modify non-draft PO)
 *       404:
 *         description: Purchase order not found
 *       409:
 *         description: Supplier conflict detected
 *       422:
 *         description: Invalid quantity or pricing
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/purchase-order/{id}/status:
 *   patch:
 *     summary: Update purchase order status
 *     description: Changes PO workflow state (DRAFT → SUBMITTED → APPROVED/REJECTED)

 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStatusRequest'
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseOrder'
 *       400:
 *         description: Invalid transition
 *       404:
 *         description: Purchase order not found
 *       500:
 *         description: Internal server error
 */

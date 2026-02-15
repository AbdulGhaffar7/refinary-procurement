import { Router } from "express";
import * as mirrorController from "../controllers/mirrorController";

const router = Router();

router.get("/", mirrorController.getAllItems);
router.post("/", mirrorController.syncItem);
router.delete("/:id", mirrorController.deleteMirroredItem);

export default router;

/**
 * @swagger
 * /api/v1/mirror-catalog/:
 *   get:
 *     summary: Get mirrored catalog items
 *     description: Returns locally cached catalog items synchronized from catalog service. This endpoint is optimized for fast read access inside the procurement system and avoids cross-service latency.

 *     responses:
 *       200:
 *         description: List of mirrored items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CatalogMirror'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/mirror-catalog/:
 *   post:
 *     summary: Sync catalog item into mirror
 *     description: Creates or updates a mirrored catalog item (used by catalog service or message consumer). This endpoint behaves as an UPSERT operation.

 *     requestBody:
 *       required: true
 *       content:
 *         array:
 *           schema:
 *             $ref: '#/components/schemas/SyncCatalogMirrorRequest'
 *     responses:
 *       200:
 *         description: Existing item updated successfully
 *       201:
 *         description: New item created in mirror
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/mirror-catalog/{id}:
 *   delete:
 *     summary: Remove mirrored catalog item
 *     description: Deletes item from local mirror when removed from catalog service to maintain eventual consistency.

 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: GST-0001
 *     responses:
 *       200:
 *         description: Item removed from mirror
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */

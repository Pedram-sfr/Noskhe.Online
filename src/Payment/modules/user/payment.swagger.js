/**
 * @swagger
 *  tags:
 *      name: User-Payment
 *      description: Payment Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Payment:
 *              type: object
 *              required:
 *                  -   invoiceId
 *              properties:
 *                  invoiceId:
 *                      type: number
 */
/**
 * @swagger
 * /user/payment:
 *  post:
 *      summary: pyment
 *      tags:
 *          -   User-Payment
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/Payment"
 *      responses:
 *          200:
 *              description: success
 *      
 */
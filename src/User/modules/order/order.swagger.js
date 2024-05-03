/**
 * @swagger
 *  tags:
 *      name: User
 *      description: User Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Order:
 *              type: object
 *              properties:
 *                  list:
 *                      type: array
 */

/**
 * @swagger
 * /user/order/add:
 *  post:
 *      summary: edit user profile
 *      tags:
 *          -   User
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/Order"
 *      responses:
 *          200:
 *              description: success
 *      
 */
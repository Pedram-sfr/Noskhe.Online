/**
 * @swagger
 *  tags:
 *      name: PharmacyBot
 *      description: Pharmacy Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          ActiveCode:
 *              type: object
 *              required:
 *                  -   auth
 *                  -   activeCode
 *                  -   chat_id
 *              properties:
 *                  auth:
 *                      type: string
 *                  activeCode:
 *                      type: number
 *                  chat_id:
 *                      type: number
 */

/**
 * @swagger
 * /pharmacy/bot/getCode:
 *  get:
 *      summary: get code for active pharmacyBot
 *      tags:
 *          -   PharmacyBot
 *      responses:
 *          200:
 *              description: success
 *      
 */

/**
 * @swagger
 * /pharmacy/bot/activeChat:
 *  post:
 *      summary: active pharmacyBot
 *      tags:
 *          -   PharmacyBot
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/ActiveCode"
 *      responses:
 *          200:
 *              description: success
 *      
 */

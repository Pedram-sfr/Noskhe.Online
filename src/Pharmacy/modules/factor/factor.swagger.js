/**
 * @swagger
 *  tags:
 *      name: Pharmacy-Factor
 *      description: Pharmacy Routes for factor
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          CreateFactor:
 *              type: object
 *              required:
 *                  -   orderId
 *                  -   drugs
 *              properties:
 *                  orderId:
 *                      type: string
 *                  drugs:
 *                      type: string
 *          removeDrug:
 *              type: object
 *              required:
 *                  -   invoiceId
 *                  -   drug
 *              properties:
 *                  invoiceId:
 *                      type: number
 *                  drug:
 *                      type: string
 */


/**
 * @swagger
 * /pharmacy/factor/pdf:
 *  get:
 *      summary: get order list
 *      tags:
 *          -   Pharmacy-Factor
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /pharmacy/factor/orderList:
 *  get:
 *      summary: get order list
 *      tags:
 *          -   Pharmacy-Factor
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /pharmacy/factor/order/{orderId}:
 *  get:
 *      summary: get order list
 *      tags:
 *          -   Pharmacy-Factor
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *          -   in: path
 *              name: orderId
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /pharmacy/factor/create:
 *  post:
 *      summary: get order list
 *      tags:
 *          -   Pharmacy-Factor
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/CreateFactor"
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /pharmacy/factor/removeDrug:
 *  patch:
 *      summary: get order list
 *      tags:
 *          -   Pharmacy-Factor
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/removeDrug"
 *      responses:
 *          200:
 *              description: success
 *      
 */

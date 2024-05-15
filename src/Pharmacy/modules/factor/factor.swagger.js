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
 *              properties:
 *                  orderId:
 *                      type: string
 *          CreateDrugFactor:
 *              type: object
 *              required:
 *                  -   factorId
 *                  -   drugId
 *                  -   count
 *                  -   action
 *              properties:
 *                  factorId:
 *                      type: string
 *                  drugId:
 *                      type: string
 *                  count:
 *                      type: string
 *                  action:
 *                      type: string
 *                      enum:
 *                          -   INCREMENT
 *                          -   DECREMENT
 *                      
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
 *          Accept:
 *              type: object
 *              required:
 *                  -   id
 *              properties:
 *                  id:
 *                      type: string
 *          DIS:
 *              type: object
 *              properties:
 *                  coordinates:
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
 *          -   in: query
 *              name: page
 *              type: number
 *          -   in: query
 *              name: perpage
 *              type: number
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /pharmacy/factor/neworder/list:
 *  get:
 *      summary: get order list
 *      tags:
 *          -   Pharmacy-Factor
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *          -   in: query
 *              name: page
 *              type: number
 *          -   in: query
 *              name: perpage
 *              type: number
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /pharmacy/factor/order/notAccept/{id}:
 *  get:
 *      summary: get order list
 *      tags:
 *          -   Pharmacy-Factor
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *          -   in: path
 *              name: id
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /pharmacy/factor/order/Accept:
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
 *                      $ref: "#/components/schemas/Accept"
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
 * /pharmacy/factor/createDrug:
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
 *                      $ref: "#/components/schemas/CreateDrugFactor"
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
/**
 * @swagger
 * /pharmacy/factor/dis:
 *  post:
 *      summary: get order list
 *      tags:
 *          -   Pharmacy-Factor
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/DIS"
 *      responses:
 *          200:
 *              description: success
 *      
 */
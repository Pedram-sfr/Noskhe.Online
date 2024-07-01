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
 *          CreatePersonFactor:
 *              type: object
 *              required:
 *                  -   orderId
 *                  -   deliveryTime
 *              properties:
 *                  orderId:
 *                      type: string
 *                  deliveryTime:
 *                      type: number
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
 *          Price:
 *              type: object
 *              required:
 *                  -   invoiceId
 *                  -   itemId
 *                  -   itemType
 *                  -   price
 *              properties:
 *                  invoiceId:
 *                      type: string
 *                  itemId:
 *                      type: string
 *                  itemType:
 *                      type: string
 *                      enum:
 *                          -   OTC
 *                          -   UPLOAD
 *                          -   ELEC
 *                  price:
 *                      type: number
 *                  insurance:
 *                      type: number
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
 *                  -   orderId
 *                  -   deliveryType
 *              properties:
 *                  orderId:
 *                      type: string
 *                  deliveryType:
 *                      type: string
 *                      enum:
 *                          -   PERSON
 *                          -   COURIER
 *                  deliveryTime:
 *                      type: string
 *          AcceptP:
 *              type: object
 *              required:
 *                  -   orderId
 *              properties:
 *                  orderId:
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
 * /pharmacy/factor/invoiceList:
 *  get:
 *      summary: get invoice list
 *      tags:
 *          -   Pharmacy-Factor
 *      parameters:
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
 * /pharmacy/factor/invoice/{invoiceId}:
 *  get:
 *      summary: get invoice by invoiceId
 *      tags:
 *          -   Pharmacy-Factor
 *      parameters:
 *          -   in: path
 *              name: invoiceId
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
 *      summary: get new order list
 *      tags:
 *          -   Pharmacy-Factor
 *      parameters:
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
 * /pharmacy/factor/neworder/single/{orderId}:
 *  get:
 *      summary: get new order single
 *      tags:
 *          -   Pharmacy-Factor
 *      parameters:
 *          -   in: path
 *              name: orderId
 *              type: string
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /pharmacy/factor/order/notAccept/{id}:
 *  get:
 *      summary: not accept order
 *      tags:
 *          -   Pharmacy-Factor
 *      parameters:
 *          -   in: path
 *              name: id
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /pharmacy/factor/order/AcceptNotPrice:
 *  post:
 *      summary: accept order
 *      tags:
 *          -   Pharmacy-Factor
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/AcceptP"
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /pharmacy/factor/order/Accept:
 *  post:
 *      summary: accept order
 *      tags:
 *          -   Pharmacy-Factor
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
 *      summary: get order by id
 *      tags:
 *          -   Pharmacy-Factor
 *      parameters:
 *          -   in: path
 *              name: orderId
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /pharmacy/factor/order/price:
 *  patch:
 *      summary: add price in invoice item
 *      tags:
 *          -   Pharmacy-Factor
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/Price"
 *      responses:
 *          200:
 *              description: success
 *      
 */
// /**
//  * @swagger
//  * /pharmacy/factor/createPerson:
//  *  post:
//  *      summary: create person delivery invoice
//  *      tags:
//  *          -   Pharmacy-Factor
//  *      requestBody:
//  *          content:
//  *              application/x-www-form-urlencoded:
//  *                  schema:
//  *                      $ref: "#/components/schemas/CreatePersonFactor"
//  *      responses:
//  *          200:
//  *              description: success
//  *      
//  */
// /**
//  * @swagger
//  * /pharmacy/factor/create:
//  *  post:
//  *      summary: create courier delivery invoice
//  *      tags:
//  *          -   Pharmacy-Factor
//  *      requestBody:
//  *          content:
//  *              application/x-www-form-urlencoded:
//  *                  schema:
//  *                      $ref: "#/components/schemas/CreateFactor"
//  *      responses:
//  *          200:
//  *              description: success
//  *      
//  */
// /**
//  * @swagger
//  * /pharmacy/factor/createDrug:
//  *  post:
//  *      summary: create drug in invoice
//  *      tags:
//  *          -   Pharmacy-Factor
//  *      requestBody:
//  *          content:
//  *              application/x-www-form-urlencoded:
//  *                  schema:
//  *                      $ref: "#/components/schemas/CreateDrugFactor"
//  *      responses:
//  *          200:
//  *              description: success
//  *      
//  */
// /**
//  * @swagger
//  * /pharmacy/factor/removeDrug:
//  *  patch:
//  *      summary: remove drug from  invoice
//  *      tags:
//  *          -   Pharmacy-Factor
//  *      requestBody:
//  *          content:
//  *              application/x-www-form-urlencoded:
//  *                  schema:
//  *                      $ref: "#/components/schemas/removeDrug"
//  *      responses:
//  *          200:
//  *              description: success
//  *      
//  */

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
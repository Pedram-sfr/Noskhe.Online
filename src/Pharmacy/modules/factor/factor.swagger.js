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
 *          AcceptPrice:
 *              type: object
 *              required:
 *                  -   invoiceId
 *              properties:
 *                  invoiceId:
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
 *          Delivery:
 *              type: object
 *              required:
 *                  -   factorId
 *              properties:
 *                  factorId:
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
 *          OrderList:
 *              type: string
 *              enum:
 *                   -   ALL
 *                   -   PERSON
 *                   -   COURIER
 *                   -   WFC
 *                   -   CONFIRMED
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
 * /pharmacy/factor/orderList:
 *  get:
 *      summary: get order list
 *      tags:
 *          -   Pharmacy-Factor
 *      parameters:
 *          -   in: query
 *              name: list
 *              schema:
 *                  $ref: "#/components/schemas/OrderList"
 *          -   in: query
 *              name: page
 *              type: number
 *          -   in: query
 *              name: perpage
 *              type: number
 *          -   in: query
 *              name: search
 *              type: string
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /pharmacy/factor/order/{factorId}:
 *  get:
 *      summary: get order by id
 *      tags:
 *          -   Pharmacy-Factor
 *      parameters:
 *          -   in: path
 *              name: factorId
 *      responses:
 *          200:
 *              description: success
 *      
 */
// /**
//  * @swagger
//  * /pharmacy/factor/orderList/confirmed:
//  *  get:
//  *      summary: get confirmed order list
//  *      tags:
//  *          -   Pharmacy-Factor
//  *      parameters:
//  *          -   in: query
//  *              name: page
//  *              type: number
//  *          -   in: query
//  *              name: perpage
//  *              type: number
//  *      responses:
//  *          200:
//  *              description: success
//  *      
//  */
// /**
//  * @swagger
//  * /pharmacy/factor/orderList/paid/wfc:
//  *  get:
//  *      summary: get wfc order list
//  *      tags:
//  *          -   Pharmacy-Factor
//  *      parameters:
//  *          -   in: query
//  *              name: page
//  *              type: number
//  *          -   in: query
//  *              name: perpage
//  *              type: number
//  *      responses:
//  *          200:
//  *              description: success
//  *      
//  */
// /**
//  * @swagger
//  * /pharmacy/factor/orderList/paid/person:
//  *  get:
//  *      summary: get current person order list
//  *      tags:
//  *          -   Pharmacy-Factor
//  *      parameters:
//  *          -   in: query
//  *              name: page
//  *              type: number
//  *          -   in: query
//  *              name: perpage
//  *              type: number
//  *      responses:
//  *          200:
//  *              description: success
//  *      
//  */
// /**
//  * @swagger
//  * /pharmacy/factor/orderList/paid/courier:
//  *  get:
//  *      summary: get current courier order list
//  *      tags:
//  *          -   Pharmacy-Factor
//  *      parameters:
//  *          -   in: query
//  *              name: page
//  *              type: number
//  *          -   in: query
//  *              name: perpage
//  *              type: number
//  *      responses:
//  *          200:
//  *              description: success
//  *      
//  */
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
 *          -   in: query
 *              name: search
 *              type: string
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
 * /pharmacy/factor/order/notAccept/{orderId}:
 *  get:
 *      summary: not accept order
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
/**
 * @swagger
 * /pharmacy/factor/order/acceptPrice:
 *  patch:
 *      summary: accept price in invoice item
 *      tags:
 *          -   Pharmacy-Factor
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/AcceptPrice"
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /pharmacy/factor/delivery/courier:
 *  post:
 *      summary: delivery to courier
 *      tags:
 *          -   Pharmacy-Factor
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/Delivery"
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /pharmacy/factor/delivery/person:
 *  post:
 *      summary: delivery to courier
 *      tags:
 *          -   Pharmacy-Factor
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/Delivery"
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
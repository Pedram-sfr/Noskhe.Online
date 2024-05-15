/**
 * @swagger
 *  tags:
 *      name: User-Order
 *      description: UserOrder Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          CreateOrder:
 *              type: object
 *              required:
 *                  -   addressId
 *              properties:
 *                  addressId:
 *                      type: string
 *                  description:
 *                      type: string
 *          ElecPrescription:
 *              type: object
 *              required:
 *                  -   orderId
 *                  -   trackingCode
 *                  -   doctorName
 *                  -   nationalCode
 *                  -   typeOfInsurance 
 *              properties:
 *                  orderId:
 *                      type: string
 *                  trackingCode:
 *                      type: string
 *                  nationalCode:
 *                      type: string
 *                  typeOfInsurance:
 *                      type: string
 *                  doctorName:
 *                      type: string
 *          AddOTC:
 *              type: object
 *              required:
 *                  -   orderId
 *                  -   count
 *              properties:
 *                  orderId:
 *                      type: string
 *                  drugName:
 *                      type: string
 *                  type:
 *                      type: string
 *                  count:
 *                      type: string
 *                  image:
 *                      type: file
 *          List:
 *              type: object
 *              required:
 *                  -   orderId
 *              properties:
 *                  orderId:
 *                      type: string
 *          UploadPrescription:
 *              type: object
 *              required:
 *                  -   orderId
 *                  -   image
 *              properties:
 *                  orderId:
 *                      type: string
 *                  image:
 *                      type: file
 */

/**
 * @swagger
 * /user/order/create:
 *  post:
 *      summary: create order
 *      tags:
 *          -   User-Order
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/CreateOrder"
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /user/order/addOTC:
 *  post:
 *      summary: add otc
 *      tags:
 *          -   User-Order
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      $ref: "#/components/schemas/AddOTC"
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /user/order/list:
 *  get:
 *      summary: orderList with id
 *      tags:
 *          -   User-Order
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
 * /user/order/{orderId}:
 *  get:
 *      summary: orderList with id
 *      tags:
 *          -   User-Order
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
 * /user/order/uploadPrescription:
 *  post:
 *      summary: add UploadPrescription
 *      tags:
 *          -   User-Order
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      $ref: "#/components/schemas/UploadPrescription"
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /user/order/elecPrescription:
 *  post:
 *      summary: add elecPrescription
 *      tags:
 *          -   User-Order
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/ElecPrescription"
 *      responses:
 *          200:
 *              description: success
 *      
 */

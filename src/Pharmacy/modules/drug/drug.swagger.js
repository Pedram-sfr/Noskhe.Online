/**
 * @swagger
 *  tags:
 *      name: Pharmacy-Drug
 *      description: Pharmacy Routes for drug
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Add-Drug:
 *              type: object
 *              required:
 *                  -   excelFile
 *              properties:
 *                  excelFile:
 *                      type: file
 *          Edit-One-Drug:
 *              type: object
 *              properties:
 *                  drugName:
 *                      type: string
 *                  drugType:
 *                      type: string
 *                  price:
 *                      type: number
 *                  patient:
 *                      type: number
 *                  insurance:
 *                      type: number
 */

/**
 * @swagger
 * /pharmacy/drug/add-drug:
 *  post:
 *      summary: get user profile
 *      tags:
 *          -   Pharmacy-Drug
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      $ref: "#/components/schemas/Add-Drug"
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /pharmacy/drug/drogList:
 *  get:
 *      summary: get drog list
 *      tags:
 *          -   Pharmacy-Drug
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *          -   in: query
 *              name: search
 *              type: string
 *      responses:
 *          200:
 *              description: success
 *      
 */

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
 *          EditUser:
 *              type: object
 *              required:
 *                  -   fullName
 *                  -   nationalCode
 *              properties:
 *                  fullName:
 *                      type: string
 *                  nationalCode:
 *                      type: string
 */

/**
 * @swagger
 * /user/profile:
 *  get:
 *      summary: get user profile
 *      tags:
 *          -   User
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
 * /user/edit-profile:
 *  patch:
 *      summary: edit user profile
 *      tags:
 *          -   User
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/EditUser"
 *      responses:
 *          200:
 *              description: success
 *      
 */

/**
 * @swagger
 * /user/document/invoice:
 *  get:
 *      summary: get user invoice list
 *      tags:
 *          -   User
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
 * /user/document/invoice/{id}:
 *  get:
 *      summary: get user invoice list
 *      tags:
 *          -   User
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
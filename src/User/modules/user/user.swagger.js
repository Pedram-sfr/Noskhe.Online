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
 *  post:
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
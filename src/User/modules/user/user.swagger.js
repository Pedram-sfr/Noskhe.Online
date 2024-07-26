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
 *          EditWallet:
 *              type: object
 *              required:
 *                  -   shebaName
 *                  -   shebaNum
 *              properties:
 *                  shebaName:
 *                      type: string
 *                  shebaNum:
 *                      type: string
 */

/**
 * @swagger
 * /user/profile:
 *  get:
 *      summary: get user profile
 *      tags:
 *          -   User
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /user/wallet:
 *  get:
 *      summary: get user wallet
 *      tags:
 *          -   User
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
 * /user/wallet/sheba:
 *  patch:
 *      summary: edit sheba wallet
 *      tags:
 *          -   User
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/EditWallet"
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
 * /user/document/invoice/{id}:
 *  get:
 *      summary: get user invoice list
 *      tags:
 *          -   User
 *      parameters:
 *          -   in: path
 *              name: id
 *      responses:
 *          200:
 *              description: success
 *      
 */
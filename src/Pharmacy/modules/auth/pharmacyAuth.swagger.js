/**
 * @swagger
 *  tags:
 *      name: Pharmacy-Auth
 *      description: Auth Routes for pharmacy
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          PharmacyRegister:
 *              type: object
 *              required:
 *                  -   mobile
 *                  -   userName
 *                  -   password
 *              properties:
 *                  mobile:
 *                      type: string
 *                  userName:
 *                      type: string
 *                  password:
 *                      type: string
 *          PharmacyLogin:
 *              type: object
 *              required:
 *                  -   userName
 *                  -   password
 *              properties:
 *                  userName:
 *                      type: string
 *                  password:
 *                      type: string
 *          RefreshToken:
 *              type: object
 *              required:
 *                  -   refreshToken
 *              properties:
 *                  refreshToken:
 *                      type: string
 *          Checkarray:
 *              type: array
 *              in: formData
 *              items:
 *                  type: object
 *              required:
 *                  -   mobile
 *                  -   code
 *              properties:
 *                  mobile:
 *                      type: string
 *                  code:
 *                      type: string
 */

/**
 * @swagger
 * /pharmacy/auth/register:
 *  post:
 *      summary: register with username and password
 *      tags:
 *          -   Pharmacy-Auth
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/PharmacyRegister"
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /pharmacy/auth/login:
 *  post:
 *      summary: login with userName and password
 *      tags:
 *          -   Pharmacy-Auth
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/PharmacyLogin"
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /pharmacy/auth/refresh-token:
 *  post:
 *      summary: sign refreshToken
 *      tags:
 *          -   Pharmacy-Auth
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/RefreshToken"
 *      responses:
 *          200:
 *              description: success
 *      
 */

/**
 * @swagger
 * /pharmacy/auth/logout:
 *  get:
 *      summary: logout user from account
 *      tags:
 *          -   Pharmacy-Auth
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *      responses:
 *          200:
 *              description: success
 *      
 */
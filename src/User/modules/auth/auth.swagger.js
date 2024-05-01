/**
 * @swagger
 *  tags:
 *      name: Auth
 *      description: Auth Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          SendOTP:
 *              type: object
 *              required:
 *                  -   mobile
 *              properties:
 *                  mobile:
 *                      type: string
 *          CheckOTP:
 *              type: object
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
 * /user/auth/send-otp:
 *  post:
 *      summary: login with otp and mobile
 *      tags:
 *          -   Auth
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/SendOTP"
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /user/auth/check-otp:
 *  post:
 *      summary: login with otp and mobile
 *      tags:
 *          -   Auth
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/CheckOTP"
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /user/auth/logout:
 *  get:
 *      summary: logout user from account
 *      tags:
 *          -   Auth
 *      responses:
 *          200:
 *              description: success
 *      
 */
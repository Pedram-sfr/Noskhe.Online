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
 *          RegisterCheckOTP:
 *              type: object
 *              required:
 *                  -   mobile
 *                  -   code
 *                  -   fullName
 *                  -   nationalCode
 *              properties:
 *                  mobile:
 *                      type: string
 *                  code:
 *                      type: string
 *                  fullName:
 *                      type: string
 *                  nationalCode:
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
 * /user/auth/register/send-otp:
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
 * /user/auth/register/check-otp:
 *  post:
 *      summary: login with otp and mobile
 *      tags:
 *          -   Auth
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/RegisterCheckOTP"
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /user/auth/refresh-token:
 *  post:
 *      summary: sign refreshToken
 *      tags:
 *          -   Auth
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
 * /user/auth/check:
 *  post:
 *      summary: login with otp and mobile
 *      tags:
 *          -   Auth
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/Checkarray"
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
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *      responses:
 *          200:
 *              description: success
 *      
 */
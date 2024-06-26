/**
 * @swagger
 *  tags:
 *      name: Pharmacy
 *      description: Pharmacy Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          PharmacyEditUser:
 *              type: object
 *              properties:
 *                  pharmacyName:
 *                      type: string
 *                  fullName:
 *                      type: string
 *                  nationalCode:
 *                      type: string
 *                  licenseNumber:
 *                      type: string
 *                  province:
 *                      type: string
 *                  city:
 *                      type: string
 *                  district:
 *                      type: string
 *                  address:
 *                      type: string
 *                  coordinates:
 *                      type: string
 */

/**
 * @swagger
 * /pharmacy/profile:
 *  get:
 *      summary: get user profile
 *      tags:
 *          -   Pharmacy
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
 * /pharmacy/wallet:
 *  get:
 *      summary: get user profile
 *      tags:
 *          -   Pharmacy
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
 * /pharmacy/edit-profile:
 *  patch:
 *      summary: edit user profile
 *      tags:
 *          -   Pharmacy
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/PharmacyEditUser"
 *      responses:
 *          200:
 *              description: success
 *      
 */
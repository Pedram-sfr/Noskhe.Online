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
 *                  lat:
 *                      type: number
 *                  lng:
 *                      type: number
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
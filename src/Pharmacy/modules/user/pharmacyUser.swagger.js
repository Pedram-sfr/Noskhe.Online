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
 * /pharmacy/dashboard:
 *  get:
 *      summary: get pharmacy dashboard
 *      tags:
 *          -   Pharmacy
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /pharmacy/profile:
 *  get:
 *      summary: get user profile
 *      tags:
 *          -   Pharmacy
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
 * /pharmacy/wallet/sheba:
 *  patch:
 *      summary: edit sheba wallet
 *      tags:
 *          -   Pharmacy
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
 * /pharmacy/edit-profile:
 *  patch:
 *      summary: edit user profile
 *      tags:
 *          -   Pharmacy
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
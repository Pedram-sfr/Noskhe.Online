/**
 * @swagger
 *  tags:
 *      name: User-Address
 *      description: User Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Address:
 *              type: object
 *              required:
 *                  -   lat
 *                  -   lng
 *                  -   myself
 *                  -   address
 *                  -   province
 *                  -   city
 *              properties:
 *                  lat:
 *                      type: number
 *                  lng:
 *                      type: number
 *                  address:
 *                      type: string
 *                  province:
 *                      type: string
 *                  city:
 *                      type: string
 *                  myself:
 *                      type: boolean
 *                  fullName:
 *                      type: string
 *                  phone:
 *                      type: string
 *          UpdateAddress:
 *              type: object
 *              required:
 *                  -   addressId
 *              properties:
 *                  lat:
 *                      type: number
 *                  lng:
 *                      type: number
 *                  address:
 *                      type: string
 *                  province:
 *                      type: string
 *                  city:
 *                      type: string
 *                  myself:
 *                      type: boolean
 *                  fullName:
 *                      type: string
 *                  phone:
 *                      type: string
 *                  addressId:
 *                      type: string
 */

/**
 * @swagger
 * /user/address/add:
 *  post:
 *      summary: create new address
 *      tags:
 *          -   User-Address
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/Address"
 *      responses:
 *          200:
 *              description: success
 *
 */
/**
 * @swagger
 * /user/address/update:
 *  patch:
 *      summary: edit new address
 *      tags:
 *          -   User-Address
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: "#/components/schemas/UpdateAddress"
 *      responses:
 *          200:
 *              description: success
 *
 */
/**
 * @swagger
 * /user/address/remove/{addressId}:
 *  delete:
 *      summary: remove address
 *      tags:
 *          -   User-Address
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *          -   in: path
 *              name: addressId
 *      responses:
 *          200:
 *              description: success
 *
 */
/**
 * @swagger
 * /user/address/list:
 *  get:
 *      summary: list of address
 *      tags:
 *          -   User-Address
 *      parameters:
 *          -   in: header
 *              name: accesstoken
 *              example: Bearer yourtoken
 *      responses:
 *          200:
 *              description: success
 *
 */

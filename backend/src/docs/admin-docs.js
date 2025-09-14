/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin-only endpoints for managing the platform
 *   - name: Returns
 *     description: Return request management
 *   - name: Coupons
 *     description: Coupon management
 *   - name: Users
 *     description: User management
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard overview
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         totalProducts:
 *                           type: number
 *                         totalOrders:
 *                           type: number
 *                         totalUsers:
 *                           type: number
 *                         totalRevenue:
 *                           type: number
 *                         pendingReturns:
 *                           type: number
 *                         lowStockProducts:
 *                           type: number
 *                     recentActivities:
 *                       type: array
 *                       description: Recent system activities
 *                     lowStockProducts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, processing, shipped, delivered, cancelled, returned]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/admin/orders/{id}/status:
 *   patch:
 *     summary: Update order status (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, processing, shipped, delivered, cancelled, returned]
 *                 description: New order status
 *               trackingNumber:
 *                 type: string
 *                 description: Shipping tracking number
 *               estimatedDelivery:
 *                 type: string
 *                 format: date
 *                 description: Estimated delivery date
 *               notes:
 *                 type: string
 *                 description: Admin notes
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/returns:
 *   post:
 *     summary: Create a return request
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - items
 *               - reason
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: Order ID
 *                 example: "507f1f77bcf86cd799439011"
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                     - reason
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     quantity:
 *                       type: number
 *                       minimum: 1
 *                       example: 1
 *                     reason:
 *                       type: string
 *                       example: "Product arrived damaged"
 *                     condition:
 *                       type: string
 *                       enum: [new, used, damaged]
 *                       example: "damaged"
 *               reason:
 *                 type: string
 *                 enum: [defective, wrong_item, not_as_described, damaged_in_transit, size_issue, changed_mind, other]
 *                 example: "damaged_in_transit"
 *               description:
 *                 type: string
 *                 description: Detailed description of the return
 *                 example: "The product arrived with visible scratches"
 *     responses:
 *       201:
 *         description: Return request created successfully
 *       400:
 *         description: Invalid return request
 */

/**
 * @swagger
 * /api/returns:
 *   get:
 *     summary: Get user's return requests
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, picked_up, received, refunded, exchanged]
 *     responses:
 *       200:
 *         description: Return requests retrieved successfully
 */

/**
 * @swagger
 * /api/returns/{id}:
 *   get:
 *     summary: Get a single return request
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Return request ID
 *     responses:
 *       200:
 *         description: Return request retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/returns/{id}/media:
 *   post:
 *     summary: Upload return media (images/videos)
 *     tags: [Returns]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Return request ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Image files
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Video files
 *               comments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: "This shows the damage clearly"
 *                     type:
 *                       type: string
 *                       enum: [user, admin]
 *                       example: "user"
 *     responses:
 *       200:
 *         description: Media uploaded successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/coupons:
 *   get:
 *     summary: Get all valid coupons (Public)
 *     tags: [Coupons]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by applicable category
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [percentage, fixed]
 *         description: Filter by discount type
 *     responses:
 *       200:
 *         description: Coupons retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Coupon'
 */

/**
 * @swagger
 * /api/coupons/validate:
 *   post:
 *     summary: Validate a coupon code
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: Coupon code to validate
 *                 example: "SAVE10"
 *               cartValue:
 *                 type: number
 *                 description: Total cart value
 *                 example: 1000
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     category:
 *                       type: string
 *     responses:
 *       200:
 *         description: Coupon validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 valid:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     coupon:
 *                       $ref: '#/components/schemas/Coupon'
 *                     discount:
 *                       type: number
 *                       description: Calculated discount amount
 *       400:
 *         description: Invalid coupon code
 */

/**
 * @swagger
 * /api/coupons:
 *   post:
 *     summary: Create a new coupon (Admin only)
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *               - type
 *               - value
 *               - validFrom
 *               - validUntil
 *             properties:
 *               code:
 *                 type: string
 *                 description: Unique coupon code
 *                 example: "SAVE10"
 *               name:
 *                 type: string
 *                 description: Coupon name
 *                 example: "10% Off Sale"
 *               description:
 *                 type: string
 *                 description: Coupon description
 *                 example: "Get 10% off on all jewelry items"
 *               type:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 example: "percentage"
 *               value:
 *                 type: number
 *                 description: Discount value
 *                 example: 10
 *               minimumOrderValue:
 *                 type: number
 *                 description: Minimum order value required
 *                 example: 500
 *               maximumDiscount:
 *                 type: number
 *                 description: Maximum discount amount
 *                 example: 200
 *               usageLimit:
 *                 type: number
 *                 description: Total usage limit
 *                 example: 100
 *               userUsageLimit:
 *                 type: number
 *                 description: Usage limit per user
 *                 example: 1
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *                 description: Coupon validity start date
 *               validUntil:
 *                 type: string
 *                 format: date-time
 *                 description: Coupon validity end date
 *               applicableCategories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Applicable product categories
 *                 example: ["Rings", "Necklaces"]
 *               applicableProducts:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Applicable product IDs
 *               isActive:
 *                 type: boolean
 *                 description: Coupon active status
 *                 example: true
 *               isPublic:
 *                 type: boolean
 *                 description: Public visibility status
 *                 example: true
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               phone:
 *                 type: string
 *                 description: User's phone number
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 description: User's date of birth
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 description: User's gender
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/users/addresses:
 *   post:
 *     summary: Add a new address
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - fullName
 *               - phone
 *               - addressLine1
 *               - city
 *               - state
 *               - postalCode
 *               - country
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [home, work, other]
 *                 example: "home"
 *               fullName:
 *                 type: string
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 example: "+1234567890"
 *               addressLine1:
 *                 type: string
 *                 example: "123 Main Street"
 *               addressLine2:
 *                 type: string
 *                 example: "Apt 4B"
 *               city:
 *                 type: string
 *                 example: "New York"
 *               state:
 *                 type: string
 *                 example: "NY"
 *               postalCode:
 *                 type: string
 *                 example: "10001"
 *               country:
 *                 type: string
 *                 example: "United States"
 *               isDefault:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Address added successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with filtering and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by product type
 *       - in: query
 *         name: material
 *         schema:
 *           type: string
 *         description: Filter by material
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in product name and description
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, name_asc, name_desc, newest, oldest, popularity]
 *           default: newest
 *         description: Sort products
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter featured products only
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Filter products in stock only
 *     responses:
 *       200:
 *         description: Products retrieved successfully
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
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *                     filters:
 *                       type: object
 *                       description: Available filter options
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
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
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gold Diamond Ring"
 *               description:
 *                 type: string
 *                 example: "Beautiful gold ring with diamond centerpiece"
 *               price:
 *                 type: number
 *                 example: 1299.99
 *               originalPrice:
 *                 type: number
 *                 example: 1599.99
 *               category:
 *                 type: string
 *                 example: "Rings"
 *               type:
 *                 type: string
 *                 example: "Wedding Ring"
 *               material:
 *                 type: string
 *                 example: "Gold"
 *               weight:
 *                 type: number
 *                 example: 5.2
 *               dimensions:
 *                 type: object
 *                 properties:
 *                   length:
 *                     type: number
 *                     example: 2.5
 *                   width:
 *                     type: number
 *                     example: 2.0
 *                   height:
 *                     type: number
 *                     example: 1.5
 *                   unit:
 *                     type: string
 *                     example: "cm"
 *               stock:
 *                 type: number
 *                 example: 10
 *               lowStockThreshold:
 *                 type: number
 *                 example: 5
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               isFeatured:
 *                 type: boolean
 *                 example: false
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["gold", "diamond", "wedding"]
 *               specifications:
 *                 type: object
 *                 example: {"purity": "18K", "stone": "Diamond"}
 *     responses:
 *       201:
 *         description: Product created successfully
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               originalPrice:
 *                 type: number
 *               category:
 *                 type: string
 *               type:
 *                 type: string
 *               material:
 *                 type: string
 *               weight:
 *                 type: number
 *               dimensions:
 *                 type: object
 *               stock:
 *                 type: number
 *               lowStockThreshold:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               specifications:
 *                 type: object
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/products/{id}/stock:
 *   patch:
 *     summary: Update product stock (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stock
 *             properties:
 *               stock:
 *                 type: number
 *                 description: New stock quantity
 *                 example: 15
 *               lowStockThreshold:
 *                 type: number
 *                 description: Low stock threshold
 *                 example: 5
 *     responses:
 *       200:
 *         description: Stock updated successfully
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/products/category/{category}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Product category
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
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 */

/**
 * @swagger
 * /api/products/featured:
 *   get:
 *     summary: Get featured products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of featured products to return
 *     responses:
 *       200:
 *         description: Featured products retrieved successfully
 */

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
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
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 */

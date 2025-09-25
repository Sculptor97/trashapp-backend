/**
 * Pagination middleware
 * Parses pagination query parameters and attaches pagination info to req.pagination
 *
 * Query parameters:
 * - page: Page number (default: 1)
 * - page_size: Items per page (default: 10)
 * - search: Search term for filtering (optional)
 */

/**
 * Pagination middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const paginationMiddleware = (req, res, next) => {
  // Parse pagination parameters
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;
  const search = req.query.search || null;

  // Validate pagination parameters
  if (page < 1) {
    return res.error(
      'Page number must be greater than 0',
      'INVALID_PAGE',
      {},
      400
    );
  }

  if (pageSize < 1 || pageSize > 100) {
    return res.error(
      'Page size must be between 1 and 100',
      'INVALID_PAGE_SIZE',
      {},
      400
    );
  }

  // Calculate skip value for database queries
  const skip = (page - 1) * pageSize;

  // Attach pagination info to request object
  req.pagination = {
    page,
    pageSize,
    skip,
    limit: pageSize,
    search,
  };

  next();
};

/**
 * Create search filter for MongoDB queries
 * @param {string} searchTerm - Search term
 * @param {Array} searchFields - Array of field names to search in
 * @returns {Object} MongoDB search filter
 */
export const createSearchFilter = (searchTerm, searchFields) => {
  if (!searchTerm || !searchFields || searchFields.length === 0) {
    return {};
  }

  const searchRegex = new RegExp(searchTerm, 'i'); // Case-insensitive search

  if (searchFields.length === 1) {
    return { [searchFields[0]]: { $regex: searchRegex } };
  }

  // Multiple fields - use $or operator
  return {
    $or: searchFields.map(field => ({
      [field]: { $regex: searchRegex },
    })),
  };
};

/**
 * Calculate pagination metadata
 * @param {number} totalItems - Total number of items
 * @param {number} page - Current page
 * @param {number} pageSize - Items per page
 * @returns {Object} Pagination metadata
 */
export const calculatePaginationMetadata = (totalItems, page, pageSize) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    current_page: page,
    page_size: pageSize,
    total_items: totalItems,
    total_pages: totalPages,
    has_next_page: page < totalPages,
    has_previous_page: page > 1,
    next_page: page < totalPages ? page + 1 : null,
    previous_page: page > 1 ? page - 1 : null,
  };
};

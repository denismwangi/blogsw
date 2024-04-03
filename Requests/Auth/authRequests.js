const { body, validationResult } = require('express-validator');

// Define a function that returns the middleware array
function registerRequest() {
    return [
        // Validation rules using express-validator
        body('name').notEmpty().withMessage('Name is required'),
        body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
        body('phone').notEmpty().withMessage('Phone is required'),
        body('password').notEmpty().withMessage('Password is required')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

        // Middleware function to handle validation errors
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            next(); // Proceed to the next middleware if validation passes
        }
    ];
}

module.exports = registerRequest();

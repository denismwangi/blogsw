const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Corrected variable name and assignment
    let message = err.message;
    let success = false;

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        success,
        message = 'Resource not found';
        statusCode = 404;
    }

    res.status(statusCode).json({
        success,
        message,
        stack: process.env.NODE_ENV === 'production' ? 'something went wrong please contact the admin' : err.stack // Corrected process.env.NODE_URL to process.env.NODE_ENV
    });
};

module.exports = { notFound, errorHandler };

export const multerErrorHandling = async (err, req, res, next) => {
    if (err.message === 'only-image') {
        return res.status(400).json({ msg: "Only image file is allowed to upload" });
    }
    next()
};

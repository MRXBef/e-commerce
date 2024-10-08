import jwt from 'jsonwebtoken'

//fungsi ini sebagai middleware yang menangani request untuk halaman publik dari frontend
const getPublicId = (req, res, next) => {
    const {refreshToken} = req.cookies
    if(refreshToken === undefined) {
        req.publicId = refreshToken
        return next()
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if(err) {
            req.publicId = undefined
            return next()
        } 
        req.publicId = decoded.userId
        next()
    })
}

export default getPublicId
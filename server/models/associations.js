import Category from "./categoryModel.js"
import Image from "./imageModel.js"
import Products from "./productModel.js"
import Users from "./userModel.js"


const defineAssociations = () => {
    Category.belongsTo(Products, {
        foreignKey: "product_id",
        as: "product"
    })

    Image.belongsTo(Products, {
        foreignKey: "product_id",
        as: "product"
    })
    
    Products.hasMany(Image, {
        foreignKey: "product_id",
        as: "images"
    })

    Products.hasMany(Category, {
        foreignKey: "product_id",
        as: "categories"
    })
    
    Products.belongsTo(Users, {
        foreignKey: "user_id",
        as: "user"
    })

    Users.hasMany(Products, {
        foreignKey: "user_id",
        as: "products"
    })
    
}

export default defineAssociations
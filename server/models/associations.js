import Category from "./categoryModel.js"
import Image from "./imageModel.js"
import Products from "./productModel.js"
import Users from "./userModel.js"


const defineAssociations = () => {

    //products dan image
    Image.belongsTo(Products, {
        foreignKey: "product_id",
        as: "product",
        onDelete: 'CASCADE'
    })
    Products.hasMany(Image, {
        foreignKey: "product_id",
        as: "images"
    })

    
    //products dan category
    Category.belongsTo(Products, {
        foreignKey: "product_id",
        as: "product",
        onDelete: 'CASCADE'
    })
    Products.hasMany(Category, {
        foreignKey: "product_id",
        as: "categories"
    })
    

    //users dan products
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
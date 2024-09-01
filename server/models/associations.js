import Cart from "./cartModel.js"
import Category from "./categoryModel.js"
import Image from "./imageModel.js"
import Products from "./productModel.js"
import Transaction from "./transactionModel.js"
import Users from "./userModel.js"
import UserRelation from "./userRelation.js"


const defineAssociations = () => {

    //products dan image associations
    Image.belongsTo(Products, {
        foreignKey: "product_id",
        as: "product",
        onDelete: 'SET NULL'
    })
    Products.hasMany(Image, {
        foreignKey: "product_id",
        as: "images"
    })
    
    //products dan category associations
    Category.belongsTo(Products, {
        foreignKey: "product_id",
        as: "product",
        onDelete: 'SET NULL'
    })
    Products.hasMany(Category, {
        foreignKey: "product_id",
        as: "categories"
    })
    
    //users dan products associations
    Products.belongsTo(Users, {
        foreignKey: "user_id",
        as: "user",
        onDelete: 'SET NULL'
    })
    Users.hasMany(Products, {
        foreignKey: "user_id",
        as: "products"
    })

    //Cart associations
    Cart.belongsTo(Products, {
        foreignKey: 'product_id',
        as: 'product',
        onDelete: 'SET NULL'
    })
    Products.hasMany(Cart, {
        foreignKey: 'product_id',
        as: 'carts'
    })
    Cart.belongsTo(Users, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'SET NULL'
    })
    Users.hasMany(Cart, {
        foreignKey: 'user_id',
        as: 'carts'
    })

    //userRelation and User associations
    UserRelation.belongsTo(Users, {
        foreignKey: 'followed_user_id',
        as: 'followed',
        onDelete: 'SET NULL'
    })
    UserRelation.belongsTo(Users, {
        foreignKey: 'following_user_id',
        as: 'following',
        onDelete: 'SET NULL'
    })
    Users.hasMany(UserRelation, {
        foreignKey: 'followed_user_id',
        as: 'followeds'
    })
    Users.hasMany(UserRelation, {
        foreignKey: 'following_user_id',
        as: 'followings'
    })

    //transaction associations
    Transaction.belongsTo(Users, {
        foreignKey: 'seller_id',
        as: 'seller',
        onDelete: 'SET NULL'
    })
    Transaction.belongsTo(Users, {
        foreignKey: 'buyer_id',
        as: 'buyer',
        onDelete: 'SET NULL'
    })
    Users.hasMany(Transaction, {
        foreignKey: 'seller_id',
        as: 'sellers'
    })
    Users.hasMany(Transaction, {
        foreignKey: 'buyer_id',
        as: 'buyers'
    })
    Transaction.belongsTo(Products, {
        foreignKey: 'product_id',
        as: 'product',
        onDelete: 'SET NULL'
    })
    Products.hasMany(Transaction, {
        foreignKey: 'product_id',
        as: 'transactions'
    })
    
}

export default defineAssociations
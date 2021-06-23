const { Sequelize, Model, DataTypes } = require("sequelize");
const dbCon = require('../../database/connection');
const ProductModel = require('./ProductModel');
const UserModel = require('./UserModel');

const ProductLike = dbCon.define('ProductLike', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        required: true,
    },
    productId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'products',
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
    },
    isLike: {
        type: DataTypes.BOOLEAN,
        required: true,
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
    }
});

ProductModel.belongsToMany(UserModel, {
    through: ProductLike,
    onDelete: 'CASCADE',
    foreignKey: "productId",
});

UserModel.belongsToMany(ProductModel, {
    through: ProductLike,
    onDelete: 'CASCADE',
    foreignKey: "userId",
});

module.exports = ProductLike;

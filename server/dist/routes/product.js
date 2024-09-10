"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = require("express");
const product_1 = require("../models/product");
const user_1 = require("./user");
const user_2 = require("../models/user");
const errors_1 = require("../errors");
const router = (0, express_1.Router)();
exports.productRouter = router;
router.get("/", user_1.verifyToken, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_1.ProductModel.find({});
        res.json({ products });
    }
    catch (err) {
        res.status(400).json({ err });
    }
}));
router.post("/cart/edit", user_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerID, cartItems } = req.body;
    try {
        const user = yield user_2.UserModel.findById(customerID);
        user.cartItems = cartItems;
        if (user) {
            yield user.save();
            res.status(200).json({ success: true, cartItems: cartItems });
        }
        else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
router.get("/cart/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const user = yield user_2.UserModel.findById(userId);
        if (user) {
            res.status(200).json({ success: true, cartItems: user.cartItems });
        }
        else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));
router.post("/checkout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerID, cartItems } = req.body;
    try {
        const user = yield user_2.UserModel.findById(customerID);
        const productIDs = Object.keys(cartItems);
        const products = yield product_1.ProductModel.find({ _id: { $in: productIDs } });
        if (!user) {
            return res.status(400).json({ type: errors_1.UserErrors.NO_USER_FOUND });
        }
        if (products.length !== productIDs.length) {
            return res.status(400).json({ type: errors_1.ProductErrors.NO_PRODUCT_FOUND });
        }
        let totalPrice = 0;
        for (const item in cartItems) {
            const product = products.find((product) => String(product._id) === item);
            if (!products) {
                return res.status(400).json({ type: errors_1.ProductErrors.NO_PRODUCT_FOUND });
            }
            if (product.stockQuantity < cartItems[item]) {
                return res.status(400).json({ type: errors_1.ProductErrors.NOT_ENOUGH_STOCK });
            }
            if (product.stockQuantity < cartItems[item]) {
                return res.status(400).json({ type: errors_1.ProductErrors.NOT_ENOUGH_STOCK });
            }
            totalPrice += product.price * cartItems[item];
        }
        if (user.availableMoney < totalPrice) {
            return res.status(400).json({ type: errors_1.ProductErrors.NO_AVAILABLE_MONEY });
        }
        user.availableMoney -= totalPrice;
        user.purchasedItems.push(...productIDs);
        yield user.save();
        yield product_1.ProductModel.updateMany({ _id: { $in: productIDs } }, { $inc: { stockQuantity: -1 } });
        res.json({ purchasedItems: user.purchasedItems });
    }
    catch (err) {
        res.status(400).json(err);
    }
}));
// router.get("/purchased-items/:customerID", verifyToken, async (req, res) => {
//   const { customerID } = req.params;
//   try {
//     const user = await UserModel.findById(customerID);
//     if (!user) {
//       res.status(400).json({ type: UserErrors.NO_USER_FOUND });
//     }
//     const products = await ProductModel.find({
//       _id: { $in: user.purchasedItems },
//     });
//     res.json({ purchasedItems: products });
//   } catch (err) {
//     res.status(500).json({ err });
//   }
// });
router.get("/purchased-items/:customerID", user_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerID } = req.params;
    try {
        const user = yield user_2.UserModel.findById(customerID);
        if (!user) {
            return res.status(400).json({ type: errors_1.UserErrors.NO_USER_FOUND });
        }
        if (!user.purchasedItems) {
            return res.status(200).json({ purchasedItems: [] });
        }
        const products = yield product_1.ProductModel.find({
            _id: { $in: user.purchasedItems },
        });
        res.json({ purchasedItems: products });
    }
    catch (err) {
        res.status(500).json({ err });
    }
}));

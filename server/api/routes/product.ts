import { Router, Request, Response } from "express";
import { ProductModel } from "../models/product";
import { UserModel } from "../models/user";
import { ProductErrors, UserErrors } from "../errors";
import verifyToken from "../middleware/verifyToken";

const router = Router();

router.get("/", async (_, res: Response) => {
  try {
    const products = await ProductModel.find({});
    res.json({ products });
  } catch (err) {
    res.status(400).json({ err });
  }
});

router.post("/cart/edit", verifyToken, async (req: Request, res: Response) => {
  const { cartItems } = req.body;
  try {
    const user = await UserModel.findById(req.userId);
    user.cartItems = cartItems;
    if (user) {
      await user.save();
      res.status(200).json({ success: true, cartItems: cartItems });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/cart", verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId; // UserId is available from the middleware

    // Fetch the user document by userId
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // If user is found, return the cartItems
    return res.status(200).json({ success: true, cartItems: user.cartItems });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


router.post("/checkout", verifyToken, async (req: Request, res: Response) => {
  const { cartItems } = req.body;
  try {
    const user = await UserModel.findById(req.userId);
    const productIDs = Object.keys(cartItems);
    const products = await ProductModel.find({ _id: { $in: productIDs } });

    if (!user) {
      return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
    }

    if (products.length !== productIDs.length) {
      return res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
    }

    let totalPrice = 0;
    for (const item in cartItems) {
      const product = products.find((product) => String(product._id) === item);

      if (!products) {
        return res.status(400).json({ type: ProductErrors.NO_PRODUCT_FOUND });
      }

      if (product.stockQuantity < cartItems[item]) {
        return res.status(400).json({ type: ProductErrors.NOT_ENOUGH_STOCK });
      }

      if (product.stockQuantity < cartItems[item]) {
        return res.status(400).json({ type: ProductErrors.NOT_ENOUGH_STOCK });
      }
      totalPrice += product.price * cartItems[item];
    }
    if (user.availableMoney < totalPrice) {
      return res.status(400).json({ type: ProductErrors.NO_AVAILABLE_MONEY });
    }

    user.availableMoney -= totalPrice;
    user.purchasedItems.push(...productIDs);
    await user.save();
    await ProductModel.updateMany(
      { _id: { $in: productIDs } },
      { $inc: { stockQuantity: -1 } }
    );
    res.json({ purchasedItems: user.purchasedItems });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get(
  "/purchased-items",
  verifyToken,
  async (req: Request, res: Response) => {
    const userId = req.userId; // Assuming userId is set in the middleware

    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
      }

      if (!user.purchasedItems || user.purchasedItems.length === 0) {
        return res.status(200).json({ purchasedItems: [] });
      }

      const products = await ProductModel.find({
        _id: { $in: user.purchasedItems },
      });

      res.json({ purchasedItems: products });
    } catch (err) {
      res.status(500).json({ err });
    }
  }
);

// router.get("/purchased-items/:customerID", verifyToken, async (req: Request, res: Response) => {
//   const { customerID } = req.params;
//   try {
//     const user = await UserModel.findById(customerID);
//     if (!user) {
//       return res.status(400).json({ type: UserErrors.NO_USER_FOUND });
//     }

//     if (!user.purchasedItems) {
//       return res.status(200).json({ purchasedItems: [] });
//     }

//     const products = await ProductModel.find({
//       _id: { $in: user.purchasedItems },
//     });

//     res.json({ purchasedItems: products });
//   } catch (err) {
//     res.status(500).json({ err });
//   }
// });

export { router as productRouter };

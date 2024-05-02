import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  updateProfilePhotoController,
  profilePhotoController,
  allUsersController,
  getUserController,
  updateProfileAdminController,
  deleteUserController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

//router object
const router = express.Router();

//REGISTER 
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//Forgot Password || POST
router.post("/forgotpassword", forgotPasswordController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//update profile by id
router.put("/profile/:uid", requireSignIn, isAdmin, updateProfileAdminController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

//routes
router.put(
  "/update-profilePhoto/:uid",
  requireSignIn,
  formidable(),
  updateProfilePhotoController
);

// get profile pic
router.get("/profile-photo/:uid", profilePhotoController);

// get all users
router.get("/all-users", requireSignIn, isAdmin, allUsersController);

// get single user by id
router.get("/get-user/:uid", requireSignIn, isAdmin, getUserController)

//delete product
router.delete("/delete-user/:pid", requireSignIn, isAdmin, deleteUserController);

export default router;

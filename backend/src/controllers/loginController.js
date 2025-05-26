import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import clientModel from "../models/customers.js";
import employeesModel from "../models/employee.js";
import { config } from "../config.js";

// Array de funciones
const loginController = {};

loginController.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let userFound;
    let userType;

    if (email === config.admin.email && password === config.admin.password) {
      userType = "admin";
      userFound = { _id: "admin" };
    } else {
      userFound = await employeesModel.findOne({ email });
      userType = "employee";
      if (!userFound) {
        userFound = await clientModel.findOne({ email });
        userType = "client";
      }
    }

    if (!userFound) {
      return res.status(401).json({ message: "user not found" });
    }

    if (userType !== "admin") {
      const isMatch = await bcryptjs.compare(password, userFound.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }
    }

    jsonwebtoken.sign(
      { id: userFound._id, userType },
      config.JWT.secret,
      { expiresIn: config.JWT.expires },
      (error, token) => {
        if (error) {
          console.log("error" + error);
          return res.status(500).json({ message: "Token generation error" });
        }
        res.cookie("authToken", token, { httpOnly: true, sameSite: "lax" });
        return res.json({ message: "login successful" });
      }
    );
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default loginController;

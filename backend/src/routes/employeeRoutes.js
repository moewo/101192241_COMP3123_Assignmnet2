const express = require("express");
const { body } = require("express-validator");
const employeeController = require("../controllers/employeeController");


const router = express.Router();


router.get("/employees", employeeController.getAllEmployees);

router.post(
  "/employees",
  [
    body("first_name").notEmpty().withMessage("first_name is required"),
    body("last_name").notEmpty().withMessage("last_name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("position").notEmpty().withMessage("position is required"),
    body("salary").isNumeric().withMessage("salary must be a number"),
    body("date_of_joining")
      .notEmpty()
      .withMessage("date_of_joining is required")
      .isISO8601()
      .withMessage("date_of_joining must be a valid date"),
    body("department").notEmpty().withMessage("department is required"),
  ],
  employeeController.createEmployee
);


router.get("/employees/:eid", employeeController.getEmployeeById);


router.put(
  "/employees/:eid",
  [
    
    body("email").optional().isEmail().withMessage("Valid email is required"),
    body("salary")
      .optional()
      .isNumeric()
      .withMessage("salary must be a number"),
    body("date_of_joining")
      .optional()
      .isISO8601()
      .withMessage("date_of_joining must be a valid date"),
  ],
  employeeController.updateEmployeeById
);


router.delete("/employees", employeeController.deleteEmployeeById);

module.exports = router;
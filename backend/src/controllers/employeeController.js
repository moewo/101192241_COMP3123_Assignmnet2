
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Employee = require("../models/Employee");


const mapEmployee = (emp) => ({
  employee_id: emp._id.toString(),
  first_name: emp.first_name,
  last_name: emp.last_name,
  email: emp.email,
  position: emp.position,
  salary: emp.salary,
  date_of_joining: emp.date_of_joining,
  department: emp.department,
});


exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    return res.status(200).json(employees.map(mapEmployee));
  } catch (error) {
    console.error("Get employees error:", error.message);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};


exports.createEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  }

  try {
    const employee = await Employee.create(req.body);

    return res.status(201).json({
      message: "Employee created successfully.",
      employee_id: employee._id.toString(),
    });
  } catch (error) {
    console.error("Create employee error:", error.message);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};


exports.getEmployeeById = async (req, res) => {
  const { eid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eid)) {
    return res.status(400).json({ status: false, message: "Invalid employee ID" });
  }

  try {
    const employee = await Employee.findById(eid);
    if (!employee) {
      return res.status(404).json({ status: false, message: "Employee not found" });
    }

    return res.status(200).json(mapEmployee(employee));
  } catch (error) {
    console.error("Get employee error:", error.message);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};


exports.updateEmployeeById = async (req, res) => {
  const { eid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eid)) {
    return res.status(400).json({ status: false, message: "Invalid employee ID" });
  }

  try {
    const employee = await Employee.findByIdAndUpdate(eid, req.body, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({ status: false, message: "Employee not found" });
    }

    return res
      .status(200)
      .json({ message: "Employee details updated successfully." });
  } catch (error) {
    console.error("Update employee error:", error.message);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};


exports.deleteEmployeeById = async (req, res) => {
  const { eid } = req.query;

  if (!mongoose.Types.ObjectId.isValid(eid)) {
    return res.status(400).json({ status: false, message: "Invalid employee ID" });
  }

  try {
    const deleted = await Employee.findByIdAndDelete(eid);
    if (!deleted) {
      return res.status(404).json({ status: false, message: "Employee not found" });
    }

    
    return res.status(204).send();
  } catch (error) {
    console.error("Delete employee error:", error.message);
    return res.status(500).json({ status: false, message: "Server error" });
  }
};
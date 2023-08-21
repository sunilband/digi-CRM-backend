const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../DataBase/userSchema");
const Lead = require("../../DataBase/leadsSchema");
const Customer = require("../../DataBase/customerSchema");
const SuperUser = require("../../DataBase/superUserSchema");
const Invoice = require("../../DataBase/SalesSchemas/invoiceSchema");
const Item = require("../../DataBase/SalesSchemas/itemsSchema");
const mongoose = require("mongoose");

const createInvoice = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      return res.send({
        success: false,
        error: "No token found",
      });

    let admin = false;
    const decoded = jwt.verify(token, process.env.private_key);
    let user = await User.findById(decoded);
    if (!user) {
      user = await SuperUser.findById(decoded);
      admin = true;
    }
    if (!user) {
      return res.send({
        success: false,
        error: "Non users cant assign tasks",
      });
    }

    const {
      customerID,
      billingAddress,
      shippingAddress,
      invoiceNumber,
      date,
      expiryDate,
      currency,
      tags,
      discountType,
      status,
      saleAgent,
      recurringInvoice,
      paymentMode,
      reference,
      adminNote,
      clientNote,
      terms,
      items,
      totalDiscountType,
      value,
      adjustment,
    } = req.body;
    if (
      !customerID ||
      !billingAddress ||
      !shippingAddress ||
      !invoiceNumber ||
      !date ||
      !expiryDate ||
      !currency ||
      !saleAgent ||
      !adminNote ||
      !items
    ) {
      return res.send({
        success: false,
        error: "Incomplete data",
      });
    }

    // start process of feching items from database
    let itemsArray = items.map((item) => {
      return item.id;
    });
    itemsArray = await Item.find({ _id: { $in: itemsArray } });
    if (itemsArray.includes(undefined)) {
      return res.send({
        success: false,
        error: "some item not found",
      });
    }

    for (let i = 0; i < items.length; i++) {
      items[i].data = itemsArray[i];
    }

    // calculate subtotal
    const data = {
      items,
      discount: {
        totalDiscountType,
        value,
        adjustment,
      },
    };
    let total = 0;
    for (let item of data.items) {
      let itemTotal = item.rate * item.quantity;
      let taxAmount = itemTotal * (item.tax / 100);
      let ItemTotal = itemTotal + taxAmount;
      // Convert from INR to USD if currency is INR
      // change conversion rate here
      if (item.data.rate.currency === "INR") {
        const conversionRate = 0.013; // 1 INR = 0.013 USD
        ItemTotal *= conversionRate;
      }
      total += ItemTotal;
    }

    if (data.discount.totalDiscountType === "Percentage") {
      total -= total * (data.discount.value / 100);
    } else if (data.discount.totalDiscountType === "Fixed") {
      total -= data.discount.value;
    }

    total += data.discount.adjustment;
    // console.log(`The final amount is ${parseFloat(total).toFixed(2)} USD.`);
    //------------------------------------

    try {
      try {
        var assignedUser = await User.findById(saleAgent);
        if (!assignedUser) {
          if (admin) {
            assignedUser = await SuperUser.findById(saleAgent);
          }
        }

        if (!assignedUser) {
          return res.send({
            success: false,
            error: "The user to assign invoice doesnt exist",
          });
        }
      } catch (error) {
        return res.send({
          success: false,
          error: "The user to assign invoice doesnt exist",
        });
      }

      if (customerID !== undefined) {
        try {
          var customer = await Customer.findById(customerID);
          if (!customer) {
            return res.send({
              success: false,
              error: "The customer doesnt exist",
            });
          }
        } catch (error) {
          return res.send({
            success: false,
            error: error.toString(),
          });
        }
      }

      var newInvoice = new Invoice({
        customer: {
          name: customer.company,
          id: customer._id,
        },
        billingAddress,
        shippingAddress,
        invoiceNumber,
        date,
        expiryDate,
        currency,
        tags,
        discountType,
        status,
        saleAgent: {
          name: assignedUser.name,
          id: assignedUser._id,
        },
        assignedBy: {
          name: user.name,
          id: user._id,
        },
        recurringInvoice,
        paymentMode,
        reference,
        adminNote,
        clientNote,
        terms,
        items,
        discount: {
          totalDiscountType,
          value,
          adjustment,
        },
        subTotal: total,
      });

      await newInvoice.save();
      res.json({
        success: true,
        message: "Invoice created successfully",
        data: newInvoice,
      });
    } catch (error) {
      console.log(error);
      res.json({
        success: false,
        error,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error,
    });
  }
};

//   if userID passed then it will search leads for specific user else will use decoded token
const getInvoices = async (req, res) => {
  try {
    const { userID } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      return res.send({
        success: false,
        error: "No token found",
      });

    const decoded = jwt.verify(token, process.env.private_key);
    let user = await User.findById(decoded);
    if (!user) {
      user = await SuperUser.findById(decoded);
    }

    if (!user) {
      return res.send({
        success: false,
        error: "Non users fetch invoices",
      });
    }

    const invoices = await Invoice.find({});

    const assignedInvoices = await Invoice.find({
      "assignedBy.id": userID ? userID : decoded,
    });

    return res.send({
      success: true,
      message: "Invoices fetched successfully",
      data: {
        Invoices: invoices,
        assignedInvoices: assignedInvoices,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      error,
    });
  }
};

// update lead info
const updateInvoice = async (req, res) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    if (!token)
      return res.send({
        success: false,
        error: "No token found",
      });
    const decoded = jwt.verify(token, process.env.private_key);
    let user = await User.findById(decoded);
    if (!user) {
      user = await SuperUser.findById(decoded);
    }

    if (!user) {
      return res.send({
        success: false,
        error: "Non users cant update tasks",
      });
    }

    try {
      const updatedInvoice = req.body;

      let newInvoice = await Invoice.findByIdAndUpdate(
        req.body._id,
        updatedInvoice,
        {
          new: true,
        }
      );

      if (!newInvoice) {
        return res.send({
          success: false,
          error: "Invoice update failed",
        });
      }

      res.send({
        success: true,
        message: "Invoice updated",
        updatedInvoice: newInvoice,
      });
    } catch (err) {
      res.status(500).send(err);
    }
  } catch (error) {
    return res.send({
      success: false,
      error: error,
    });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  updateInvoice,
};

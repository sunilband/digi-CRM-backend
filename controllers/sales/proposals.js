const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../DataBase/userSchema");
const Lead = require("../../DataBase/leadsSchema");
const Customer = require("../../DataBase/customerSchema");
const SuperUser = require("../../DataBase/superUserSchema");
const Proposal = require("../../DataBase/SalesSchemas/proposalSchema");
const Item = require("../../DataBase/SalesSchemas/itemsSchema");
const mongoose = require("mongoose");

const createProposal = async (req, res) => {
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
      subject,
      related,
      leadID,
      customerID,
      date,
      openTill,
      currency,
      tags,
      status,
      discountType,
      to,
      street,
      city,
      state,
      zip,
      country,
      email,
      phone,
      assignedTo,
      items,
      totalDiscountType,
      value,
      adjustment,
      subTotal,
    } = req.body;
    if (
      !subject ||
      !related ||
      !(leadID || customerID) ||
      !date ||
      !openTill ||
      !currency ||
      !to ||
      !street ||
      !city ||
      !state ||
      !zip ||
      !country ||
      !email ||
      !phone ||
      !assignedTo ||
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
      console.log(item);
      let itemTotal = item.rate * item.quantity;
      let taxAmount = itemTotal * (item.tax / 100);
      let ItemTotal = itemTotal + taxAmount;
      if(item.data.rate.currency === "INR") {
      // change conversion rate here
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

    // Convert from INR to USD if currency is INR

    total += data.discount.adjustment;
    // console.log(`The final amount is ${parseFloat(total).toFixed(2)} USD.`);
    //------------------------------------

    try {
      try {
        var assignedUser = await User.findById(assignedTo);
        if (!assignedUser) {
          if (admin) {
            assignedUser = await SuperUser.findById(assignedTo);
          }
        }

        if (!assignedUser) {
          return res.send({
            success: false,
            error: "The user to assign proposal doesnt exist",
          });
        }
      } catch (error) {
        return res.send({
          success: false,
          error: "The user to assign proposal doesnt exist",
        });
      }

      console.log(leadID, customerID);
      if (leadID !== undefined) {
        try {
          var lead = await Lead.findById(leadID);
          if (!lead) {
            return res.send({
              success: false,
              error: "The lead doesnt exist",
            });
          }
        } catch (error) {
          return res.send({
            success: false,
            error: error.toString(),
          });
        }
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

      if (leadID !== undefined) {
        var newProposal = new Proposal({
          assignedBy: {
            name: user.name,
            id: user._id,
          },
          assignedTo: {
            name: assignedUser.name,
            id: assignedUser._id,
          },
          lead: {
            name: lead.name,
            id: lead._id,
          },
          subject,
          related,
          date,
          openTill,
          currency,
          tags,
          status,
          discountType,
          to,
          street,
          city,
          state,
          zip,
          country,
          email,
          phone,
          items,
          discount: {
            totalDiscountType,
            value,
            adjustment,
          },
          subTotal: total
        });
      } else {
        var newProposal = new Proposal({
          assignedBy: {
            name: user.name,
            id: user._id,
          },
          assignedTo: {
            name: assignedUser.name,
            id: assignedUser._id,
          },
          customer: {
            name: customer.name,
            id: customer._id,
          },
          subject,
          related,
          date,
          openTill,
          currency,
          tags,
          status,
          discountType,
          to,
          street,
          city,
          state,
          zip,
          country,
          email,
          phone,
          items,
          discount: {
            totalDiscountType,
            value,
            adjustment,
          },
          subTotal: total
        });
      }

      await newProposal.save();
      res.json({
        success: true,
        message: "Proposal created successfully",
        data: newProposal,
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
const getProposals = async (req, res) => {
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
        error: "Non users fetch proposals",
      });
    }

    const proposals = await Proposal.find({});
    const assignedProposals = await Proposal.find({
      "assignedBy.id": userID ? userID : decoded,
    });
    return res.send({
      success: true,
      message: "Proposals fetched successfully",
      data: {
        Proposals: proposals,
        assignedProposals: assignedProposals,
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
const updateProposal = async (req, res) => {
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
      const updatedProposal = req.body;

      let newProposal = await Proposal.findByIdAndUpdate(
        req.body._id,
        updatedProposal,
        {
          new: true,
        }
      );

      if (!newProposal) {
        return res.send({
          success: false,
          error: "lead update failed",
        });
      }

      res.send({
        success: true,
        message: "Proposal updated",
        updatedProposal: newProposal,
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
  createProposal,
  getProposals,
  updateProposal,
};

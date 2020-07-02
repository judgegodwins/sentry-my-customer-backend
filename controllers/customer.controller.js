const UserModel = require("../models/store_admin");
const { body } = require('express-validator/check');

exports.validate = (method) => {
    switch (method) {
        case 'body': {
            return [
                body('name').isLength({ min: 3 }),
            ]
        }
    }
}

exports.create = async (req, res) => {
  
  const id = req.params.current_user
  console.log(id)
  //get current user's id and add a new customer to it
  UserModel.findById(id).catch(err =>{
    res.send(err)
  }).then(user =>{
    console.log(user)
    if(user.stores == [] || user.stores.length == 0){
      res.status(403).json({
        message: "please add a store before adding customers"
      })
    }
  })

  // res.status(201).json({
  //   status: true,
  //   message: "Customer was created",
  //   data: {
  //     statusCode: 201,
  //     customer: user
  //   },
  // });
};

exports.getById = (req, res) => {
  const identifier = req.user.phone_number;
  let id = req.params.customerId;
  try {
    UserModel.findOne({ identifier })
      .then(user => {
        // let store = user.stores.find(store => store.customers.find(customer => customer._id === id));
        // res.json(store);
        let allCustomers = [];
        user.stores.forEach(store => {
          store.customers.forEach(customer => {
            allCustomers.push(customer); // bring out all customers from various stors and put in one array
          })
          // let a = [];
          // a.push(store.customers);
        });
        let customerToBeSent = allCustomers.find(customer => customer._id == id);

        res.json(customerToBeSent);
      })
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      error: {
        code: 500,
        message: error.message
      }
    });
  }
};

exports.updateById = (req, res) => {
  Customer.updateOne({ _id: req.params.customerId }, { $set: {
    name: req.body.name,
    phone_number: req.body.phone,
  }})
    .exec()
    .then((result) => {
      res.status(200).json({
        status: true,
        message: "Customer was updated",
        data: {
          customer: {
            id: req.params.customerId,
            name: req.body.name,
            phone: req.body.phone,
          }
        }
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: false,
        message: error.message,
        error: {
          code: 500,
          message: error.message
        }
      });
    });
};

exports.deleteById = (req, res) => {
  try {
    Customer.findByIdAndDelete(req.params.customerId, (error, customer) => {
      if (error) {
        res.status(404).json({
          status: false,
          //message: error.message,
        });
      } else if (!customer) {
        res.status(404).json({
          status: false,
          message: "Customer not found",
          error: {
            code: 404,
            message: "Customer not found"
          }
        });
      } else {
        res.status(200).json({
          status: true,
          message: "Customer was deleted",
          data: {
            customer: {
              id: customer._id,
              name: customer.name,
              phone: customer.phone_number,
            }
          },
        });
      }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      error: {
        code: 500,
        message: error.message
      }
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    let customers = await Customer.find().select("-__v").sort({
      createdAt: -1,
    });
    if (!customers) {
      res.status(404).json({
        status: false,
        message: "Customers not found",
        error: {
          code: 404,
          message: "Customers not found"
        }
      });
    }

    res.status(200).json({
      status: true,
      message: "Customers",
      data: {
        customers: customers
      }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
      error: {
        code: 500,
        message: error.message
      }
    });
  }
};

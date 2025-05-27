const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {
  Auth
} = require("../models/authsModel");
const {
   ProductCart,
  Product_Requirment,
 checkout
} = require("../models/marketModel"); 
const { 
 market_tools,
 market_banner,
 } = require("../models/adminModel");

const {
  Business_Product,
  Business_Service,
  Quotation
} = require("../models/businessModel")


 require("dotenv").config();

	const generateOrderId = () => {
  const chars = '0123456789';
  let orderId = '';
  for (let i = 0; i < 6; i++) {
    orderId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return orderId;
};

const generateUniqueOrderId = async () => {
  let orderId;
  let exists = true;
  while (exists) {
    orderId = generateOrderId();
    exists = await checkout.findOne({ orderId });
  }
  return orderId;
};

const AllmarketplacebanneryFatch = async (req, res) => {
  try {
    const fatchbanner = await market_banner.find().sort({ _id: -1 });

    if (!fatchbanner || fatchbanner.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No banner found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Market Place Banner List",
      data: fatchbanner,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};


const getMarketProduct = async (req, res) => {
  try {
    const { categoryId} = req.body;

    if (!categoryId) {
      return res.status(400).json({ result: false, msg: "categoryId are required" });
    }
    const fetchProduct = await Business_Product.find({categoryId:categoryId}).select(
        "_id userId categoryId product_title description qty price product_image createdAt"
      ).populate({
        path: "userId",
        select: "first_name last_name address mobile"  // Sirf ye do fields chahiye
      });

    if (!fetchProduct || fetchProduct.length === 0) {
      return res.status(400).json({
        result: "false",
        msg: "No data found for type Market Product!"
      });
    }

    const response = fetchProduct.map(p => ({
          _id: p._id,
          userId: p.userId?._id || '', // handle whichever exists
          categoryId:p.categoryId || '',
          product_title: p.product_title,
          description: p.description,
          qty: p.qty,
          price: p.price,
          product_image: p.product_image,
          createdAt: p.createdAt,
          first_name: p.userId?.first_name || '',  
          last_name: p.userId?.last_name || '',  
          address: p.userId?.address || '',
          mobile: p.userId?.mobile || '',
        }));


    res.status(200).json({
      result: "true",
      msg: "Product list for type Market",
      data: response
    });

  } catch (error) {
    return res.status(500).json({
      result: "false",
      msg: "Server error",
      error: error.message
    });
  }
};

const getMarketService = async (req, res) => {
  try {
    const { categoryId} = req.body;
    
    if (!categoryId) {
      return res.status(400).json({ result: false, msg: "categoryId are required" });
    }
    const fetchService = await Business_Service.find({categoryId:categoryId}).select(
        "_id userId categoryId service_title description qty price service_image createdAt"
      ).populate({
        path: "userId",
        select: "first_name last_name address mobile"  // Sirf ye do fields chahiye
      });

    if (!fetchService || fetchService.length === 0) {
      return res.status(400).json({
        result: "false",
        msg: "No data found for type Market Service!"
      });
    }

      const response = fetchService.map(p => ({
          _id: p._id,
          userId: p.userId?._id || '', // handle whichever exists
          categoryId:p.categoryId || '',
          service_title: p.service_title,
          description: p.description,
          qty: p.qty,
          price: p.price,
          service_image: p.service_image,
          createdAt: p.createdAt,
          first_name: p.userId?.first_name || '',  
          last_name: p.userId?.last_name || '',  
          address: p.userId?.address || '',
          mobile: p.userId?.mobile || '',
        }));


    res.status(200).json({
      result: "true",
      msg: "Service list for type Market",
      data: response
    });

  } catch (error) {
    return res.status(500).json({
      result: "false",
      msg: "Server error",
      error: error.message
    });
  }
};

const Allbestbusiness = async (req, res) => {
  try {
    const fatchUser = await Auth.find({account_type:"Business"}).select(
      "first_name last_name email mobile address profile_image rating rating_count"
    ).sort({ _id: -1 });

    if (!fatchUser || fatchUser.length === 0) {
      return res.status(200).json({
        result: false,
        msg: "No User found!",
        data: [],
      });
    }

    res.status(200).json({
      result: true,
      msg: "All Best Business List",
      data: fatchUser,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Server Error!",
      error: error.message,
    });
  }
};

const getBusinessProduct = async (req, res) => {
  try {
    const { userId} = req.body;
    
    if (!userId) {
      return res.status(400).json({ result: false, msg: "userId are required" });
    }
    const fetchProduct = await Business_Product.find({userId:userId}).select(
        "_id userId categoryId product_title description qty price product_image createdAt"
      ).populate({
        path: "userId",
        select: "first_name last_name address mobile"  // Sirf ye do fields chahiye
      });

    if (!fetchProduct || fetchProduct.length === 0) {
      return res.status(400).json({
        result: "false",
        msg: "No data found for type Business Product!"
      });
    }
    const response = fetchProduct.map(p => ({
          _id: p._id,
          userId: p.userId?._id || '', // handle whichever exists
          categoryId:p.categoryId || '',
          product_title: p.product_title,
          description: p.description,
          qty: p.qty,
          price: p.price,
          product_image: p.product_image,
          createdAt: p.createdAt,
          first_name: p.userId?.first_name || '',  
          last_name: p.userId?.last_name || '',  
          address: p.userId?.address || '',
          mobile: p.userId?.mobile || '',
        }));



    res.status(200).json({
      result: "true",
      msg: "Product list for type Business",
      data: response
    });

  } catch (error) {
    return res.status(500).json({
      result: "false",
      msg: "Server error",
      error: error.message
    });
  }
};

const getBusinessService = async (req, res) => {
  try {
    const { userId} = req.body;
    
    if (!userId) {
      return res.status(400).json({ result: false, msg: "userId are required" });
    }
    const fetchService = await Business_Service.find({userId:userId}).select(
        "_id userId categoryId service_title description qty price service_image createdAt"
      ).populate({
        path: "userId",
        select: "first_name last_name address mobile"  // Sirf ye do fields chahiye
      });

    if (!fetchService || fetchService.length === 0) {
      return res.status(400).json({
        result: "false",
        msg: "No data found for type Business Service!"
      });
    }

     const response = fetchService.map(p => ({
          _id: p._id,
          userId: p.userId?._id || '', // handle whichever exists
          categoryId:p.categoryId || '',
          service_title: p.service_title,
          description: p.description,
          qty: p.qty,
          price: p.price,
          service_image: p.service_image,
          createdAt: p.createdAt,
          first_name: p.userId?.first_name || '',  
          last_name: p.userId?.last_name || '',  
          address: p.userId?.address || '',
          mobile: p.userId?.mobile || '',
        }));

    res.status(200).json({
      result: "true",
      msg: "Service list for type Business",
      data: response
    });

  } catch (error) {
    return res.status(500).json({
      result: "false",
      msg: "Server error",
      error: error.message
    });
  }
};

const AddProductRequirment = async (req, res) => {
  try {
    const { userId, requiremrnt } = req.body;

    if (!userId || !Array.isArray(requiremrnt) || requiremrnt.length === 0) {
      return res.status(400).json({
        result: false,
        msg: "Parameters required: userId and non-empty requiremrnt array",
      });
    }

    // Validate individual items (optional but recommended)
    const isValid = requiremrnt.every(item =>
      item.material_name && item.quantity && item.unit
    );

    if (!isValid) {
      return res.status(400).json({
        result: false,
        msg: "Each item in requiremrnt must have material_name, quantity, and unit",
      });
    }
    const referenceNo = Math.floor(100000 + Math.random() * 900000);
    const tendorData = new Product_Requirment({
      userId,
      reference_no:referenceNo,
      product_requirment: requiremrnt,
    });

    await tendorData.save();

    res.status(200).json({
      result: true,
      msg: "Product Requirement Added Successfully",
      data: tendorData,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error adding Product Requirement",
      error: error.message,
    });
  }
};

const GetProductRequirment = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ result: false, msg: "userId is required" });
    }

    const fetchService = await Product_Requirment.find({ userId });

    if (!fetchService || fetchService.length === 0) {
      return res.status(404).json({
        result: false,
        msg: "No product requirement data found!"
      });
    }

    const formattedRequirements = await Promise.all(
      fetchService.map(async (requirement) => {
        const quotations = await Quotation.find({ requirementId: requirement._id })
          .populate({
            path: 'userId',
            select: 'first_name last_name username profile_image'
          });

        const formattedQuotations = quotations.map(q => {
          let files = [];
          if (q.file && typeof q.file === "string") {
            files = q.file
              .split(",")
              .map(file => file.trim())
              .filter(file => file);
          }

          return {
            _id: q._id,
            requirementId: q.requirementId,
            amount: q.amount || "",
            first_name: q.userId ? q.userId.first_name : "",
            last_name: q.userId ? q.userId.last_name : "",
            profile_image: q.userId ? q.userId.profile_image : "",
            createdAt: q.createdAt,
            files: files,
          };
        });

        const formattedItems = requirement.product_requirment.map((item) => ({
          _id: item._id,
          material_name: item.material_name,
          quantity: item.quantity,
          unit: item.unit
        }));

        return {
          _id: requirement._id,
          userId: requirement.userId,
          reference_no: requirement.reference_no,
          createdAt: requirement.createdAt,
          updatedAt: requirement.updatedAt,
          quotations: formattedQuotations,
          product_requirement: formattedItems
        };
      })
    );

    return res.status(200).json({
      result: true,
      msg: "Product requirement list with quotations",
      data: formattedRequirements
    });

  } catch (error) {
    return res.status(500).json({
      result: false,
      msg: "Server error",
      error: error.message
    });
  }
};

const addToProductCart = async (req, res) => {
  try {
    const { userId, productId, product_title, quantity } = req.body;

    if (!userId || !productId || !product_title || !quantity) {
      return res.status(400).json({ result: false, msg: "userId, productId, product_title & quantity are required" });
    }

    // Product check
    const product = await Business_Product.findById(productId);
    if (!product) {
      return res.status(404).json({ result: false, msg: "Product not found" });
    }

    const price = parseFloat(product.price);
    const categoryId = product.categoryId;
    const totalPrice = (price * quantity).toFixed(2);

    // Check if user already has a cart
    let userCart = await ProductCart.findOne({ userId,booking_status:'0' });

    if (userCart) {
      // Check if product already exists in cart
      const existingProductIndex = userCart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (existingProductIndex !== -1) {
        // Update quantity and totalPrice
        userCart.products[existingProductIndex].quantity += parseInt(quantity);
        userCart.products[existingProductIndex].totalPrice = (
          userCart.products[existingProductIndex].quantity * price
        ).toFixed(2);
      } else {
        // Add new product to products array
        userCart.products.push({
          productId,
          categoryId,
          product_title,
          quantity,
          price,
          totalPrice,
        });
      }

      await userCart.save();
    } else {
      // Create new cart
      userCart = await ProductCart.create({
        userId,
        products: [
          {
            productId,
            categoryId,
            product_title,
            quantity,
            price,
            totalPrice,
          },
        ],
        booking_status: '0',
      });
    }

    res.status(200).json({
      result: true,
      msg: "Product added/updated in cart successfully",
      data: userCart,
    });
  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Something went wrong",
      error: error.message,
    });
  }
};

const getToProductCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ result: false, msg: "userId is required" });
    }

    // Get active cart for the user
    const cart = await ProductCart.findOne({ userId: userId, booking_status: '0' }).populate({
      path: "products.productId",
      select: "product_title product_image"
    });

    if (!cart) {
      return res.status(400).json({
        result: false,
        msg: "No data found for product cart!"
      });
    }

    let totalPriceAmmount = 0;

    // Map products and include userId and cartId in each
    const data = cart.products.map((item) => {
      totalPriceAmmount += item.totalPrice || 0;

      return {
        cartId: cart._id,
        userId: cart.userId,
        categoryId: item.categoryId,
        productId: item.productId?._id,
        product_title: item.productId?.product_title || "",
        product_image: item.productId?.product_image || "",
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice
      };
    });

    res.status(200).json({
      result: true,
      msg: "Product cart list fetched successfully",
      totalPriceAmmount,
      data
    });

  } catch (error) {
    return res.status(500).json({
      result: false,
      msg: "Server error",
      error: error.message
    });
  }
};

//create cart data delete api 
const deleteToProductCart = async (req, res) => {
    try {
        const { userId,cartId, productId } = req.body;

        if (userId && cartId &&  productId) {
            // Remove the dish from the products array
            const result = await ProductCart.updateOne(
                { _id:cartId,userId: userId, booking_status:'0' },
                { $pull: { products: { productId: productId } } }
            );

            if (result.modifiedCount > 0) {
                // Check if the products array is now empty
                const cart = await ProductCart.findOne({ _id:cartId, userId: userId, booking_status:'0' });

                if (cart && cart.products.length === 0) {
                    // If no products remain, delete the cart
                    await ProductCart.deleteOne({ _id:cartId, userId: userId, booking_status:'0' });
                    return res.status(200).json({
                        result: 'true',
                        msg: 'Cart deleted successfully as it is now empty.',
                    });
                }

                // If the cart still has products
                return res.status(200).json({
                    result: 'true',
                    msg: 'Cart dish deleted successfully.',
                });
            } else {
                return res.status(400).json({
                    result: 'false',
                    msg: 'Product not found in cart.',
                });
            }
        } else {
            return res.status(400).json({
                result: 'false',
                msg: 'Parameters required: userId,cartId & productId.',
            });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            result: 'false',
            msg: 'Internal Server Error',
        });
    }
};

// create update to cart api
const Update_To_Cart = async (req, res) => {
    try {
        const { cartId, productId, quantity, price, cart_status } = req.body;

        if (cartId && productId && quantity  && price && cart_status) {

            const result = await ProductCart.findOne({ _id: cartId,booking_status:'0' });

            if (!result) {
                res.status(400).json({
                    result: 'false',
                    msg: 'record not found..'
                });
            } else {
               const productIndex = result.products.findIndex(product => product.productId == productId );

                if (productIndex == -1) {
                    // Product doesn't exist in the array, so add it.
                    result.products.push({
                        productId, 
                        quantity,
                        price,
                        totalPrice: quantity * price,
                        cart_status:'1',
                    });
                } else {
                    // Product already exists, so update it.
                    const existingProduct = result.products[productIndex];
                    if (cart_status == '1') {
                        // Add more quantity to the existing product.
                        existingProduct.quantity += parseInt(quantity);
                    } else {
                        // Remove quantity from the existing product.
                        existingProduct.quantity -= parseInt(quantity);
                        if (existingProduct.quantity < 0) {
                            existingProduct.quantity = 0;
                        }
                    }
                    existingProduct.totalPrice = existingProduct.quantity * price;
                }

                const user_data = await ProductCart.findOneAndUpdate(
                    { _id: cartId },
                    { $set: { products: result.products } },
                    { new: true }
                );

                res.status(200).json({
                    result: 'true',
                    msg: `Cart product ${cart_status === '1' ? 'added' : 'removed'} successfully..`,
                    data: user_data
                });
            }
        } else {
            res.status(400).json({
                result: 'false',
                msg: 'Parameters required: cartId, productId, quantity, price, and cart_status (add = 1, remove = 0).'
            });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const CheckToCartmarket = async (req, res) => {
  try {
    const {
      userId,
      productId,
      transactionId,
      product_title,
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      zip_code,
      quantity = 1
    } = req.body;

    if (!userId || !productId || !transactionId) {
      return res.status(400).json({
        result: false,
        msg: "userId and productId, product_title, transactionId are required optional ( first_name,last_name,email,phone,address,city,zip_code)"
      });
    }

    const product = await Business_Product.findById(productId);
    if (!product) {
      return res.status(404).json({ result: false, msg: "Product not found" });
    }

    const qty = parseInt(quantity); 
    const rate = parseFloat(product.price); 
    const totalPrice = (rate * qty).toFixed(2);
   const orderId = await generateUniqueOrderId();
    const cartItem = await checkout.create({
      userId,
      orderId, 
      productId,
      transactionId,
      product_title,
      first_name,
      last_name,
      email,
      phone,
      address,
      city,
      zip_code,
      quantity: qty,
      rate,
      totalPrice,
      cart_status: "pending"
    });

    res.status(200).json({
      result: true,
      msg: "New order added successfully",
      data: cartItem
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Something went wrong",
      error: error.message
    });
  }
};


const GetCheckoutOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ result: false, msg: "userId is required" });
    }

    const fetchorder = await checkout
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "productId",
        select: "product_image", 
        model: "business_product"
      });

    if (!fetchorder || fetchorder.length === 0) {
      return res.status(400).json({
        result: false,
        msg: "No order product!"
      });
    }

						const resultData = fetchorder.map(order => ({
						_id: order._id,
						product_image: order.productId?.product_image || null,
						userId: order.userId,
						orderId: order.orderId,
						product_title: order.product_title,
						first_name: order.first_name,
						last_name: order.last_name || "",
						email: order.email,
						phone: order.phone,
						address: order.address,
						cart_status: order.cart_status,
						quantity: order.quantity,
						rate: order.rate,
						totalPrice: order.totalPrice,
						createdAt: order.createdAt
				}));

    res.status(200).json({
      result: true,
      msg: "Product order list fetched successfully",
      data: resultData
    });

  } catch (error) {
    return res.status(500).json({
      result: false,
      msg: "Server error",
      error: error.message
    });
  }
};



const GetCheckoutOrderDetails = async (req, res) => {
  const { cartId } = req.body;
  if (!cartId) {
    return res.status(400).json({ result: false, msg: "cartId is required" });
  }

  try {
    const order = await checkout
      .findById(cartId)
      .populate({
        path: "userId",
        model: "users",
        select: "first_name last_name email phone username address account_type banner_image profile_image"
      })
      .populate({
        path: "productId",
        model: "business_product",
        select: "product_title description product_image price userId",
        populate: {
          path: "userId", 
          model: "users",
          select: "first_name last_name email phone username address profile_image"
        }
      });

    if (!order) {
      return res.status(404).json({
        result: false,
        msg: "No order product details found!"
      });
    }

    const orderObj = order.toObject();

    const responseData = {
									cart_id: orderObj._id,
									orderId: orderObj.orderId || "",
									product_title: orderObj.product_title || "",
									quantity: orderObj.quantity || 0,
									rate: orderObj.rate || 0,
									totalPrice: orderObj.totalPrice || 0,
									cart_status: orderObj.cart_status || "",
									createdAt: orderObj.createdAt || "",

									userDetails: {
											_id: orderObj.userId?._id || "",
											first_name: orderObj.userId?.first_name || "",
											last_name: orderObj.userId?.last_name || "",
											email: orderObj.userId?.email || "",
											phone: orderObj.userId?.phone || "", 
											username: orderObj.userId?.username || "",
											address: orderObj.userId?.address || "",
											account_type: orderObj.userId?.account_type || "",
											banner_image: orderObj.userId?.banner_image || "",
											profile_image: orderObj.userId?.profile_image || ""
									},

									productDetails: {
											product_title: orderObj.productId?.product_title || "",
											description: orderObj.productId?.description || "",
											product_image: orderObj.productId?.product_image || "",
											price: orderObj.productId?.price || 0,
									},

									billingInformation: {
											transactionId: orderObj.transactionId || "",
											first_name: orderObj.first_name || "",
											last_name: orderObj.last_name || "",
											email: orderObj.email || "",
											phone: orderObj.phone || "",
											address: orderObj.address || "",
											quantity: orderObj.quantity || "",
											cart_status: orderObj.cart_status || "",
											rate: orderObj.rate || "",
											totalPrice: orderObj.totalPrice || 0,
									},

									vendorDetails: orderObj.productId?.userId || {}
							};


    res.status(200).json({
      result: true,
      msg: "Product order details fetched successfully",
      data: responseData
    });

  } catch (error) {
    return res.status(500).json({
      result: false,
      msg: "Server error",
      error: error.message
    });
  }
};


const addserviceRequiest = async (req, res) => {
    const { userId, service_id, time_period } = req.body;

    if (!userId || !service_id || !time_period) {
        return res.status(400).json({
            status: false,
            message: 'userId, service_id, and time_period are required'
        });
    }

    try {
        const newRequest = new requiest({
            userId,
            service_id,
            time_period
        });

        const savedRequest = await newRequest.save();

        return res.status(200).json({
            status: true,
            message: 'Service request added successfully',
            data: savedRequest
        });
    } catch (err) {
        console.error('MongoDB Error:', err);
        return res.status(500).json({
            status: false,
            message: 'Failed to add service request'
        });
    }
};


module.exports = {
     AllmarketplacebanneryFatch,
     getMarketProduct,
     getMarketService,
     Allbestbusiness,
     getBusinessProduct,
     getBusinessService,
     AddProductRequirment,
     GetProductRequirment,
     addToProductCart,
     getToProductCart,
     deleteToProductCart,
     Update_To_Cart,
     CheckToCartmarket,
     GetCheckoutOrder,
     GetCheckoutOrderDetails,
     addserviceRequiest 	  
};

const axios = require("axios");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");  
const crypto = require('crypto');

const {
	Auth,
	Blacklist
} = require("../models/authsModel");
const {
	freeFourtFolio,
	Bid,
	Apply,
	Apply_Project,
	Job_Favorite,
	Project_Favorite,
	Transaction_Report
} = require("../models/freelancerModel");

const {
	Project,
	Job
} = require("../models/companyModel");

const {
	Cate_job,
	Terms,
	Privacy,
	FAQ,
	freelancerbanner,
        marketcate,
        servicecate,
        BussinessBanner,
        BusinessHeadline,
        BusinessBenefit
} = require("../models/adminModel");

const {
	Business_Product,
        Business_Service,
       Quotation
} = require("../models/businessModel");

const {
   ProductCart,
   Product_Requirment,
   checkout
} = require("../models/marketModel");

const BusinessgetProfile = async (req, res) => {
	try {
		const { userId } = req.body;

		if (!userId) {
			return res.status(400).json({
				result: false,
				msg: "Parameter required: userId",
			});
		}

		const business = await Auth.findById(userId).select(
			"first_name last_name email mobile profile_image username total_project_comppleted rating experience resume_file skills education language emplement_history description verify_profile address latitude longitude links erning total_application block_status wallet_ammount links"
		);

		if (!business) {
			return res.status(404).json({
				result: false,
				msg: "Business Detail not found",
			});
		}

		const portfolio = await freeFourtFolio.find({ userId: userId }).select("name image userId about_project");

		const updatedPortfolio = portfolio.map((item) => {
			let imageArray = [];

			if (item.image && typeof item.image === "string") {
				imageArray = item.image.split(",").map((img) => img.trim()).filter(Boolean);
			}

			return {
				...item._doc,
				image: imageArray,
			};
		});

		const profileFields = {
			first_name: business.first_name,
			last_name: business.last_name,
			email: business.email,
			mobile: business.mobile,
			profile_image: business.profile_image,
			resume_file: business.resume_file,
			username: business.username,
			rating: business.rating,
			total_application: business.total_application,
			erning: business.erning,
			address: business.address,
			latitude: business.latitude,
			longitude: business.longitude,
			description: business.description,
			verify_profile: business.verify_profile,
			experience: business.experience,
			total_project_comppleted: business.total_project_comppleted,
			block_status: business.block_status,
			links: business.links?.length > 0 ? business.links : null,
			skills: business.skills?.length > 0 ? business.skills : null,
			education: business.education?.length > 0 ? business.education : null,
			language: business.language?.length > 0 ? business.language : null,
			emplement_history: business.emplement_history?.length > 0 ? business.emplement_history : null,
                        wallet_ammount:business.wallet_ammount || 0,
                        links:business.links || []
		};

		const totalFields = Object.keys(profileFields).length;

		const filledFields = Object.values(profileFields).filter(
			(value) => value !== undefined && value !== null && value !== "").length;

		const profilePercentage = Math.round((filledFields / totalFields) * 100);

		return res.status(200).json({
			result: true,
			msg: "Freelancer Details fetched successfully",
			data: {
				profile_percentage: profilePercentage + "%",
				userId: business._id || "",
				first_name: business.first_name || "",
				last_name: business.last_name || "",
				email: business.email || "",
				mobile: business.mobile || "",
				profile_image: business.profile_image || "",
				username: business.username || "",
				rating: business.rating || "0",
				address: business.address || "",
				erning: business.erning || "0",
				lat: business.latitude || "",
				long: business.longitude || "",
				description: business.description || "",
				verify_profile: business.verify_profile || false,
				experience: business.experience || "",
				block_status: business.block_status || 0,
				wallet_ammount:business.wallet_ammount || 0, 
                                total_orders:business.total_orders || 0,
				pending_orders:business.pending_orders || 0,
				completed_orders:business.completed_orders || 0,
                                links:business.links || []
			},
		});

	} catch (error) {
		res.status(500).json({
			result: false,
			msg: "Something went wrong",
			error: error.message,
		});
	}
};

const addbusinessTransaction = async (req, res) => {
	try {
		const { userId, title, ammount, type, transaction_status } = req.body;

		if (!userId || !title || !ammount || !type || !transaction_status) {
			return res.status(400).json({ result: false, msg: "userId, title, ammount, type(Credit,Debit), transaction_status are required" });
		}

		const userData = await Auth.findById({ _id:userId });

		if (!userData) {
			return res.status(404).json({
				result: false,
				msg: "userId not found",
			});
		}

		const newData = new Transaction_Report({
			userId, title, ammount, type, transaction_status
		});

		await newData.save();
		const WalletAmmount = userData.wallet_ammount || 0;
        let totalAmmount;

        if (type.toLowerCase() === "credit" && transaction_status.toLowerCase() === "success") {
             totalAmmount = WalletAmmount + ammount;
        } else if (type.toLowerCase() === "debit" && transaction_status.toLowerCase() === "success") {
            if (WalletAmmount < ammount) {
                return res.status(400).json({
                    result: false,
                    msg: "Insufficient wallet balance for debit"
                });
            }
            totalAmmount = WalletAmmount - ammount;
        } else {
            return res.status(400).json({
                result: false,
                msg: "Invalid transaction type. Must be Credit or Debit"
            });
        }

        await Auth.findByIdAndUpdate(userId, { wallet_ammount: totalAmmount }, { new: true });
		return res.status(200).json({
			result: true,
			msg: "freelancer transaction report added successfully",
			data: newData
		});

	} catch (error) {
		return res.status(500).json({
			result: false,
			msg: "Something went wrong",
			error: error.message
		});
	}
}; 


const getbusinessTransaction = async (req, res) => {
	try {
		const { userId } = req.body;

		if (!userId) {
			return res.status(404).json({ 
				result: false,
				msg: "Required parameters: userId",
			});
		}

		const projects = await Transaction_Report.find({userId:userId})
			.sort({ createdAt: -1 })
			.select(
				"_id userId title ammount type transaction_status createdAt"
			).populate({
				path: "userId",
				select: "wallet_ammount"  // Sirf ye do fields chahiye
			});

		if (!projects || projects.length === 0) {
			return res.status(404).json({
				result: false,
				msg: "No jobs found",
			});
		}else{
			const response = projects.map(p => ({
			    _id: p._id,
			    userId: p.userId?._id || '', // handle whichever exists
			    title: p.title,
			    ammount: p.ammount,
			    type: p.type,
			    fileattach_apply: p.fileattach_apply,
			    transaction_status:p.transaction_status,
			    createdAt: p.createdAt,
			    wallet_ammount: p.userId?.wallet_ammount || 0,
		    }));

		    return res.status(200).json({
			    result: true,
			    msg: "transaction report list fetched successfully",
			    data: response,
		    });
		}

	} catch (error) {
		console.error("Error fetching job list:", error.message);
		res.status(500).json({
			result: false,
			msg: "Something went wrong",
			error: error.message,
		});
	}
};

const getTermsconditionBusiness = async (req, res) => {
	try {
		const fetchTerms = await Terms.find({ type: "Business" });

		if (!fetchTerms || fetchTerms.length === 0) {
			return res.status(400).json({
				result: "false",
				msg: "No data found for type Business!"
			});
		}

		res.status(200).json({
			result: "true",
			msg: "Terms and Conditions list for type Business",
			data: fetchTerms
		});

	} catch (error) {
		return res.status(500).json({
			result: "false",
			msg: "Server error",
			error: error.message
		});
	}
};


const getprivacyBusiness = async (req, res) => {
	try {
		const fetchprivacy = await Privacy.find({ type: "Freelancer" });

		if (!fetchprivacy || fetchprivacy.length === 0) {
			return res.status(400).json({
				result: "false",
				msg: "No data found for type Business!"
			});
		}

		res.status(200).json({
			result: "true",
			msg: "Privacy Policy list for type Business",
			data: fetchprivacy
		});

	} catch (error) {
		return res.status(500).json({
			result: "false",
			msg: "Server error",
			error: error.message
		});
	}
};

const getfaqBusiness = async (req, res) => {
	try {
		const fetchfaq = await FAQ.find({ type: "Freelancer" });

		if (!fetchfaq || fetchfaq.length === 0) {
			return res.status(400).json({
				result: "false",
				msg: "No data found for type Business!"
			});
		}

		res.status(200).json({
			result: "true",
			msg: "FAQ list for type Business",
			data: fetchfaq
		});

	} catch (error) {
		return res.status(500).json({
			result: "false",
			msg: "Server error",
			error: error.message
		});
	}
};


const businessHeaderUpdate = async (req, res) => {
  try {
    const { userID, first_name, last_name, links, address, latitude, longitude} = req.body;

    const profile_image = req.files?.profile_image ? req.files.profile_image[0].filename : null;

    if (!userID) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: userID (optional: first_name, last_name, links, profile_image, address, latitude, longitude)",
      });
    }

    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid userID format",
      });
    }

    const user = await Auth.findById(userID);
    if (!user) {
      return res.status(404).json({
        result: false,
        msg: "User not found",
      });
    }

    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (address) user.address = address;
    if (latitude) user.latitude = latitude;
    if (longitude) user.longitude = longitude;
    if (profile_image) user.profile_image = profile_image;

    if (links) {
      try {
        let parsedLinks = JSON.parse(links);
        if (Array.isArray(parsedLinks)) {
          user.links = parsedLinks.map(link => ({
            type: link.type.trim(),
            url: link.url.trim(),
          }));
        } else {
          return res.status(400).json({
            result: false,
            msg: "Links should be an array of objects [{type, url}]",
          });
        }
      } catch (error) {
        return res.status(400).json({
          result: false,
          msg: "Invalid links format, must be a valid JSON array",
        });
      }
    }

    await user.save();


    const responseUser = user.toObject();
    responseUser.links = responseUser.links.map(({ type, url }) => ({ type, url }));

    res.status(200).json({
      result: true,
      msg: "Business Header Updated Successfully",
      data: responseUser,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating business header",
      error: error.message,
    });
  }
};

const businessDescriptionUpdate = async (req, res) => {
  try {
    const { userID, description } = req.body;

    if (!userID) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: userID (optional: description )",
      });
    }

    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid userID format",
      });
    }

    const user = await Auth.findById(userID);
    if (!user) {
      return res.status(404).json({
        result: false,
        msg: "User not found",
      });
    }

    if (description) user.description = description;
    await user.save();

    res.status(200).json({
      result: true,
      msg: "Business Description Updated Successfully",
      data: user,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating business description",
      error: error.message,
    });
  }
};

const businessContactinformationrUpdate = async (req, res) => {
  try {
    const { userID, email, mobile } = req.body;

    if (!userID) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: userID (optional: email, mobile )",
      });
    }

    if (!mongoose.isValidObjectId(userID)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid userID format",
      });
    }

    const user = await Auth.findById(userID);
    if (!user) {
      return res.status(404).json({
        result: false,
        msg: "User not found",
      });
    }

    if (email) user.email = email;
    if (mobile) user.mobile = mobile;

    await user.save();

    const responseUser = user.toObject();
    res.status(200).json({
      result: true,
      msg: "Business Information Updated Successfully",
      data: responseUser,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating business information",
      error: error.message,
    });
  }
};

const AllproductcategoryFatch = async (req, res) => {
	try {
		const fatchcate = await marketcate.find().sort({ _id: -1 });

		if (!fatchcate || fatchcate.length === 0) {
			return res.status(200).json({
				result: false,
				msg: "No product categories found!",
				data: [],
			});
		}

		res.status(200).json({
			result: true,
			msg: "All Product Category List",
			data: fatchcate,
		});

	} catch (error) {
		res.status(500).json({
			result: false,
			msg: "Server Error!",
			error: error.message,
		});
	}
};

const addBusinessProduct = async (req, res) => {
	try {
		const { userId, categoryId,product_title, description, qty, price } = req.body;
		const product_image = req.files ? req.files.map(file => file.filename).join(",") : null;
		if (!userId || !categoryId || !product_title || !description || !qty || !price || !product_image) {
			return res.status(400).json({ result: false, msg: "userId, categoryId, product_title, description, qty, price, product_image are required" });
		}

		const newData = new Business_Product({
			userId,
                        categoryId,
			product_title, 
			description, 
			qty, 
			price,
			product_image
		});

		await newData.save();

		return res.status(200).json({
			result: true,
			msg: "business product added successfully",
			data: newData
		});

	} catch (error) {
		return res.status(500).json({
			result: false,
			msg: "Something went wrong",
			error: error.message
		});
	}
};

const getBusinessProduct = async (req, res) => {
	try {
		const { userId} = req.body;
		if (!userId) {
			return res.status(400).json({ result: false, msg: "userId are required" });
		}
		const fetchProduct = await Business_Product.find({userId:userId});

		if (!fetchProduct || fetchProduct.length === 0) {
			return res.status(400).json({
				result: "false",
				msg: "No data found for type Business Product!"
			});
		}

		res.status(200).json({
			result: "true",
			msg: "Product list for type Business",
			data: fetchProduct
		});

	} catch (error) {
		return res.status(500).json({
			result: "false",
			msg: "Server error",
			error: error.message
		});
	}
};

const BusinessProductDelete = async (req, res) => {
	try {
		const { productId } = req.body;

		if (!productId) {
			return res.status(400).json({
				result: false,
				msg: "Parameter required: productId",
			});
		}

		const fatchbusinessproduct = await Business_Product.findById(productId);
		if (!fatchbusinessproduct) {
			return res.status(404).json({
				result: false,
				msg: "Business Product Not Found!",
			});
		}

		await Business_Product.findByIdAndDelete(productId);

		res.status(200).json({
			result: true,
			msg: "Business Product Deleted Successfully",
		});

	} catch (error) {
		res.status(500).json({
			result: false,
			msg: "Error deleting business product",
			error: error.message,
		});
	}
};

const updateBusinessProduct = async (req, res) => {
  try {
    const { productId, product_title, description, qty, price} = req.body;

    const product_image = req.files ? req.files.map(file => file.filename).join(",") : null;

    if (!productId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: productId (optional: product_title, description, qty, price, product_image)",
      });
    }

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid productId format",
      });
    }

    const product = await Business_Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        result: false,
        msg: "Product not found",
      });
    }

    if (product_title) product.product_title = product_title;
    if (description) product.description = description;
    if (qty) product.qty = qty;
    if (price) product.price = price;
    if (product_image) product.product_image = product_image;

    await product.save();
    const responseProduct = product.toObject();

    res.status(200).json({
      result: true,
      msg: "Business Product Updated Successfully",
      data: responseProduct,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating business product",
      error: error.message,
    });
  }
};

const BusinessProductDetails = async (req, res) => {
	try {
		const { productId } = req.body;

		if (!productId) {
			return res.status(400).json({
				result: false,
				msg: "Parameter required: productId",
			});
		}

		const product = await Business_Product.findById(productId).select(
			"productId userId product_title description qty price product_image"
		);

		if (!product) {
			return res.status(404).json({
				result: false,
				msg: "Product Detail not found",
			});
		}else{

		    return res.status(200).json({
			result: true,
			msg: "Product Details fetched successfully",
			data: {
				productId: product._id || '',
				userId: product.userId || "",
				product_title: product.product_title || "",
				description: product.description || "",
				qty: product.qty || "",
				price: product.price || 0,
				product_image: product.product_image || "",
			},
		    });
	    }

	} catch (error) {
		res.status(500).json({
			result: false,
			msg: "Something went wrong",
			error: error.message,
		});
	} 
};

const AllservicecategoryFatch = async (req, res) => {
	try {
		const fatchcate = await servicecate.find().sort({ _id: -1 });

		if (!fatchcate || fatchcate.length === 0) {
			return res.status(200).json({
				result: false,
				msg: "No service categories found!",
				data: [],
			});
		}

		res.status(200).json({
			result: true,
			msg: "All Service Category List",
			data: fatchcate,
		});

	} catch (error) {
		res.status(500).json({
			result: false,
			msg: "Server Error!",
			error: error.message,
		});
	}
};


const addBusinessService = async (req, res) => {
	try {
		const { userId, categoryId,service_title, description, qty, price } = req.body;
		const service_image = req.files ? req.files.map(file => file.filename).join(",") : null;
		if (!userId || !categoryId || !service_title || !description || !qty || !price || !service_image) {
			return res.status(400).json({ result: false, msg: "userId, categoryId, service_title, description, qty, price, service_image are required" });
		}

		const newData = new Business_Service({
			userId,
                        categoryId,
			service_title, 
			description, 
			qty, 
			price,
			service_image
		});

		await newData.save();

		return res.status(200).json({
			result: true,
			msg: "business service added successfully",
			data: newData
		});

	} catch (error) {
		return res.status(500).json({
			result: false,
			msg: "Something went wrong",
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
		const fetchService = await Business_Service.find({userId:userId});

		if (!fetchService || fetchService.length === 0) {
			return res.status(400).json({
				result: "false",
				msg: "No data found for type Business Service!"
			});
		}

		res.status(200).json({
			result: "true",
			msg: "Service list for type Business",
			data: fetchService
		});

	} catch (error) {
		return res.status(500).json({
			result: "false",
			msg: "Server error",
			error: error.message
		});
	}
};

const BusinessServiceDelete = async (req, res) => {
	try {
		const { serviceId } = req.body;

		if (!serviceId) {
			return res.status(400).json({
				result: false,
				msg: "Parameter required: serviceId",
			});
		}

		const fatchbusinessservice = await Business_Service.findById(serviceId);
		if (!fatchbusinessservice) {
			return res.status(404).json({
				result: false,
				msg: "Business Service Not Found!",
			});
		}

		await Business_Service.findByIdAndDelete(serviceId);

		res.status(200).json({
			result: true,
			msg: "Business Service Deleted Successfully",
		});

	} catch (error) {
		res.status(500).json({
			result: false,
			msg: "Error deleting business service",
			error: error.message,
		});
	}
};


const updateBusinessService = async (req, res) => {
  try {
    const { serviceId, service_title, description, qty, price} = req.body;

    const service_image = req.files ? req.files.map(file => file.filename).join(",") : null;

    if (!serviceId) {
      return res.status(400).json({
        result: false,
        msg: "Parameter required: serviceId (optional: service_title, description, qty, price, service_image)",
      });
    }

    if (!mongoose.isValidObjectId(serviceId)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid serviceId format",
      });
    }

    const service = await Business_Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        result: false,
        msg: "Service not found",
      });
    }

    if (service_title) service.service_title = service_title;
    if (description) service.description = description;
    if (qty) service.qty = qty;
    if (price) service.price = price;
    if (service_image) service.service_image = service_image;

    await service.save();
    const responseService = service.toObject();

    res.status(200).json({
      result: true,
      msg: "Business Service Updated Successfully",
      data: responseService,
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error updating business service",
      error: error.message,
    });
  }
};


const BusinessServiceDetails = async (req, res) => {
	try {
		const { serviceId } = req.body;

		if (!serviceId) {
			return res.status(400).json({
				result: false,
				msg: "Parameter required: serviceId",
			});
		}

		const service = await Business_Service.findById(serviceId).select(
			"serviceId userId service_title description qty price service_image"
		);

		if (!service) {
			return res.status(404).json({
				result: false,
				msg: "Service Detail not found",
			});
		}else{

		    return res.status(200).json({
			result: true,
			msg: "Service Details fetched successfully",
			data: {
				serviceId: service._id || '',
				userId: service.userId || "",
				service_title: service.service_title || "",
				description: service.description || "",
				qty: service.qty || "",
				price: service.price || 0,
				service_image: service.service_image || "",
			},
		    });
	    }

	} catch (error) {
		res.status(500).json({
			result: false,
			msg: "Something went wrong",
			error: error.message,
		});
	} 
};

const GetProductRequirment = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        result: "false",
        msg: "userId is required",
      });
    }

    const fetchService = await Product_Requirment.find({ userId }).sort({ createdAt: -1 });

    if (!fetchService || fetchService.length === 0) {
      return res.status(404).json({
        result: "false",
        msg: "No product requirement data found for this user",
      });
    }

    res.status(200).json({
      result: "true",
      msg: "Product requirement list fetched successfully",
      data: fetchService,
    });

  } catch (error) {
    return res.status(500).json({
      result: "false",
      msg: "Server error",
      error: error.message,
    });
  }
};


const GetProductRequirmentAll= async (req, res) => {
  try {
    const fetchService = await Product_Requirment
      .find()
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        model: "users",
        select: "first_name last_name address"
      });

    if (!fetchService || fetchService.length === 0) {
      return res.status(400).json({
        result: false,
        msg: "No data found for product requirement!"
      });
    }

    const formattedData = fetchService.map(item => ({
      ...item.toObject(),
      userId: item.userId?._id || null, 
      userDetails: item.userId || {}    
    }));

    res.status(200).json({
      result: true,
      msg: "Get product requirement list",
      data: formattedData
    });

  } catch (error) {
    return res.status(500).json({
      result: false,
      msg: "Server error",
      error: error.message
    });
  }
};




const GetCheckoutOrderPending = async (req, res) => {
try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ result: false, msg: "userId is required" });
    }

    const fetchorder = await checkout
      .find({ userId: userId, cart_status: "pending" })
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
      msg: "Product order Pending fetched successfully",
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


const marketOrderAcceptreject = async (req, res) => {
  try {
    const { cartId, userId, productId, cart_status } = req.body;

    if (!userId || !cartId || !productId || !cart_status) {
      return res.status(400).json({
        result: false,
        msg: "Parameters required: userId, cartId, productId, cart_status (accept / reject)",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid userId format",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        result: false,
        msg: "Invalid productId format",
      });
    }

    const user = await Auth.findById(userId);
    if (!user) {
      return res.status(404).json({
        result: false,
        msg: "User not found",
      });
    }

    const productRequirement = await checkout.findById({_id: cartId });
    if (!productRequirement) {
      return res.status(404).json({
        result: false,
        msg: "Cart Item not found",
      });
    }

    productRequirement.cart_status = cart_status;
    await productRequirement.save();

    res.status(200).json({
      result: true,
      msg: "Market Order status changed successfully",
      data: {
        user: {
          _id: user._id,
          name: `${user.first_name || ""} ${user.last_name || ""}`,
          email: user.email || "",
          phone: user.phone || "",
        },
        product: productRequirement,
      },
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      msg: "Error changing Market Order status",
      error: error.message,
    });
  }
};

const GetCheckoutOrderaccept = async (req, res) => {
		try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ result: false, msg: "userId is required" });
    }

    const fetchorder = await checkout
      .find({ userId: userId, cart_status: "accept" })
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
      msg: "Product order Accept fetched successfully",
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


const GetCheckoutOrderreject = async (req, res) => {
		try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ result: false, msg: "userId is required" });
    }

    const fetchorder = await checkout
      .find({ userId: userId, cart_status: "reject" })
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
      msg: "Product order Reject fetched successfully",
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

const addbussinessQuotation = async (req, res) => {
		try {
				const { userId, requirementId, amount} = req.body;
				const file = req.files ? req.files.map(file => file.filename).join(",") : null;
				if (!userId || !requirementId || !amount) {
						return res.status(400).json({ result: false, msg: "userId, requirementId, amount, file are required" });
				}

				const newData = new Quotation({
					userId,
					requirementId,
					amount,
					file,
			});
			

				await newData.save();

				return res.status(200).json({
						result: true,
						msg: "Quotation added successfully",
						data: newData
				});

		} catch (error) {
				return res.status(500).json({
						result: false,
						msg: "Something went wrong",
						error: error.message
				});
		}
};

const GetBusinessBanner = async (req, res) => {
	try {
		const fatchbanner = await BussinessBanner.find().sort({ _id: -1 });

		if (!fatchbanner || fatchbanner.length === 0) {
			return res.status(200).json({
				result: false,
				msg: "No banner found!",
				data: [],
			});
		}

		res.status(200).json({
			result: true,
			msg: "All Business Banner List",
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

const getBusinessHeadline = async (req, res) => {
	try {
		const fatchheadline = await BusinessHeadline.find().sort({ _id: -1 });

		if (!fatchheadline || fatchheadline.length === 0) {
			return res.status(200).json({
				result: false,
				msg: "No business headline found!",
				data: [],
			});
		}

		res.status(200).json({
			result: true,
			msg: "All Business Headline List",
			data: fatchheadline,
		});

	} catch (error) {
		res.status(500).json({
			result: false,
			msg: "Server Error!",
			error: error.message,
		});
	}
};


const getBusinessBenefit = async (req, res) => {
	try {
		const fatchBenefit = await BusinessBenefit.find().sort({ _id: -1 });

		if (!fatchBenefit || fatchBenefit.length === 0) {
			return res.status(200).json({
				result: false,
				msg: "No Business Benefit found!",
				data: [],
			});
		}

		res.status(200).json({
			result: true,
			msg: "All Business Benefit List",
			data: fatchBenefit,
		});

	} catch (error) {
		res.status(500).json({
			result: false,
			msg: "Server Error!",
			error: error.message,
		});
	}
};

module.exports = {
	BusinessgetProfile,
        addbusinessTransaction,
	getbusinessTransaction,
        getTermsconditionBusiness,
	getprivacyBusiness,
	getfaqBusiness,
        businessHeaderUpdate,
        businessDescriptionUpdate,
        businessContactinformationrUpdate,
        AllproductcategoryFatch,
        addBusinessProduct,
        getBusinessProduct,
        BusinessProductDelete,
        updateBusinessProduct,
        BusinessProductDetails,
        AllservicecategoryFatch,
        addBusinessService,
	getBusinessService,
        BusinessServiceDelete,
	updateBusinessService,
	BusinessServiceDetails,
        GetProductRequirment,
	GetProductRequirmentAll,
       	marketOrderAcceptreject,
	GetCheckoutOrderPending,
	GetCheckoutOrderaccept,
	GetCheckoutOrderreject,
	addbussinessQuotation,
        GetBusinessBanner,
        getBusinessHeadline,
        getBusinessBenefit
}

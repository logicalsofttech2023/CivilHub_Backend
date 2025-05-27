const mongoose = require("mongoose");

const ProductCartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  products: [
    {
      categoryId:{
          type:mongoose.Schema.Types.ObjectId,
          required:true,
          ref: 'market_categories', 
        },
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'business_product',
        required: true,
      },
      product_title: { type: String, required: false },
      quantity: { type: Number, default: 1 },
      price: { type: Number, required: true }, 
      totalPrice: { type: Number },
      cart_status:{
        type:String,
        required: false,
        default:0
      },   
      },
  ],
  booking_status:{
    type:String,
    required: true,
    default:0
  },  
}, { timestamps: true });


const productRequirmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  reference_no: { type: String },
  product_requirment: [{
        material_name: {
            type: String, 
            required: false,
        },
        quantity: {
            type: Number, 
            required: false,
        },
        unit: {
             type: String, 
            required: false,
        },
    }],
},  { timestamps: true });


const cartSchemacheckout = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
		required: true,
	},
	orderId: {
  type: String,
  required: true,
  unique: true
},
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "business_product",
		required: true,
	},
	transactionId: { type: String },
	product_title: { type: String, required: true },
	first_name: { type: String },
	last_name: { type: String },
	email: { type: String },
	phone: { type: String },
	address: { type: String },
	city: { type: String },
	zip_code: { type: String },
	quantity: { type: Number, default: 1 },
	cart_status: { type: String, default: "pending" },
	rate: { type: String },
	totalPrice: { type: String },
	createdAt: { type: Date, default: Date.now },
});

const serviceRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
									ref: "users",
									required: true
    },
    service_id: {
        	type: mongoose.Schema.Types.ObjectId,
									ref: "service_products",
									required: true
    },
    time_period: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const ProductCart = mongoose.model("product_cart", ProductCartSchema);
const Product_Requirment = mongoose.model("product_requirment", productRequirmentSchema);
const checkout = mongoose.model("checkout_market_cart", cartSchemacheckout);
const requiest = mongoose.model("add_service_request", serviceRequestSchema);
module.exports = {
 ProductCart,
 Product_Requirment,
 checkout,
requiest  
};

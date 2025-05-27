const mongoose = require('mongoose');

const businessProductSchema = new mongoose.Schema({
	userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
       categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "market_categories", 
        required: true,
    },
	product_title: { type: String },
	description: { type: String },
	qty: { type: String },
	price: { type: Number },
	product_image: { type: String },
}, { timestamps: true });


const businessServiceSchema = new mongoose.Schema({
	userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
       categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "service_categories", 
        required: true,
    },
	service_title: { type: String },
	description: { type: String },
	qty: { type: String },
	price: { type: Number },
	service_image: { type: String },
}, { timestamps: true });

const addquotation = new mongoose.Schema({
	userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    requirementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product_requirments", 
        required: true,
    },
				amount: { type: String },
	file: { type: String },
}, { timestamps: true });


const Business_Product = mongoose.model("business_product", businessProductSchema);
const Business_Service = mongoose.model("service_product", businessServiceSchema);
const Quotation = mongoose.model("bussiness_quotations",addquotation);

module.exports = {
	Business_Product,
        Business_Service,
	Quotation 
}

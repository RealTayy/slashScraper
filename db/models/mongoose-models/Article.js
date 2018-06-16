/*****************|
|*  DEPENDECIES  *|
|*****************/
//  MongoDB object modeling tool
const mongoose = require('mongoose');

/******************|
|* INITIALIZATION *|
|******************/
// Create Schema class under Schema variable
const Schema = mongoose.Schema;

/**********|
|* SCHEMA *|
|**********/
// Create Schema for Article
const Article = new Schema({
	key: {
		type: String,
		unique: true,
		require: 'Article collection requires a key field',
	},
	title: {
		type: String,
		trim: true,
		require: 'Article collection requires a title field'
	},
	innerHTML: {
		type: String,
		trim: true,
		require: 'Article collection requires an innerHTML field'
	},
	notes: {
		type: Schema.Types.ObjectId,
		ref: 'Note'
	}
});

/***********|
|* EXPORTS *|
|***********/
module.exports = mongoose.model('Articles', Article)
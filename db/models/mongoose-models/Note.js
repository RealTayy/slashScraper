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
// Create Schema for Note
const Note = new Schema({
	text: {
		type: String,
		trim: true,
		require: 'Note collection requires a title field'
	},
	article_id: {
		type: Schema.Types.ObjectId,
		ref: 'Articles'
	}
});

/***********|
|* EXPORTS *| 
|***********/
module.exports = mongoose.model('Notes', Note)
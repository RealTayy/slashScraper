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
	title: {
		type: String,
		trim: true,
		require: 'Note collectionrequires a title field'
	},
	text: {
		type: String,
		trim: true,
		require: 'Note collectionrequires a title field'
	}
});

/***********|
|* EXPORTS *| 
|***********/
module.exports = mongoose.model('Notes', Note)
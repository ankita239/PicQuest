const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');


mongoose.connect("mongodb://127.0.0.1:27017/pin");

const userSchema = mongoose.Schema({
  name:String,
  username : String,
  password:String,
  contact : String,
  profileImage : String,
  email: String,
  boards:{
    type:Array,
    default: []
  },
  posts :[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Posts"
  }]
})

userSchema.plugin(plm);

module.exports = mongoose.model("User",userSchema);
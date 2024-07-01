const mongoose = require('mongoose');


mongoose.connect("mongodb://127.0.0.1:27017/pin");

const postSchema = mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  },
  title:String,
  description : String,
  image : String,
})


module.exports = mongoose.model("Posts",postSchema);
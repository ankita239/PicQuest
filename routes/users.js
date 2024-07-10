const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');


mongoose.connect("mongodb+srv://ankita478:ankita478@clustermine.bww1zz5.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMine");

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
const mongoose = require('mongoose');


mongoose.connect("mongodb+srv://ankita478:ankita478@clustermine.bww1zz5.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMine");

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
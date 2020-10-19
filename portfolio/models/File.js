const mongoose = require('mongoose');

// schema
const fileSchema = mongoose.Schema({ 
  originalFileName:{type:String},
  size:{type:Number},
  uploadedBy:{type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},
  postId:{type:mongoose.Schema.Types.ObjectId, ref:'post'},
  isDeleted:{type:Boolean, default:false},
  path:{type:String},
});

// model & export
var File = mongoose.model('file', fileSchema);

// model methods
File.createNewInstance = async function(file, uploadedBy, postId){ // 2
  return await File.create({
      originalFileName:file.originalname,
      size:file.size,
      path:file.path,
      uploadedBy:uploadedBy,
      postId:postId,
    });
};

module.exports = File;
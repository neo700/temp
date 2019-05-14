var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var UserSchema = new mongoose.Schema({
    username : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true
    }
})

UserSchema.pre('save',function(next){
    var user = this;
    if(this.isModified('password') || this.isNew){
        bcrypt.genSalt(10,function(err,salt){
            if(err){
                return next(err);
            }
            bcrypt.hash(user.password,salt,null,function(err,hash){
                if(err){
                    return next(err);
                }
                user.password = hash;
                next()
            })
        })
    }
    else{
        return next();
    }
})

UserSchema.methods.confirmPassword = function(passw,next){
    bcrypt.compare(passw,this.password,function(err,isMatch){
        if(err){
            return next(err);
        }
        next(null,isMatch);
    })
};

module.exports = mongoose.model('User', UserSchema);
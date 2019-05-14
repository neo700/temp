var JwtStratergy = require('passport-jwt').Strategy; 
var ExtractJwt = require('passport-jwt').ExtractJwt;

var User = require('../models/User.js');
var settings = require('./settings.js');

// Setup the passport authentication

module.exports = function(passport){
    var opts = {}; 
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = settings.secret;
    passport.use(new JwtStratergy(opts,function(jwt_payload,done){
        User.findOne({id: jwt_payload.id},function(err,user){
            if(err){
                return done(err,false);
            }
            if(user){
                return done(null,user);
            }
            else{
                done(null,false);
            }
        })
    }))
}
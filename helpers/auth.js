module.exports = {
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error_msg','Sign in or create an account to use app');
        res.redirect('/users/signin');
    }
}
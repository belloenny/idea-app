if(process.env.NODE_ENV === 'production'){
    module.exports ={
        mongoURI:'mongodb://belloenny:quadri123@ds257640.mlab.com:57640/ideaapp'
    }
}else{
    module.exports ={
        mongoURI:'mongodb://localhost/ideapp'
    }
}
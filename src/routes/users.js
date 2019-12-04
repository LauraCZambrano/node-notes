const router = require('express').Router();
const User = require('../models/User');

router.get('/users/signin', (req,res) => {
    res.render('users/signin');
});

router.get('/users/signup', (req,res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req,res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if(!name){
        errors.push({text: 'Please insert your name'});
    }
    if(!email){
        errors.push({text: 'Please insert your email'});
    }
    if(!password){
        errors.push({text: 'Please insert your password'});
    }
    if(!confirm_password){
        errors.push({text: 'Please confirm your password'});
    }
    if(password != confirm_password){
        errors.push({text: 'Password do not match'});
    }
    if(errors.length > 0){
        res.render('users/signup', {
            errors,
            name,
            email
        });
    } 
    else{
        const emailUser = await User.findOne({email: email});
        console.log(emailUser);
        if(emailUser){
            req.flash('error', 'The email is already taken');
            res.redirect('/users/signup');
        }
        const newUser = new User({ name, email, password });
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success', 'User Registered Successfully');
        res.redirect('/users/signin');
    } 
    
});


module.exports = router;
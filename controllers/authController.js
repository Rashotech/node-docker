const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.signUp = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            username,
            password: hashPassword
        });
        req.session.user = newUser
        res.status(201).json({
            status: "success",
            data: {
                user: newUser
            }
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: "fail"
        })
    }
};

exports.login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });

        if(!user) {
            return res.status(400).json({
                status: "fail",
                message: 'User not found'
            });
        }

        const isCorrect = bcrypt.compare(password, user.password)
       
        if(isCorrect) {
            req.session.user = user
            res.status(200).json({
                status: "success",
                data: {
                    user
                }
            });
        } else {
            res.status(400).json({
                status: "fail",
                message: 'Incorrect Username or password'
            });
        }
        
    } catch (error) {
        res.status(400).json({
            status: "fail"
        })
    }
};
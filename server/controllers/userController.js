import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// register user
// POST/api/users
const registerUser = asyncHandler (async(req,res) => {
    const {name,email,password} = req.body;

    const userexists = await User.findOne({email});

    if(userexists){
        res.status(400);
        throw new Error("User exists already!!!");
    }
    
    const user = await User.create({
        email,
        name,
        password,
    });

    if(user) {
        generateToken(res,user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        }) 
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
})

// login user & get token
// POST/api/users/login
const authUser = asyncHandler(async(req,res) => {
    const {email,password} = req.body;

    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))) {

        generateToken(res,user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
})

// user profile
// GET/api/users/profile
const getUserProfile = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id);

    if(user){
        res.status(200).json({
            _id: user._id,
            name:user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not Found');
    }
})

// update user profile
// PUT/api/users/profile
const updateUserProfile = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id);

    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            user.password = req.body.password;
        }

        const updateUser = await user.save();

        res.status(200).json({
            _id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            isAdmin: updateUser.isAdmin,
        })

    } else {
        res.status(404);
        throw new Error("User not found");
    }
})

// user logout & clear cookie
// POST/api/users/logout
const logoutUser = asyncHandler(async(req,res) => {
    res.cookie('jwt','',{
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({message: 'Logged out successfully'});
})

// get all users admin access only
// GET/api/users
const getUsers = asyncHandler(async(req,res) => {
    const users = await User.find({});
    res.status(200).json(users);
})

// get user by id, admin access only
// GET/api/users/:id
const getUserById = asyncHandler(async(req,res) => {
    const user = await User.findById(req.params.id).select('-password');

    if(user){
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }

})

// delete users, admin access only
// DELETE/api/users/:id
const deleteUser = asyncHandler(async(req,res) => {
    const user = await User.findById(req.params.id);

    if(user){
        if(user.isAdmin){
            res.status(400);
            throw new Error("Admin user can not be deleted");
        }

        await User.deleteOne({_id: user._id});
        res.status(200).json({message: 'User deleted successfully'});
    } else {
        res.status(404);
        throw new Error("User not found");
    }
})

// update user profile, admin acsess only
// PUT/api/users/:id
const updateUser = asyncHandler(async(req,res) => {
    const user = await User.findById(req.params.id);

    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        }); 
    } else {
        res.status(404);
        throw new Error("User not found");
    }
})

export {
    authUser,
    getUserProfile,
    registerUser,
    logoutUser,
    getUserById,
    updateUser,
    updateUserProfile,
    deleteUser,
    getUsers,
}
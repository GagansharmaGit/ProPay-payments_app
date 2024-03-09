const express = require("express");
const zod = require('zod')
const {User,Account} = require("../db")

const  { authMiddleware } = require("../middleware");
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config");
const router = express.Router();


const sighupBody = zod.object({
    username:zod.string().email(),
    firstname:zod.string(),
    lastname:zod.string(),
    password:zod.string()
})


router.post("/signup", async (req,res)=>{
    const {success} = sighupBody.safeParse(req.body)//destructuring success from the result
    if(!success){
        return res.status(411).json({
            message : "Email already takenss / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({username : req.body.username})
    if(existingUser){
        return res.status(411).json({
            message : "username already taken/Incorrect inputs"
        })
    }

    //if we reach this point means user is new then we have to regester that user
    const user = await User.create({
        username  : req.body.username,
        password  : req.body.password,
        firstname : req.body.firstname,
        lastname  : req.body.lastname,
    })

    //when I create a new user in mongodb then it give _id to every user which is unique
    const userId = user._id;

    /// ----- Create new account ------

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    /// -------------

    const token = jwt.sign({
        userId
    },JWT_SECRET)
    
    res.json({
        message: "User created successfully",
        token: token
    })
})


const sighinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})
router.post("/signin", async (req,res)=>{
    const {success} = sighinBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message : "Invalid Inputs"
        })
    }

    const user = await User.findOne({
        username : req.body.username,
        password : req.body.password
    })

    if(user){
        const token = jwt.sign({
            userId : user._id,
        },JWT_SECRET)

        res.json({ token : token })

        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})



const updataBody = zod.object({
    username : zod.string().optional(),
    firstname : zod.string().optional(),
    lastname : zod.string().optional()
})

router.put('/',authMiddleware,async (req,res)=>{
    const {success} = updataBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message : "Error while updating information"
        })
    }

    await User.updateOne({
        _id : req.userId,
    }, req.body)

    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstname: {
                "$regex": filter
            }
        }, {
            lastname: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstname,
            lastName: user.lastname,
            _id: user._id
        }))
    })
})




module.exports = router








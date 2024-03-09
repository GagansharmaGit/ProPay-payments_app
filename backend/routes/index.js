const express = require('express');
const userRoute = require('./user')
const accountRoute = require('./account')
const routes = express.Router();

routes.use("/user",userRoute)
routes.use('/account',accountRoute)

// app.listen(3000)
module.exports = routes;

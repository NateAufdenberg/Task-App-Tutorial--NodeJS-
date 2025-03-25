const express = require('express');
const mongoose = require('mongoose')
require('./src/mongoose.js')
const userRoute = require('./src/routes/user.js')
const taskRoute = require('./src/routes/task.js')

const app = express();
const port = process.env.PORT || 3000; 

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site under maintenance please come back soon')
// })

app.use(express.json())
app.use(userRoute)
app.use(taskRoute)

// Without middleware: new request -> run route handler

// With middleware: new -> do something -> run route handler


app.listen(port, () => {
    console.log(`Server is on port ` + port)
})


// nate -> ajl;djfal;jdlk;j -> nate
// mypass -> fja;leioqrpue
const express = require('express');
const mongoose = require('mongoose')
const multer = require('multer')
require('./src/mongoose.js')
const userRoute = require('./src/routes/user.js')
const taskRoute = require('./src/routes/task.js')

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('Please upload a Word Document'))
        }

        cb(undefined, true)

        // cb(new Error('File must be a PDF'))
        // cb(undefined, true)
        // cb(undefined, false)
    }
})


app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

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
const express = require('express');
const mongoose = require('mongoose')
require('./src/mongoose.js')
const User = require('./src/models/user.js')
const Task = require('./src/models/task.js')

const app = express();
const port = process.env.PORT || 3000; 

app.use(express.json())

app.post('/users', (req, res) => {
    const person = new User(req.body);

    person.save().then(() => {
        res.status(201).send(person)
    }).catch((err) => {
        res.status(400).send(err)
        console.log(err)
    })
})

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users)
    }).catch((err) => {
        res.status(500).send(err);
        console.log(err)
    })
})

app.get('/users/:id', (req,res) => {
    const _id = req.params.id;

    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    }).catch((err) => {

    })
    console.log(req.params)
})

app.post('/tasks', (req, res) => {
    const task = new Task(req.body);

    task.save().then(() => {
        res.send(task);
        console.log(task)
    }).catch((err) =>{
        res.send(err);
        console.log(err);
    })
})

app.get('/tasks/:id', (req, res) => {
    const _id = req.params.id;

    Task.findById(_id).then((task) => {
        if (!task) {
            res.status(400).send()
        }
        res.send(task)
    })
})

app.listen(port, () => {
    console.log(`Server is on port ` + port)
})
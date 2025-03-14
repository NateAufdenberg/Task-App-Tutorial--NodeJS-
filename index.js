const express = require('express');
const mongoose = require('mongoose')
require('./src/mongoose.js')
const User = require('./src/models/user.js')
const Task = require('./src/models/task.js');
const user = require('./src/models/user.js');

const app = express();
const port = process.env.PORT || 3000; 

app.use(express.json())

app.post('/users', async (req, res) => {
    const person = new User(req.body);

    try {
        await person.save()
        res.status(201).send(person)
    } catch (err) {
        res.status(400).send(err)
        console.log(err)
    }
})

app.get('/users', async (req, res) => {

    try {
        const users = await User.find({})
        res.send(users)
    } catch (err) {
        res.status(500).send()
    }
})

app.get('/users/:id', async(req,res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (err) {
        res.status(500).send()
    }
})

app.patch('/users/:id', async(req, res) => {
    
    const allowUpdates = ['name', 'email', 'password', 'age']
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true })

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (err) {
        res.status(400).send(err)
    }
})

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save()
        res.send(task)
    } catch (err) {
        res.status(500).send()
    }
})

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.send(tasks)
    } catch (err) {
        res.status(500).send()
    }
})

app.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findById(_id)
        
        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (err) {
        res.status(500).send()
    }
})


app.listen(port, () => {
    console.log(`Server is on port ` + port)
})
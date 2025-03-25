const express = require('express')
const Task = require('../models/task.js')
const route = new express.Router();
const auth = require('../middleware/auth.js')

route.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.send(task)
    } catch (err) {
        res.status(500).send()
    }
})

route.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.send(tasks)
    } catch (err) {
        res.status(500).send()
    }
})

route.patch('/tasks/:id', async (req,res) => {
    const taskupdate = Object.keys(req.body);
    const allowedTasks = ['description', 'completed']
    const validTask = taskupdate.every((update) => {
        return allowedTasks.includes(update)
    })

    if (!validTask) {
        return res.status(400).send({ error: 'Invalid update' })
    }

    try {
        const task = await Task.findById(req.params.id);

        taskupdate.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (err) {
        res.status(400).send()
    }
})

route.get('/tasks/:id', async (req, res) => {
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

route.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (err) {
        res.status(500).send()
    }
})


module.exports = route
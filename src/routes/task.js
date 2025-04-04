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

route.get('/tasks', auth, async (req, res) => {
    try {
        await req.user.populate('tasks')
        
        res.send(req.user.tasks)
    } catch (err) {
        res.status(500).send()
        console.log(err)
    }
})

route.patch('/tasks/:id', auth, async (req,res) => {
    const taskupdate = Object.keys(req.body);
    const allowedTasks = ['description', 'completed']
    const validTask = taskupdate.every((update) => {
        return allowedTasks.includes(update)
    })

    if (!validTask) {
        return res.status(400).send({ error: 'Invalid update' })
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});


        if (!task) {
            return res.status(404).send()
        }
        taskupdate.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()

        res.send(task)
    } catch (err) {
        res.status(400).send()
    }
})

route.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })
        
        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (err) {
        res.status(500).send()
        console.log(err)
    }
})

route.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id})

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (err) {
        res.status(500).send()
        console.log(err)
    }
})


module.exports = route
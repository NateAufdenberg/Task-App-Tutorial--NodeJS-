const express = require('express')
const User = require('../models/user.js')
const auth = require('../middleware/auth.js')
const webtoken = require('jsonwebtoken')
const route = new express.Router();

route.post('/users', async (req, res) => {
    const person = new User(req.body);

    try {
        await person.save()
        const token = await person.authTokenGeneration()
        res.status(201).send({ person, token })
    } catch (err) {
        res.status(400).send(err)
        console.log(err)
    }
})

route.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.authTokenGeneration()
        res.send({ user, token })
    } catch (err) {
        res.status(400).send(err)
        console.log(err)
    }
})

route.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

route.get('/users/:id', async(req,res) => {
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

route.patch('/users/:id', async(req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ['name', 'email', 'password', 'age'];
    const isValid = updates.every((update) => {
        return allowUpdates.includes(update);
    });

    if (!isValid) {
        return res.status(400).send({ error: 'Invalid updates!'})
    }
    try {
        const user = await User.findById(req.params.id)

        updates.forEach((update) => {
            user[update] = req.body[update]
        })

        await user.save()


        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (err) {
        res.status(400).send(err)
    }
})

route.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (err) {
        res.status(500).send()
    }
})

module.exports = route
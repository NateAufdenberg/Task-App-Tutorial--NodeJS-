const express = require('express')
const sharp = require('sharp')
const User = require('../models/user.js')
const auth = require('../middleware/auth.js')
const webtoken = require('jsonwebtoken')
const route = new express.Router();
const multer = require('multer') 

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

route.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (err) {
        res.status(500).send()
    }
})

route.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (err) {
        res.status(500).send()
        console.log(err)
    }
})
const upload = multer({
    limits: {
        fileSize: 1000000,
        fileFilter(req, file, cb) {
            if (!file.originalname.match(/\.(JPG|jpeg|png)$/)) {
                return cb(new Error('Please upload an image'))
            }

            cb(undefined, true)
        }  
    }

})

route.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // const formData = new FormData()
    // formData.append('avatar', fileInput.files[0])
    if (!req.file) {
        return res.status(400).send({ error: ' No file uploaded '})
    }
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
    console.log(error)
})

route.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
}) 

route.patch('/users/me', auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowUpdates = ['name', 'email', 'password', 'age'];
    const isValid = updates.every((update) => {
        return allowUpdates.includes(update); 
    });

    if (!isValid) {
        return res.status(400).send({ error: 'Invalid updates!'})
    }
    try {
        const user = await User.findById(req.user._id)

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
        console.log(err)
    }
})

route.delete('/users/me', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (err) {
        res.status(500).send()
    }
})

route.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

route.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (err) {
        res.status(404).send()
    }
})

module.exports = route
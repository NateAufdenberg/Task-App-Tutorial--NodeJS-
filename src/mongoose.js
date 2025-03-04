const mongoose = require('mongoose')
const mongodb = require('mongodb')
const express = require('express')

main().catch((err) =>{(console.log(err))})

async function main() {
    const url = 'mongodb://127.0.0.1:27017/task-manager(docs)-api'
    try {
        await mongoose.connect(url);

    } catch(err){
        console.error('Could not connect to database '+ err)
    } finally {
        
    }
}

main().catch(console.dir);
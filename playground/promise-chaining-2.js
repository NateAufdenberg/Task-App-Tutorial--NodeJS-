require('../src/mongoose.js')
const Task = require("../src/models/task.js")

// 67c2038482e163181383f085

Task.findByIdAndDelete('67c75c6122f7475ae7bb4d58', { completed: true }).then((task) => {
    console.log(task)
    return Task.countDocuments({ completed: false })
}).then((result) => {
    console.log(result)
}).catch((err) => {
    console.log(err)
})


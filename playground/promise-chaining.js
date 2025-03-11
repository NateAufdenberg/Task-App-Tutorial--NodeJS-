require('../src/mongoose.js')
const Task = require('../src/models/task.js')
const User = require('../src/models/user.js')

// 67c75adca4623128244425a9

// User.findByIdAndUpdate('67c75adca4623128244425a9', {age: 18}).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 18 })
// }).then((result) => {
//     console.log(result)
// }).catch((err) => {
//     console.log(err)
// })

// const updateAgeAndCount = async (id, age) => {
//     const user = await User.findByIdAndUpdate(id, { age })
//     const count = await User.countDocuments({ age })
//     return count
// }

// updateAgeAndCount('67c75adca4623128244425a9', 2).then((count) => {
//     console.log(count)
// }).catch((err) => {
//     console.log(err)
// })

const deleteTaskAndCount = async (id, completed) => {
    const task = await Task.findByIdAndUpdate(id, { completed })
    const count = await Task.countDocuments({ completed: false })
    return count
}

// 67c204a2fbfc173c0521dee5

deleteTaskAndCount('67c204a2fbfc173c0521dee5', false).then((count) => {
    console.log(count)
}).catch((err) => {
    console.log(err)
})
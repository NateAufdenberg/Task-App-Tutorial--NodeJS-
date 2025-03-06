require('../src/mongoose.js')
const User = require('../src/models/user.js')

// 67c75adca4623128244425a9

User.findByIdAndUpdate('67c75adca4623128244425a9', {age: 18}).then((user) => {
    console.log(user)
    return User.countDocuments({ age: 18 })
}).then((result) => {
    console.log(result)
}).catch((err) => {
    console.log(err)
})
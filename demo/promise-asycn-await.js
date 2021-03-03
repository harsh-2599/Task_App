require('../src/db/mongoose')
const taskModel = require('../src/models/task')
const { findByIdAndUpdate } = require('../src/models/user')
const userModel = require('../src/models/user')

// userModel.findByIdAndUpdate('603f4ee8af8a8557d4e48dd1',{age :20}).then((user)=>{
//     console.log(user)
//     return userModel.countDocuments({age : 20})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

// const updateAgeAndCount = async (id,age)=>{
//     const user = await userModel.findByIdAndUpdate(id,{age})
//     const count = await userModel.countDocuments({age})
//     return count 
// }
// updateAgeAndCount('603f4ee8af8a8557d4e48dd1', 21).then((count)=>
// {
//     console.log(count)
// }).catch((e)=>{
//     console.log(e)
// })
// taskModel.findByIdAndDelete('603f5160a62b7b0ea4309d38').then((task)=>{
//     console.log(task)
//     return taskModel.countDocuments({completed : false})
// }).then((result)=>{
//     console.log(result);
// }).catch((e)=>{
//     console.log(e)
// })

const deleteTaskAndCount = async (id)=>{
    const deletetask = await taskModel.findByIdAndDelete(id)
    const count = await taskModel.countDocuments({completed : false})
    return count
}

deleteTaskAndCount('603f6599d55fd75698090dac').then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e);
})
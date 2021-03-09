const mongodb = require('mongodb')
// const imp = require('../Task-app/imp.js')
const mongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

const curl = process.env.CURL;
// const curl = 'mongodb://127.0.0.1:27017'
const databaseName = 'Task_Application'

mongoClient.connect(curl, {useNewUrlParser:true, useUnifiedTopology : true} , (err,client)=>{
    if(err){
        return console.log("Unable to connect to given URL")
    }
    console.log("Connected to database successfully")
    const db = client.db(databaseName)

    // db.collection('users').insertOne({
    //     name : 'Harsh',
    //     age : 44
    // },(err,res)=>{
    //     if(err){
    //         return console.log("Unable to insert data");
    //     }
    //     else{
    //         console.log(res.ops)
    //     }
    // })
    // db.collection('tasks').insertMany([{
    //     description : 'Clean The house',
    //     completed : true ,
    // },{ 
    //     description : 'Renew inspection',
    //     completed : false,
    // },{ 
    //     description : 'Pot plants',
    //     completed : false,
    // }],(err,res)=>{
    //     if(err){
    //        return console.log("Unable to insert tasks");
    //     }
    //     else{
    //         console.log("Data inserted successfully")
    //         console.log(res.ops)
    //     }
    // })
    // db.collection('users').findOne({name : 'Harsh'},(err,res)=>{
    //     if(err){
    //         console.log("Unable to find");
    //     }else if(!res){
    //         console.log("No data found") 
    //     }
    //     else{
    //         console.log(res);
    //     }
    // })
    // db.collection('tasks').findOne({ _id : new ObjectID('603dd9e0646d4938d08cc52b')},(err,res)=>{
    //     if(err){
    //         console.log("Unable to find");
    //     }else if(!res){
    //         console.log("No data found") 
    //     }
    //     else{
    //         console.log(res);
    //     }
    // })
    // db.collection('tasks').find({ completed : false}).toArray((err,res)=>{
    //     if(err){
    //         console.log("Unable to find");
    //     }else if(!res){
    //         console.log("No data found") 
    //     }
    //     else{
    //         console.log(res);
    //     }
    // })
    // db.collection('users').updateOne(
    //     {_id : new ObjectID('603df975b18c1443b415109a')
    //         },{
    //             $set : {
    //                 name : 'Krishna',
    //                 age : 84
    //             }
    //         }).then((result)=>{
    //     console.log(result.message);
    // }).catch((err)=>{
    //     console.log("Unable to update")
    // })
    // db.collection('tasks').updateMany({completed : false},{
    //     $set:{
    //         completed : true
    //     }
    // }).then((res)=>{
    //     console.log(res.modifiedCount)
    // }).catch((err)=>{
    //     console.log("Unable to update")
    // })
//   db.collection('users').deleteMany({
//       age : 44
//     }).then((res) => {
//         console.log(res.deletedCount)
//     }).catch((err)=>{
//         console.log("Unable to delete");
//     })
    db.collection('tasks').deleteOne({
        description : 'Renew inspection'
    }).then((res) => {
        console.log(res.deletedCount)
    }).catch((err)=>{
        console.log("Unable to delete");
    })
})
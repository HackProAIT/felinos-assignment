const express = require('express')
const users = require('./models/users')
const items = require('./models/items')
const orders = require('./models/orders')

const port = process.env.PORT || 3000

const app = express()
app.use(express.json())

//1.create users
app.post('/user', (req,res)=>{
    try {
        users.forEach(user => {
            if(user.username === req.body.username || user.phone === req.body.phone || user.email === req.body.email)
                throw('user already exists')
        })
    
        const userId = Math.floor(Math.random()*100000)
        req.body.userId = userId
        users.push(req.body)
        orders.set(userId.toString(),[])
        res.send('user saved')
    } catch(e){
        res.status(400).send(e)
    }
})

//2.create orders for a perticular user
app.post('/order', (req,res)=>{
    try{
        if(!items.has(req.body.itemName))
            throw('item not available')
        else{            
            if(orders.has(req.body.userId)){
                const order = orders.get(req.body.userId)
                order.push({itemName: req.body.itemName,quantity: req.body.quantity})
                orders.set(req.body.userId,order)
            }
            else
                throw('user does not exists')
            
            res.send('order saved')
        }
    }catch(e){
        res.status(400).send(e)
    }
})

//create items
app.post('/item', (req,res) => {
    try{
        if(items.has(req.body.itemName))
            throw('item already exists')
        
        items.set(req.body.itemName,req.body.description)
        res.send('item saved')
    }catch(e){
        res.status(400).send(e)
    }
})


//3.get list of orders of a user
app.get('/order/:userId', (req,res)=>{
    try{
        if(!orders.has(req.params.userId))
            throw('user does not exists')
        else
            res.send(orders.get(req.params.userId))
    }catch(e){
        res.status(400).send(e)
    }
})

//4.update a particular order of a user
app.put('/updateOrder', (req,res)=>{
    try{
        const userOrders = orders.get(req.body.userId)
        if(userOrders.length === 0)
            throw('no orders to update')
        userOrders.forEach(order => {
            if(order.itemName === req.body.itemName)
                order.quantity = req.body.quantity
        })
        res.send('order updated')
    }catch(e){
        res.status(400).send(e)
    }
})

//5.delete a particular order of a user
app.delete('/deleteOrder', (req,res)=>{
    try{
        const userOrders = orders.get(req.body.userId)
        if(userOrders.length === 0)
            throw('no orders to delete')
        orders.set(req.body.userId,userOrders.filter(order => order.itemName!==req.body.itemName))
        res.send('order deleted')
    }catch(e){
        res.status(400).send(e)
    }
})

app.listen(port, ()=>{
    console.log("listening on port ",port)
})
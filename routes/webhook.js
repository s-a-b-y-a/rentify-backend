const express = require('express')
const User = require('../models/user')
const { verifyWebhook } = require('../controllers/webhook')

const router = express.Router()

router.post('/', verifyWebhook, async (req,res) => {
    const { data, type } = req.body

    if(type === 'user.created' || type === 'user.updated'){
        const { id, first_name, last_name, email_addresses } = data
        const email = email_addresses[0].email_address

        let user = await User.findOne({ clerkId: id })

        if(!user){
            // new user
            user = new User({
                clerkId: id,
                name: `${first_name} ${last_name}`,
                email,
            })
        } else{
            // update user
            user.name = `${first_name} ${last_name}`
            user.email = email
        }

        await user.save()
    }

    return res.status(200).json({ message: 'Webhook received!' }) 
})

module.exports = router
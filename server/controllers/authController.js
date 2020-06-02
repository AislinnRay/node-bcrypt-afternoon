const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req,res) => {
        const {username, password, isAdmin} = req.body
        const db = req.app.get('db')

        //Check if user already exists
        const existingUser = await db.get_user(username)

        if(existingUser[0]) {
            return res.status(409).send('Username taken')
        }
        //If they do not exist we can carry on
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        //Create new user
        const registeredUser = await db.register_user([isAdmin, id, username])
        const user = registeredUser[0]

        //Set user on session
                // req.session.user = registeredUser[0]
        req.session.user = {isAdmin: user.is_admin, username: user.username, id: user.id}

        //Send back new user
        res.status(201).send(req.session.user)
    },
    login: async (rq,res) => {
        const {username, password} = req.body
        const db = req.app.get('db')

        //Make sure user exists
        const foundUser = await db.get_user([username])
        const user = foundUser[0];
        if(!foundUser[0]) {
            return res.status(401).send('User not Found. Please register as a new user before logging in.')
        }

        //If they do exist, we need to authenticate them
        const isAuthenticated = bcrypt.compareSync(password, FoundUser[0].hash)

        //If password does not match indicate bad password
        if (!isAuthenticated) {
            return res.status(403).send('Incorrect Password')
        }
        //if they have tried too many times, lock them out

        //Remove hash from our user object
        delete foundUser[0].hash
        //Set our user on session
        // req.session.user = foundUser[0]
        req.session.user = {isAdmin: user.is_admin, id: user.id, username: user.username}
        return res.status(200).send(req.session.user)
    },
    logout: (req,res) => {
        //Save their history/any info you want and then destroy
        req.session.destroy();
        return res.sendStatus(200);
    }
}
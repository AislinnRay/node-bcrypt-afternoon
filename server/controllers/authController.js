const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const {username, password, isAdmin} = req.body;
        const db = req.app.get('db')

        //Check if user already exists
        const result = await db.get_user([username]);
        const existingUser = result[0];

        if(existingUser) {
            return res.status(409).send('Username taken')
        }
        //If they do not exist we can carry on
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)

        //Create new user
        const registeredUser = await db.register_user([isAdmin, username, hash])
        const user = registeredUser[0];

        //Set user on session
                // req.session.user = registeredUser[0]
        req.session.user = {isAdmin: user.is_admin, username: user.username, id: user.id}

        //Send back new user
        return res.status(201).send(req.session.user)
    },
    login: async (req,res) => {
        const {username, password} = req.body
        const db = req.app.get('db')

        //Make sure user exists
        const foundUser = await db.get_user([username])
        const user = foundUser[0];
        if(!user) {
            return res.status(401).send('User not Found. Please register as a new user before logging in.')
        }

        //If they do exist, we need to authenticate them
        const isAuthenticated = bcrypt.compareSync(password, user.hash)

        //If password does not match indicate bad password
        if (!isAuthenticated) {
            return res.status(403).send('Incorrect Password')
        }
        //Set our user on session
        // req.session.user = foundUser[0]
        req.session.user = {isAdmin: user.is_admin, id: user.id, username: user.username}
        return res.send(req.session.user)
    },
    logout: (req,res) => {
        //Save their history/any info you want and then destroy
        req.session.destroy();
        return res.sendStatus(200);
    }
}
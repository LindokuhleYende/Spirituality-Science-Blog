const bcrypt = require('bcrypt');
const User = require('../models/User');

module.exports = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.redirect('/auth/login'); // User not found
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            console.log(user);
            req.session.userId = user._id;
            return res.redirect('/');
        } else {
            return res.redirect('/auth/login'); // Wrong password
        }
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).send('Internal Server Error');
    }
};

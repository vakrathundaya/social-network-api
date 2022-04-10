const { User } = require('../models');

const userController = {
    //get All users
    getUsers(req, res) {
        User.find({})
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    // add a new user 
    createUser({ body }, res) {
        User.create({ username: body.username, email: body.email })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err))
    },
    //get one user by Id
    getUserByID({ params }, res) {
        User.findOne({ _id: params.id })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },
    //update user data
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this ID!' });
                    return;
                }

                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this ID!' });
                    return;
                }

                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    // add a friend to user
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $push: { friends: params.friendID } },
            { runValidators: true, new: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this ID!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },
    //delete friend
 
    deleteFriend({ params}, res) {
        User.findOneAndDelete({
                _id: params.id
            })
            .then(deletedFriend => {
                if (!deletedFriend) {
                    return res.status(404).json({
                        message: 'No friend found with this id.'
                    })
                }
                return User.findOneAndUpdate({
                    friends: params.friendID },
                     { $pull: { friends: params.friendID }},
                     { new: true });
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: 'Friend deleted'
                    })
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
};
    

module.exports = userController;
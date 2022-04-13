const { User } = require('../models');

const userController = {
    //get all users
    getUsers(req, res) {
        User.find({})
            .then(userData => res.json(userData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    //create user
    addUser({ body }, res) {
        User.create(body)
            .then(userData => res.json(userData))
            .catch(err => res.status(400).json(err));
    },

    //get single user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .then(userData => res.json(userData))
            .catch(err => res.status(400).json(err));
    },

    //update user by id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with this ID!' });
                    return;
                }

                res.json(userData);
            })
            .catch(err => res.status(400).json(err));
    },

    //delete user and his thoughts
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(userData => !userData ?
                res.status(404).json({ message: 'No user found with this ID!' }) :
                User.deleteMany({ _id: { $in: User.thoughts } }))

            .then(() => res.status(200).json({ message: 'User and thoughts deleted!' }))
            .catch((err) => res.status(500).json(err))
    },


    //add a friend
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            { $push: { friends: params.friendId } },
            { runValidators: true, new: true }
        )
            .then(userData => {
                if (!userData) {
                    res.status(404).json({ message: 'No user found with this ID!' });
                    return;
                }
                res.json(userData);
            })
            .catch(err => res.status(400).json(err));
    },
    //delete friend

    deleteFriend({ params }, res) {
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
                    friends: params.friendId
                },
                    { $pull: { friends: params.friendId } },
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
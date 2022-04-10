const { User } = require('../models');

const userController = {
    getUsers(req, res) {
        User.find({})
            .then(userData => res.json(userData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    addUser({ body }, res) {
        User.create(body)
            .then(userData => res.json(userData))
            .catch(err => res.status(400).json(err));
    },
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .then(userData => res.json(userData))
            .catch(err => res.status(400).json(err));
    },
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(userData => {
                if(!userData) {
                    res.status(404).json({ message: 'No user found with this ID!' });
                    return;
                }

                res.json(userData);
            })
            .catch(err => res.status(400).json(err));
    },
    deleteUser({params}, res) {
        User.findOneAndDelete({_id: params.id})
        .then(userData => {
            if(!userData) {
                res.status(404).json({ message: 'No user found with this ID!' });
                return;
            }

            res.json(userData);
        })
        .catch(err => res.status(400).json(err));
    },
    addFriend({params}, res){
        User.findOneAndUpdate(
            {_id: params.id},
            {$push: {friends: params.friendId}},
            {runValidators: true, new: true}
        )
        .then(userData => {
            if(!userData) {
                res.status(404).json({ message: 'No user found with this ID!' });
                return;
            }
            res.json(userData);
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
                    friends: params.friendId },
                     { $pull: { friends: params.friendId }},
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
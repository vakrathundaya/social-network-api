const { Schema, model, Types } = require('mongoose');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
        email: {
            tyep: String,
            unique: true,
            required: true,
            match: [/.+\@.+\..+/]
        },

        thoughts: [
            {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
            }
        ],
        friends: [

            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]

    },
    {
        toJSON: {
            getters: true,
            Virtuals: true
        }
    }

);

UserSchema.virtual('friendCount').get(function() {
    return this.friends.length;
});

const User = model('user', UserSchema);
module.exports = User;
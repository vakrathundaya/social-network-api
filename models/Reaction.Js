const { schema, types } = require('mongoose');

const ReactionSchema = new schema(
    {
        reactionId: {
            type: schema.types.ObjectId,
            default: () => new types.ObjectId()
            
        },
        reactionBody: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            reuired:true
        },
        createdAt:{
            type:Date,
            default: Date.now,
        },

    },
    {
        toJSOn: {
            getters:true
        }
    }
)

module.exports = ReactionSchema;
const { Schema, model, Types } =  require('mongoose');
const ReactionSchema = require('./Reaction');

const ThoughtSchema = new Schema(
    {
        thoughtText: {
            type:String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        username: {
            type:String,
            required:true
        },
        reactions: [ReactionSchema],
    },
    {
        toJSON: {
            getters: true,
            virtuals: true
        }
    }
    
);

ThoughtSchema.virtual('reactionCount').get( function() {
    return this.reactions.length;
})
const Thought = model('thought', ThoughtSchema);

module.exports = Thought;
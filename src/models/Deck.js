import mongoose from 'mongoose'

const DeckSchema = new mongoose.Schema({
    name: { type: String},
    items: [
        /* List of items */
        new mongoose.Schema({
          question: { type: String},
          answer: {type: String},         
          URL: {type: String},
          recentAttempts: {
            type: [Number],
            default: []
          },
          starred: {type: Boolean},          
        })
      ],
})

export default mongoose.models.Deck || mongoose.model('Deck', DeckSchema)

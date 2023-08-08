import dbConnect from '../../../lib/dbConnect'
import Deck from '@/models/Deck'

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req

  await dbConnect()

  switch (method) {    
    case 'GET' /* Get a model by its ID */:
      try {
        const deck = await Deck.findById(id)
        if (!deck) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: deck })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'PUT' /* Edit a model by its ID */:
        console.log("updating one item")
        console.log(req.body)
      try {
      
        const updateOperation = {
          updateOne: {
            filter: { _id: id, "items._id": req.body._id },
            update: { $set: { "items.$": req.body } }
          }
        };

        const changes = await Deck.bulkWrite([updateOperation])

        if (!changes) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: changes })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'DELETE' /* Delete a model by its ID */:
      try {
        const deletedDeck = await Deck.deleteOne({ _id: id })
        if (!deletedDeck) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: {} })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    default:
      res.status(400).json({ success: false })
      break
  }
}

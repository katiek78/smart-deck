import dbConnect from '../../../../lib/dbConnect'
import Deck from '@/models/Deck'

export default async function handler(req, res) {
  const {
    query: { id, currentPage },
    method,
  } = req

  await dbConnect()

  switch (method) {
    case 'GET' /* Get imageSet by ID and return only relevant page */:
      try {
        //  console.log(currentPage)
        const deck = await Deck.findOne({ _id: id }, { items: { $slice: [currentPage * 20, 20] } })
        // console.log(imageSet)
        if (!deck) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: deck })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break

    case 'PUT' /* Update only the images where we have an image with matching ID */:
      try {

        const updateOperations = [ 
          {
          updateOne: {
            filter: { _id: id },
            update: { $set: { name: req.body.name } }
          }
        }, ...req.body.items.map(item => ({
          updateOne: {
            filter: { _id: id, "items._id": item._id },
            update: { $set: { "items.$": item } }
          }
        }))
      ];

        const changes = await Deck.bulkWrite(updateOperations);


        if (!changes) {
          return res.status(400).json({ success: false })
        }
        res.status(200).json({ success: true, data: changes })
      } catch (error) {

        res.status(400).json({ success: false })
      }
      break

    }
}

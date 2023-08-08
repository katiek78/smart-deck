import { images } from '../../../../../next.config';
import dbConnect from '../../../../lib/dbConnect'
import Deck from '@/models/Deck'

export default async function handler(req, res) {
  const {
    query: { id, currentPage },
    method,
  } = req

  await dbConnect()

  switch (method) {
   

    case 'PUT' /* Update with a blank image */:
      try {

        const newItem = {};
        const result = await Deck.updateOne(
            { _id: id },
            {
              $push: { items: newItem }
            }
          );
      
          if (result.matchedCount === 1) {
            res.status(200).json({ message: 'New item added successfully.' });
          } else {
            res.status(404).json({ error: 'Deck not found.' });
          }
        
      } catch (error) {

        res.status(400).json({ success: false })
      }
      break

    }
}

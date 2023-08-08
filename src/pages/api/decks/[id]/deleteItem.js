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
   

    case 'PUT' /*Delete an item */:
      try {

        const itemIDToDelete = req.body.itemIDToDelete;
        const result = await Deck.updateOne(
            { _id: id },
            {
              $pull: { items: { _id: itemIDToDelete } } 
            }
          );
      
          if (result.matchedCount === 1) {
            res.status(200).json({ message: 'Item deleted successfully.' });
          } else {
            res.status(404).json({ error: 'Deck/item not found.' });
          }
        
      } catch (error) {

        res.status(400).json({ success: false })
      }
      break

    }
}

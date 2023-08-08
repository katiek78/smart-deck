
import { withPageAuthRequired, getSession} from "@auth0/nextjs-auth0";
import dbConnect from "@/lib/dbConnect";
import Deck from "@/models/Deck";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { refreshData } from "@/lib/refreshData";
import { useState } from "react";
import { useRouter } from "next/router";

const DecksPage = ({user, decks}) => {
  //let user = useUser(); //should we be using this instead?
    
    const [message, setMessage] = useState('')
    const router = useRouter();
    
    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this deck?');
        if (confirmed) {
          
            //remove it from the database
            try {
                await fetch(`/api/decks/${id}`, {
                method: 'Delete',
                })
                refreshData(router);
            } catch (error) {
                setMessage('Failed to delete the deck.')
            }
        }
    }

  return(
    <>
    <div className="z-10 justify-between font-mono text-lg max-w-5xl w-full ">
    <h1 className="py-2 font-mono text-4xl">My decks</h1>
    <p className="font-mono">Hi {user.nickname} - you have {decks.length} {decks.length === 1 ? 'deck' : 'decks'}.</p>
    {decks.length > 0 && decks.map(deck => <p className="font-semibold"> <Link href="/decks/[id]/" as={`/decks/${deck._id}/`} legacyBehavior>{deck.name}</Link> 
    <FontAwesomeIcon className="ml-5 cursor-pointer" onClick={() => handleDelete(deck._id)} icon={faTrash} size="1x" /></p>)}
    <Link href="/newDeck"><button className="btn bg-black hover:bg-gray-700 text-white font-bold mt-3 py-1 px-4 rounded focus:outline-none focus:shadow-outline">
          Add new deck
        </button></Link>
  </div>
    <div>{message}</div>
</>
  )
}

export default DecksPage;

export const getServerSideProps = withPageAuthRequired({
    getServerSideProps: async ({ req, res }) => {
    const auth0User = await getSession(req, res);
     const db = await dbConnect()

    // Fetch the user from the db (by email)
    // let user = await SiteUser.findOne({ where: { email: auth0User?.user.email } });
    

    // You might want to move the creation of the user somewhere else like afterCallback
    // Checkout https://auth0.github.io/nextjs-auth0/modules/handlers_callback.html
    // if (!user) {
      // user = db.user.create(auth0User?.user);  //EVENTUALLY SOMETHING LIKE THIS
     const user = (auth0User).user
    // } 
  
 

/* find all the data in our database */
// const result = await Journey.find({})
//   const journeys = result.map((doc) => { 
//     const journey = JSON.parse(JSON.stringify(doc));
//     journey._id = journey._id.toString()
//     return journey
//   })

  const result2 = await Deck.find({}, { name: 1})
  const decks = result2.map((doc) => {   
    const deck = JSON.parse(JSON.stringify(doc));
    deck._id = deck._id.toString()
    return deck
  })

  // let user = await db.user.findUnique({ where: { email: auth0User?.user.email } });
  // if (!user) {
  //    user = db.user.create(auth0User?.user);
  // } 
    return {
      props: {
        // dbUser: user,
        user: (auth0User).user,
        // user: user,  //EVENTUALLY THIS
       
        decks: decks
      },
    };
  },
})


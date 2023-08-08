
'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import dbConnect from "@/lib/dbConnect";
import Deck from "@/models/Deck";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { refreshData } from "@/lib/refreshData";
import { useState } from "react";
import { useRouter } from "next/router";



const DecksPage = ({ decks }) => {
    const { user, error, isLoading } = useUser();
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;
  
   
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

    if (user) {
        return (      
        
        <>
            <div className="z-10 justify-between font-mono text-lg max-w-5xl w-full ">
                <h1 className="py-2 font-mono text-4xl">My decks</h1>
                <p className="font-mono">You have {decks.length} {decks.length === 1 ? 'deck' : 'decks'}.</p>
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

return (<>
 <div className="z-10 justify-between font-mono text-lg max-w-5xl w-full ">
                <h1 className="py-2 font-mono text-4xl">My decks</h1>
                <h2>You must be logged in to see this page.</h2>
                </div>
</>)
}

export default DecksPage;

export async function getServerSideProps(context) {

    const db = await dbConnect()
    const result2 = await Deck.find({}, { name: 1 })
    const decks = result2.map((doc) => {
        const deck = JSON.parse(JSON.stringify(doc));
        deck._id = deck._id.toString()
        return deck
    })

    return {
        props: {
            decks: decks
        },
    };
}


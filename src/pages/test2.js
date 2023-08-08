// import Deck from "@/models/Deck";
// import DeckForm from "@/components/DeckForm";
// //import dbConnect from "@/lib/dbConnect";

const TestNewDeckPage2 = ({decks}) => {

    const deckForm = {
        name: ''
    }

    return(
 <>
    <div className="z-10 justify-between font-mono text-lg max-w-5xl w-full ">
    <h1 className="py-2 font-mono text-4xl">New deck</h1>
    
    {decks.length}
    {/* <DeckForm formId="add-deck-form" deckForm={deckForm} /> */}
   
  </div>

</>

    );

}

export default TestNewDeckPage2

export async function getServerSideProps(context) {
    // const db = await dbConnect()

    // const result2 = await Deck.find({}, { name: 1})
    // const decks = result2.map((doc) => {   
    //   const deck = JSON.parse(JSON.stringify(doc));
    //   deck._id = deck._id.toString()
    //   return deck
    // })


    return {
      props: {decks: [3,5,6]}, // will be passed to the page component as props
    }
  }


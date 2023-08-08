
#
'use client'
//import dbConnect from "@/lib/dbConnect";
import DeckForm from "@/components/DeckForm";

const TestNewDeckPage = ({banana}) => {

    const deckForm = {
        name: ''
    }

    return(
 <>
    <div className="z-10 justify-between font-mono text-lg max-w-5xl w-full ">
    <h1 className="py-2 font-mono text-4xl">New deck</h1>
    
    
    <DeckForm formId="add-deck-form" deckForm={deckForm} />
   
  </div>

</>

    );

}

export default TestNewDeckPage

export const getServerSideProps = async () => {
    getServerSideProps: async ({ params, req, res }) => {
   
   // await dbConnect()
     
  
    return { props: {banana: 'banana value'} }
  }
}
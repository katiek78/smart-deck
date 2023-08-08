import { withPageAuthRequired, getSession} from "@auth0/nextjs-auth0";
import DeckForm from "@/components/DeckForm";

const TestNewDeckPage2 = ({user}) => {

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

export default TestNewDeckPage2

// export async function getServerSideProps(context) {
//     return {
//       props: {banana: 'banana'}, // will be passed to the page component as props
//     }
//   }

export const getServerSideProps = withPageAuthRequired({
    getServerSideProps: async ({ params, req, res }) => {
    const auth0User = await getSession(req, res);
    const user = auth0User.user;
    await dbConnect()
     
  
    return { props: { user } }
  }
})
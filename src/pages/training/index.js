
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import dbConnect from "@/lib/dbConnect";
// import Journey from "@/models/Journey";
// import MemoSystem from "@/models/MemoSystem";
import Deck from "@/models/Deck";
import TrafficLights from "@/components/TrafficLights";
import ConfidenceLevel from "@/components/ConfidenceLevel";
import QuickEditForm from "@/components/QuickEditForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark, faEdit, faImage, faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import { confidenceLabels, getConfidenceLevel } from "@/utilities/confidenceLevel";

// import SiteUser from "@/models/SiteUser";

const TrainingCenter = ({ user, deck }) => {
  const router = useRouter();
  const contentType = 'application/json'

  const [message, setMessage] = useState('');
  const deckID = router.query.deck;
  const [randItem, setRandItem] = useState({});
  const [isStarred, setIsStarred] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [itemGroup, setItemGroup] = useState('all');
  const [filteredData, setFilteredData] = useState(deck.items);
  const [needNewCard, setNeedNewCard] = useState(false);
  const [field, setField] = useState('answer')
  const [starredOnly, setStarredOnly] = useState(false);
  const [cardsAvailable, setCardsAvailable] = useState(false);
  // let filteredData = [];

  useEffect(() => {
    if (isLoading) return;
    setIsLoading(true);
    setCardsAvailable(false);

    //console.log(imageSet.images[1926]); //outdated 'starred' but correct name and recentAttempts?
    //console.log(filteredData.filter(el => el.imageItem.includes("nightshade"))); //correct

    //const filterData = () => {
    let newSet = [...deck.items];
    if (itemGroup !== 'all') newSet = newSet.filter(item => getConfidenceLevel(item.recentAttempts) === parseInt(itemGroup));
    if (starredOnly) newSet = newSet.filter(item => item.starred)
    setFilteredData(newSet, starredOnly);
    // }

    //  filterData();

    if (filteredData.length) {
      getItem();
      toggleRotate(null, true);
      setIsEditable(false);
      setMessage('');
      setCardsAvailable(true);
    } else {
      setMessage('There are no cards of this type! Choose another.');
      // setCardsAvailable(false);
    }
    setNeedNewCard(false);
    setIsLoading(false);

  }, [needNewCard]);

  const toggleRotate = (e, toFront = false) => {
    if (!isEditable) {
      if (toFront || (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'svg' && e.target.tagName !== 'path')) {   //if it's called in getNextImage or is not triggered via the button, then we consider toggle

        if ((toFront && document.querySelectorAll('.card-flip').length > 0 && document.querySelectorAll('.card-flip')[0].classList.contains("[transform:rotateY(180deg)]")) || !toFront) {
          document.querySelectorAll('.card-flip').forEach(card => card.classList.toggle('[transform:rotateY(180deg)]'));
        }

      }
    }
  }

  const getGroupTotals = () => {
    // console.log("getting group totals - this means page has refreshed") //this happens when you change select, when you click Start, when you click submit, when you press correct
    let result = [];
    for (let i = 0; i < confidenceLabels.length; i++) {
      const group = deck.items.filter(item => getConfidenceLevel(item.recentAttempts) === parseInt(i))
      result.push(group.length);
    }
    return result;
  }

  const groupTotals = getGroupTotals();


  function handleKeyDown(e) {
    e.stopPropagation();

    if (e.keyCode === 39) setNeedNewCard(true);

  }



  const handleStartTraining = () => {
    //get random item from set

    document.addEventListener('keydown', handleKeyDown)

    setNeedNewCard(true)
    setIsStarted(true)

  }

  const handleNextItem = (e) => {
    e.preventDefault();
    e.target.blur();
    setNeedNewCard(true);
  }


  const getItem = () => {
    //get random item from set

    const randIndex = Math.floor(Math.random() * filteredData.length);
    setRandItem(filteredData[randIndex]);
    setIsStarred(filteredData[randIndex].starred)
  }


  const handleEdit = (e, field) => {
    //Now entering editable mode
    e.stopPropagation();
    setIsEditable(true);
    setField(field);
  }

  const handleCorrect = (e) => {
    e.stopPropagation();
    addToRecentAttempts(true);
    setNeedNewCard(true);
  }

  const handleIncorrect = (e) => {
    e.stopPropagation();
    addToRecentAttempts(false);
    setNeedNewCard(true);
  }

  const addToRecentAttempts = async (isCorrect) => {

    //create the property if it doesn't exist
    if (!randItem.recentAttempts) randItem.recentAttempts = [];

    //cap at 7 attempts
    if (randItem.recentAttempts.length === 7) randItem.recentAttempts.shift();

    randItem.recentAttempts.push(isCorrect ? 1 : 0);

    try {

      const res = await fetch(`/api/decks/${deckID}`, {
        method: 'PUT',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(randItem),
      })

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status)
      }
      const { data } = await res.json()


      const level = document.getElementById("selSet").value;
      setItemGroup(level)     //this makes sure the categories are updated, I think this works by causing a re-render which causes updating of groupTotals

    } catch (error) {
      setMessage(error + 'Failed to save training data')
    }

  }

  const handleSubmitEdit = async (e, field, item) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditable(false);

    if (field === 'question') {
      randItem.question = item;
    } else if (field === 'answer') {
      randItem.answer = item

    } else if (field === 'URL') {
      randItem.URL = item

    } else {

      if (randItem.starred === undefined) randItem.starred = false;
      randItem.starred = !randItem.starred
      setIsStarred(randItem.starred)

    }


    try {

      const res = await fetch(`/api/decks/${deckID}`, {
        method: 'PUT',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(randItem),
      })

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status)
      }
      const { data } = await res.json()

    } catch (error) {
      setMessage('Failed to save training data')
    }

    //   refreshData();


  }


  const handleChangeSelect = () => {
    const level = document.getElementById("selSet").value;
    setItemGroup(level)
    setNeedNewCard(true);
  }

  const handleToggleStar = async (id) => {

    if (randItem.starred === undefined) randItem.starred = false;
    randItem.starred = !randItem.starred;

    setIsStarred(randItem.starred)

    try {

      const res = await fetch(`/api/decks/${deckID}`, {
        method: 'PUT',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(randItem),
      })

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status)
      }
      const { data } = await res.json()

    } catch (error) {
      setMessage('Failed to toggle star - ' + error)
    }
  }

  const handleToggleStarredDisplay = () => {
    setStarredOnly(!starredOnly);
    setNeedNewCard(true)
  }

  return (
    <>
      <div className="z-10 justify-between font-mono text-lg max-w-5xl w-full ">
        <h1 className="py-2 font-mono text-4xl">Training Center</h1>
        <p className="font-mono">Hello {user.nickname} - there are {deck.items.length} items in this set.</p>

        {deck && !isLoading &&
          <>
            <div className="flex flex-col justify-center items-center">
              <div className="mt-10 font-mono text-3xl">{deck.name}</div>

              <div>
                <p>Which items do you want to train?</p>

                <select id="selSet" className="w-full rounded-md" onChange={handleChangeSelect}>
                  <option value="all">All 🌍</option>
                  {confidenceLabels.map((label, i) => <option value={i}>{label} ({groupTotals && groupTotals[i]})</option>)}
                </select>
              </div>

              <div>Starred only? <input type="checkbox" value="false" onChange={handleToggleStarredDisplay}></input></div>

              {!isStarted && <button onClick={handleStartTraining} className="w-40 btn bg-white text-black font-bold mt-3 mx-0.5 py-1 px-4 rounded focus:outline-none focus:shadow-outline">Start</button>}
              {isStarted && cardsAvailable &&
                <div className="flex flex-col justify-center items-center">

                  <div class="group [perspective:1000px]">
                    <div class="z-3 relative m-2 h-40 w-60 lg:h-80 lg:w-96 rounded-xl shadow-xl">
                      <div id="card-front" onClick={(e) => toggleRotate(e, false)} className="card-flip absolute inset-0 rounded-xl border-4 border-slate-700 bg-white [backface-visibility:hidden]">
                        <div class="flex-col rounded-xl px-12 bg-white text-center text-black absolute top-0 left-0 w-full h-full flex items-center justify-center">
                          <h1 class="text-3xl font-bold">{randItem.question}</h1>
                        </div>
                      </div>
                      <div id="card-back" onClick={(e) => toggleRotate(e, false)} className="card-flip absolute inset-0 h-full w-full  rounded-xl [transform:rotateY(180deg)] [backface-visibility:hidden]">
                        <div class="flex-col rounded-xl bg-black/60 px-12  text-center text-slate-200 absolute top-0 left-0 w-full h-full flex items-center justify-center">
                          <h1 class="text-3xl font-bold">{isEditable ? <QuickEditForm formId="quick-edit-form" field={field} name={randItem.question} item={field === 'answer' ? randItem.answer : randItem.URL} handleSubmitEdit={handleSubmitEdit} /> : randItem.answer}</h1>

                          <h5><TrafficLights recentAttempts={randItem.recentAttempts} /></h5>
                          <ConfidenceLevel recentAttempts={randItem.recentAttempts} />

                        </div>
                        {randItem.starred ? <FontAwesomeIcon onClick={() => handleToggleStar(randItem._id)} className='absolute top-7 left-3 text-yellow-500' icon={faStar} /> : <FontAwesomeIcon onClick={() => handleToggleStar(randItem._id)} className='absolute top-7 left-3 text-white' icon={faStarOutline} />}
                        {/* {isStarred ? <FontAwesomeIcon onClick={(e) => handleSubmitEdit(e, "starred", null)} className='absolute top-7 left-3 text-yellow-500' icon={faStar} />  : <FontAwesomeIcon onClick={(e) => handleSubmitEdit(e, "starred", null)} className='absolute top-7 left-3 text-white' icon={faStarOutline} /> } */}
                        {isEditable ? <></> : <><FontAwesomeIcon className='cursor-pointer absolute left-3/4 top-3/4 text-white h-6 lg:h-8' icon={faEdit} onClick={(e) => handleEdit(e, 'answer')} /><FontAwesomeIcon className='absolute cursor-pointer left-[87%] top-3/4 text-white h-6 lg:h-8' icon={faImage} onClick={(e) => handleEdit(e, 'URL')} /></>}
                        <img class="h-full w-full rounded-xl object-cover shadow-xl shadow-black/40" src={randItem.URL && randItem.URL.length > 0 ? randItem.URL : "https://media.istockphoto.com/id/1413965439/vector/irregular-background-monochrome.jpg?s=612x612&w=0&k=20&c=awzhQiuEZg-U8xL_l-wzRehEqSbfgAoyGnPogzn-zU8="} alt="" />
                      </div>
                    </div>
                  </div>
                  <div className={isEditable ? "invisible" : "flex flex-col items-center"}>
                    <FontAwesomeIcon className='cursor-pointer h-10 w-40 btn bg-green-400 hover:bg-green-500 text-white font-bold mt-3 mx-0.5 py-1 px-4 rounded focus:outline-none focus:shadow-outline' onClick={handleCorrect} icon={faCheck} />
                    <FontAwesomeIcon className='cursor-pointer h-10 w-40 btn bg-red-400 hover:bg-red-500 text-white font-bold mt-3 mx-0.5 py-1 px-4 rounded focus:outline-none focus:shadow-outline' onClick={handleIncorrect} icon={faXmark} />
                    <button onClick={(e) => handleNextItem(e)} className="w-40 btn bg-white text-black font-bold mt-3 mx-0.5 py-1 px-4 rounded focus:outline-none focus:shadow-outline">Next</button>
                  </div>
                </div>
              }
            </div>
          </>
        }
        <div>{message}</div>
      </div>

    </>
  )
}

export default TrainingCenter;

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async (ctx) => {

    const id = ctx.query.deck
    {/* const id = req.params.imageSet; */ }
    const auth0User = await getSession(ctx.req, ctx.res);
    await dbConnect()

    // Fetch the user from the db (by email)
    // let user = await SiteUser.findOne({ where: { email: auth0User?.user.email } });

    let user;
    // You might want to move the creation of the user somewhere else like afterCallback
    // Checkout https://auth0.github.io/nextjs-auth0/modules/handlers_callback.html
    if (!user) {
      // user = db.user.create(auth0User?.user);  //EVENTUALLY SOMETHING LIKE THIS
      user = (auth0User).user
    }


    /* find this deck */
    const result = await Deck.findOne({ _id: id })
    const deckToPass = JSON.parse(JSON.stringify(result))


    return { props: { user: user, deck: deckToPass } }

  }
})


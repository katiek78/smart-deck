import { withPageAuthRequired, getSession} from "@auth0/nextjs-auth0";
import { useState, useEffect } from "react";
import { mutate } from 'swr'
import { useRouter } from 'next/router'
import dbConnect from "@/lib/dbConnect";
import Deck from "@/models/Deck";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faDumbbell, faEdit, faGrip, faList, faPlus, faStar, faTrash} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons"
import { refreshData } from "@/lib/refreshData";
import TrafficLights from "@/components/TrafficLights";
import ConfidenceLevel from "@/components/ConfidenceLevel";

const DeckPage = ({user, allItems, decks}) => {
    const router = useRouter()    
    const contentType = 'application/json'
    const [deck, setDeck] = useState({});
    const [currentPage, setCurrentPage] = useState(1);    
    const [message, setMessage] = useState('')
    const [totalItems, setTotalItems] = useState(allItems.items.length)
    
    const [isListView, setIsListView] = useState(true);
    const [isEditable, setIsEditable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  
    const [itemForm, setItemForm] = useState({})
    
    const pageLimit = 20;

    const getDeck = async (id) => {

      //get deck from DB
      const res = await fetch(`/api/decks/${id}/${currentPage-1}`, {
        method: 'GET',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
      })
      const data = await res.json();
      console.log(data.data)
      setDeck(data.data);
     
      setItemForm({name: data.data.name, items: data.data.items } )
     
    }
    
    useEffect(() => {
      setIsLoading(true);
      const id = router.query.id
      //get image set here
    
    
        getDeck(id);

      setIsLoading(false);
    }, [currentPage]);


    const renderPageNumbers = () => {   
    
      if (isEditable || totalItems <= pageLimit) return <div className="mt-3 mx-0.5 h-10"></div> 
        let div = [];
        const BUTTON_MAX = 10; //how many buttons are shown before there should be a '...'
        const totalButtons = Math.ceil(totalItems / pageLimit);
        const buttonsToBeShown = Math.min(BUTTON_MAX, totalButtons) //lower of maximum and total buttons
        const isEven = BUTTON_MAX % 2 === 0
        const numberToShowBeforeCurrentPage = isEven ? BUTTON_MAX / 2 + 1 : (BUTTON_MAX - 1)/2   //6 when we have 10 buttons max
    
        //const firstButton = (currentPage <= numberToShowBeforeCurrentPage) ? 0 : currentPage - numberToShowBeforeCurrentPage 
        let firstButton;
        if (currentPage <= numberToShowBeforeCurrentPage) {
          firstButton = 0
        } else if (currentPage > totalButtons - BUTTON_MAX + numberToShowBeforeCurrentPage) { // unless we are in last BUTTON_MAX-nts buttons because then there are none showing after
          firstButton = totalButtons - BUTTON_MAX;
        } else firstButton = currentPage - numberToShowBeforeCurrentPage
        
        const lastButton = Math.min(firstButton + buttonsToBeShown - 1, totalButtons - 1);
       
        const isThereMoreAtEnd = lastButton < totalButtons - 1;
        const isThereMoreAtStart = firstButton > 0;

        if (isThereMoreAtStart) {
          let i = 0;
          // const firstInRange = allItems.items[i*pageLimit].question;
          // const lastInRange = i*pageLimit + pageLimit - 1 < allItems.items.length ? allItems.items[i*pageLimit + pageLimit - 1]?.question : allItems.items[allItems.items.length - 1].question;
          div.push(<button className='btn bg-black hover:bg-gray-700 text-white font-bold mt-3 mx-0.5 py-1 px-4 rounded focus:outline-none focus:shadow-outline' onClick={() => handlePageChange(i+1)} key={i+1}>{i+1}</button>);
          div.push(" ... ");
        
        }

        for (let i = firstButton; i <= lastButton; i++) { 
            // const firstInRange = allItems.items[i*pageLimit]?.question;
            // const lastInRange = i*pageLimit + pageLimit - 1 < allItems.items.length ? allItems.items[i*pageLimit + pageLimit - 1]?.question : allItems.items[allItems.items.length - 1].question;
            if (i === currentPage - 1) {
                div.push(<button className='btn bg-white text-black font-bold mt-3 mx-0.5 py-1 px-4 rounded focus:outline-none focus:shadow-outline' onClick={() => handlePageChange(i+1)} key={i+1}>{i+1}</button>);
            } else div.push(<button className='btn bg-black hover:bg-gray-700 text-white font-bold mt-3 mx-0.5 py-1 px-4 rounded focus:outline-none focus:shadow-outline' onClick={() => handlePageChange(i+1)} key={i+1}>{i+1}</button>);
        }

        if (isThereMoreAtEnd) {
          div.push(" ... ");
          let i = totalButtons - 1;
          // const firstInRange = allItems.items[i*pageLimit].question;
          // const lastInRange = i*pageLimit + pageLimit - 1 < allItems.items.length ? allItems.items[i*pageLimit + pageLimit - 1]?.question : allItems.items[allItems.items.length - 1].question;
          div.push(<button className='btn bg-black hover:bg-gray-700 text-white font-bold mt-3 mx-0.5 py-1 px-4 rounded focus:outline-none focus:shadow-outline' onClick={() => handlePageChange(i+1)} key={i+1}>{i+1}</button>);
        }

        let jump;
        if (totalItems.length > 1000) {
          jump = 500
        } else if (totalItems.length > 100) {
          jump = 100;
        };

        // const options = totalItems.map((item, index) => {
        //   if (index % jump === 0) {
        //     const entryNumber = index / pageLimit;
        //     return (
        //       <option key={entryNumber} value={entryNumber + 1}>
        //         {entryNumber}
        //       </option>
        //     );
        //   }
        //   return null;
        // });

        const options = [];
        for (let entryNumber = 0; entryNumber < totalButtons; entryNumber += jump) {
          options.push(
            <option key={entryNumber} value={entryNumber + 1}>
              {entryNumber}
            </option>
          );
        }

        if (jump) div.push(<><span>  Jump to: </span>
        <select id="entry" onChange={() => handlePageChange(document.getElementById("entry").options[document.getElementById("entry").selectedIndex].value)}>
          {/* Add default option   <option value="">-- Select an option --</option> */}          
          {options}
        </select></>)
        return div;
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
      }

    // const putDataPopulate = async (populateForm) => {
      
    //     const imageArray = getPopulatedImageArray(populateForm.setType);
        
    //     const { id } = router.query
    //     try {
    //       setImageForm({...imageForm, items: imageArray})
    //       const res = await fetch(`/api/itemsets/${id}`, {
    //         method: 'PUT',
    //         headers: {
    //           Accept: contentType,
    //           'Content-Type': contentType,
    //         },
    //         body: JSON.stringify({...deck, items: imageArray}),
    //       })
    
    //       // Throw error with status code in case Fetch API req failed
    //       if (!res.ok) {
    //         throw new Error(res.status)
    //       }
    
    //       const { data } = await res.json()
    
    //       mutate(`/api/itemsets/${id}`, data, false) // Update the local data without a revalidation
    //       refreshData(router);          
          
    //     } catch (error) {
    //       setMessage('Failed to add items to set')
    //     }
    //   }

      const putDataItems = async (itemForm) => {

        // function replaceElementsWithNewitems(originalArray, i, newitems) {
                 
        //   // Replace elements starting from index `i`
        //   for (let j = 0; j < newitems.length; j++) {
        //     if (i + j < originalArray.length) {
        //       originalArray[i + j] = newitems[j];
        //     } else {
        //       originalArray.push(newitems[j]);
        //     }
        //   }
        
        //   return originalArray
        // }
       
       // replaceElementsWithNewitems
          
       const { id } = router.query       
      
       try {
         
         const res = await fetch(`/api/decks/${id}/${currentPage}`, {
           method: 'PUT',
           headers: {
             Accept: contentType,
             'Content-Type': contentType,
           },
           body: JSON.stringify({name: itemForm.name, items: itemForm.items}),
         })
   
         // Throw error with status code in case Fetch API req failed
         if (!res.ok) {
           throw new Error(res.status)
         }
   
         const { data } = await res.json()
   
   //      mutate(`/api/itemsets/${id}`, data, false) // Update the local data without a revalidation
     //    refreshData(router);
       } catch (error) {
         setMessage('Failed to update items')
       }
     }
    

      const handleChangeItemForm = (e) => {
        const target = e.target     
        const value = target.value
        const name = target.name
       
        const updatedForm = { ...itemForm };        
        const isURL = name.includes("URL");
        let thisIndex;        
        if (isURL) {
            thisIndex = name.slice(6) % pageLimit; 
            updatedForm.items[thisIndex].URL = value;
        } else if (name.includes("Question")) {
            thisIndex = name.slice(11) % pageLimit;
            updatedForm.items[thisIndex].question = value;     
        } else {
          thisIndex = name.slice(9) % pageLimit;
          updatedForm.items[thisIndex].answer = value;  
        }
        setItemForm(updatedForm);
    }

  // const handleChangePopulateForm = (e) => {
  //   const target = e.target
  //   const value = target.value
  //   const name = target.name

  //   setPopulateForm({
  //     ...populateForm,
  //     [name]: value,
  //   })
  // }

  const handleChangeTitle = (e) => {
    setItemForm({...itemForm, name: e.target.value})    
  }


//   /* Makes sure image set info is filled */
//   const formValidate = () => {
//     let err = {}
//     if (!form.name) err.name = 'Name is required'
   
//     return err
//   }

    // const handleSubmitPopulateForm = (e) => {
    //     e.preventDefault()
        
    //     putDataPopulate(populateForm)
       
    //   }

      const handleSubmitItemForm = (e) => {
        e.preventDefault()
        
        putDataItems(itemForm)
        setIsEditable(false);
      }

    const handleToggleEditable = () => {
        setIsEditable(!isEditable);
        setIsListView(true);
    }

    const handleToggleListView = () => {
        setIsListView(!isListView);
    }

    const handleTraining = () => {
        router.push("/training?deck=" + deck._id)
    }

    const toggleRotate = (e, toFront = false) => {
        if (!isListView) {
           if (toFront || (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'svg' && e.target.tagName !== 'path')) {   //if it's called in getNextImage or is not triggered via the button, then we consider toggle
       
           if ((toFront && document.querySelectorAll('.card-flip').length > 0 && document.querySelectorAll('.card-flip')[0].classList.contains("[transform:rotateY(180deg)]")) || !toFront) {
                 document.querySelectorAll('.card-flip').forEach(card => card.classList.toggle('[transform:rotateY(180deg)]'));
               }
 
             }
     }
   }

   const handleAddNew = async () => {
    try {

      const res = await fetch(`/api/decks/${deck._id}/addItems`, {
        method: 'PUT',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },        
      })

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status)
      }
      //const { data } = await res.json()
  
    } catch (error) { 
      setMessage('Failed to add item')
    }

    //add new item to db

    // const newDeck = {...deck};
    // newDeck.items.push({});
    // setDeck(newDeck);

      // change it in the form
      //const updatedForm = { ...itemForm };            
      //updatedForm.push({});

    setCurrentPage(Math.ceil((totalItems + 1) / pageLimit));
    await getDeck(deck._id) //this sets the deck (based on db) and item form
    //when we add new item we don't have enough fields in item form?
    console.log("item form:")
    console.log(itemForm)
    //refreshData(router) 
    setTotalItems(totalItems + 1)
   
    setIsEditable(true);
   
   }


function findIndexById(array, id) {
  for (let i = 0; i < array.length; i++) {
    if (array[i]._id === id) {
      return i;
    }
  }
  return -1;
}

   const handleDelete = async (id) => {
    const thisItem = deck.items.filter(el => el._id === id)[0];    
    if (!thisItem) return;
       
    try {

      const res = await fetch(`/api/decks/${deck._id}/deleteItem`, {
        method: 'PUT',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify({itemIDToDelete: id}),
      })

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status)
      }
      const { data } = await res.json()

    //   // change it in the form
    // const updatedForm = { ...itemForm };            
    // const thisIndex = findIndexById(updatedForm.items, id);
    // if (thisIndex !== -1) {
    //   updatedForm.items.splice(thisIndex, 1); // Remove the item at thisIndex
    // }

    
    setCurrentPage(Math.ceil((totalItems - 1) / pageLimit));
    await getDeck(deck._id) //this sets the deck (based on db) and item form


    setTotalItems(totalItems - 1)
   // setItemForm(updatedForm);
    // setDeck(updatedDeck);

    //go to previous page if we are on last page which now has 0 items
    //if (deck.items.length === 0) setCurrentPage(currentPage - 1)
    
  
    } catch (error) { 
      setMessage('Failed to delete item' + error)
    }
   }



   const handleToggleStar = async (id) => {
    const thisItem = deck.items.filter(el => el._id === id)[0];    
    if (!thisItem) return;
    if (thisItem.starred === undefined) thisItem.starred = false;
    thisItem.starred = !thisItem.starred;
    
    //change it in the form as well
      function findIndexById(array, id) {
        for (let i = 0; i < array.length; i++) {
          if (array[i]._id === id) {
            return i;
          }
        }
        return -1;
      }

    const updatedForm = { ...itemForm };            
    const thisIndex = findIndexById(updatedForm.items, id);
    if (thisIndex) updatedForm.items[thisIndex].starred = thisItem.starred
   
    setItemForm(updatedForm);
    
    try {

      const res = await fetch(`/api/decks/${deck._id}`, {
        method: 'PUT',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(thisItem),
      })

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status)
      }
      const { data } = await res.json()
  
    } catch (error) { 
      setMessage('Failed to save item')
    }
   }

// const handlePhoneticsChange = (e) => {
//   const target = e.target
//   const value = target.value
//   setPhoneticsType(value);
// }

// const handleImportPhoneticsChange = (e) => {
//   const target = e.target
//   const value = target.value
//   const name = target.name

// //setting form correctly

// setImportitemsForm({
//       ...importitemsForm,
//   [name]:name === 'overwrite' ? target.checked : value,
//    })
  
// }


// const handleShowPhoneticsDiv = () => {
//   setIsShowingPhoneticsDiv(true);
// }

// const handleCancelPhonetics = () => {
//   setIsShowingPhoneticsDiv(false);
// }

// const handleShowImportPhoneticsDiv = () => {
//   setIsShowingImportPhoneticsDiv(true);
// }

// const handleCancelImportPhonetics = () => {
//   setIsShowingImportPhoneticsDiv(false);
// }

// const handleSubmitPhonetics = async (e) => {    
//   e.preventDefault();
//   const phoneticsArray = getPopulatedPhoneticsArray(itemForm.setType, phoneticsType);

//   try {
//     const res = await fetch(`/api/itemsets/${deck._id}/phonetics`, {
//       method: 'PUT',
//       headers: {
//         Accept: contentType,
//         'Content-Type': contentType,
//       },
//       body: JSON.stringify(phoneticsArray),
//     })

//     // Throw error with status code in case Fetch API req failed
//     if (!res.ok) {
//       throw new Error(res.status)
//     }

//     const updateditemset = { ...deck };
//     const updateditems = updateditemset.items.map((image, index) => ({
//       ...image,
//       phonetics: phoneticsArray[index],
//     }));
//     updateditemset.items = updateditems;
//     setitemset(updateditemset);
    
//   } catch (error) {
//     setMessage('Failed to update image set')
//   }
// }

// const handleSubmitImportPhonetics = async (e) => {    
//   e.preventDefault();
//        const fromID = importitemsForm.itemsetFrom;


    
//     try {
         
   

//       const res = await fetch(`/api/itemsets/${deck._id}/importitems`, {
//         method: 'PUT',
//         headers: {
//           Accept: contentType,
//           'Content-Type': contentType,
//         },
//         body: JSON.stringify({sourceSetID: fromID, overwrite: importitemsForm.overwrite}),
//       })

//       // Throw error with status code in case Fetch API req failed
//       if (!res.ok) {
//         throw new Error(res.status)
//       }

//       const { data } = await res.json()

//      getDeck(deck._id);
     
//     } catch (error) {
//       setMessage('Failed to update items.' + error)
//     }
  
// }

    return(
 <>
    <div className="z-10 justify-between font-mono text-lg max-w-5xl w-full ">
    <h1 className="py-2 font-mono text-5xl">{isEditable ? <input onChange={handleChangeTitle} className='text-4xl' size='50' value={itemForm.name}></input> : itemForm.name}</h1> 
    
    <div className="flex flex-row">
        <div className={isEditable ? "invisible flex flex-row basis-1/4" : "flex flex-row basis-1/3"}>        
            <div className="">
            <FontAwesomeIcon className={isListView ? "px-3 rounded bg-white text-black text-6xl" : "px-3 text-gray-100 hover:text-gray-700 hover:cursor-pointer"} onClick={handleToggleListView} icon={faList} size="3x" />
            </div>
            <div className="ml-2">
            <FontAwesomeIcon className={isListView ? "px-3 text-gray-100 hover:text-gray-700 hover:cursor-pointer" : "px-3 rounded bg-white text-black text-6xl"} onClick={handleToggleListView} icon={faGrip} size="3x" />        
            </div>
        </div>

        <div className="basis-1/4">
        {isEditable ? 
        <FontAwesomeIcon className="hover:text-gray-700 hover:cursor-pointer" onClick={handleSubmitItemForm} icon={faCheck} size="3x" />
        : <FontAwesomeIcon className="hover:text-gray-700 hover:cursor-pointer" onClick={handleToggleEditable} icon={faEdit} size="3x" />
        }
        </div>

        <div className="basis-1/4">
        {!isEditable && 
        <FontAwesomeIcon className="hover:text-gray-700 hover:cursor-pointer" onClick={handleAddNew} icon={faPlus} size="3x" />        
        }
        </div>

        <div className="basis-1/4">
        {!isEditable && 
        <FontAwesomeIcon className="hover:text-gray-700 hover:cursor-pointer" onClick={handleTraining} icon={faDumbbell} size="3x" />        
        }
        </div>
    </div>
   
    <div>{renderPageNumbers()}</div>

    {isListView &&
    <div className="mt-6 w-full grid lg:grid-cols-8 gap-x-4 gap-y-10">
    <div className="col-span-1 lg:col-span-2 font-bold">Question</div>
    <div className="col-span-1 lg:col-span-2 font-bold">Answer</div>                    
            <div className="col-span-1 lg:col-span-2 font-bold">Picture URL</div>
            <div className="col-span-2"> </div>            
      {!isLoading && deck && deck.items && deck.items.length > 0 && deck.items.map((item,i) => {
        if (isEditable) {
            return <>         
            <div key={item._id} className="col-span-1 lg:col-span-2 font-bold text-xl"> <input onChange={handleChangeItemForm} value={item.question ? item.question : ''} id={'inpQuestion' + (i + (currentPage-1)*pageLimit)} name={'inpQuestion' + (i + (currentPage-1) * pageLimit)}></input></div>
            <div className="col-span-1 lg:col-span-2 "><input onChange={handleChangeItemForm} value={item.answer ? item.answer : ''} id={'inpAnswer' + (i + (currentPage-1)*pageLimit)} name={'inpAnswer' + (i + (currentPage-1) * pageLimit)}></input></div>
            <div className="col-span-1 lg:col-span-2 "><input onChange={handleChangeItemForm} value={item.URL ? item.URL : ''} id={'inpURL' + (i + (currentPage-1)*pageLimit)} name={'inpURL' + (i + (currentPage-1) * pageLimit)}></input></div>
            <div className="col-span-1"> {item.starred ? <FontAwesomeIcon onClick={() => handleToggleStar(item._id)} className='text-yellow-500' icon={faStar} />  : <FontAwesomeIcon onClick={() => handleToggleStar(item._id)} className='text-black' icon={faStarOutline} /> }</div>            
            <div className="col-span-1"> <FontAwesomeIcon onClick={() => handleDelete(item._id)} icon={faTrash} />  </div>            
            </>
        } else return <>
        <div className="col-span-1 lg:col-span-2 font-bold text-xl">{item.question}</div>
        <div className="col-span-1 lg:col-span-2 ">{item.answer}</div>
        <div className="col-span-1 lg:col-span-2 ">{item.URL && item.URL.length && <img className='h-8' src={item.URL}></img>}</div>
        <div className="col-span-1"> {item.starred ? <FontAwesomeIcon onClick={() => handleToggleStar(item._id)} className='text-yellow-500' icon={faStar} />  : <FontAwesomeIcon onClick={() => handleToggleStar(item._id)} className='text-black' icon={faStarOutline} /> }</div>
        <div className="col-span-1"> <FontAwesomeIcon onClick={() => handleDelete(item._id)} icon={faTrash} />  </div>    
        </>
      })
    }
    
    </div>
    }   

    {!isListView &&
    
        <div className="flex flex-wrap">
    {/* Create a card for each item */}
   
    {!isLoading && deck && deck.items && deck.items.length > 0 && deck.items.map((item) => (
      <>

      <div class="group [perspective:1000px]">
    <div class="z-3 relative m-2 h-40 w-60 rounded-xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
      <div class="absolute inset-0 rounded-xl border-4 border-slate-700 bg-white [backface-visibility:hidden]">
      <div class="flex-col rounded-xl px-12  text-center text-black absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <h1 class="text-3xl font-bold">{item.question}</h1>         
        </div> 
      </div>
      <div class="absolute inset-0 h-full w-full  rounded-xl  [transform:rotateY(180deg)] [backface-visibility:hidden]">
         <div class="flex-col rounded-xl bg-black/60 px-12  text-center text-slate-200 absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <h1 class="text-3xl font-bold">{item.answer}</h1>
          <h5 class="mt-3 text-2xl"><TrafficLights recentAttempts={item.recentAttempts} /></h5>   
          <ConfidenceLevel recentAttempts={item.recentAttempts} />  
          {item.starred ? <FontAwesomeIcon onClick={() => handleToggleStar(item._id)} className='absolute top-7 left-3 text-yellow-500' icon={faStar} />  : <FontAwesomeIcon onClick={() => handleToggleStar(item._id)} className='absolute top-7 left-3 text-white' icon={faStarOutline} /> }      
        </div> 
        <img class="h-full w-full rounded-xl object-cover shadow-xl shadow-black/40" src={item.URL && item.URL.length > 0 ? item.URL : "https://media.istockphoto.com/id/1413965439/vector/irregular-background-monochrome.jpg?s=612x612&w=0&k=20&c=awzhQiuEZg-U8xL_l-wzRehEqSbfgAoyGnPogzn-zU8="} alt="" />
      </div>
    </div>
  </div>
     
 </>
    ))}
    </div>

    
    
    }

    {!isLoading && allItems.items.length === 0 && 
    <>
    <p>You have not added any items to this deck. </p><br />
     </>
    }

<div>{message}</div>

    {/* Add a button to add an image manually */}
  </div>

</>


    );

}

export default DeckPage

export const getServerSideProps = withPageAuthRequired({
    getServerSideProps: async ({ params, req, res }) => {
    const auth0User = await getSession(req, res);
    const user = auth0User.user;
    await dbConnect()
  
    const allItems = await Deck.findOne({_id: params.id}, {items: {question: 1}});   
    const serializedItems = JSON.parse(JSON.stringify(allItems))


    return { props: { user, allItems:serializedItems }}
  }
})
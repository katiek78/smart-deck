import DeckForm from "@/components/DeckForm"

const NewSystem = () => {
  const systemForm = {
    name: ''
  }

  return (
    <>
    <div className="z-10 justify-between font-mono text-lg max-w-5xl w-full ">
    <h1 className="py-2 font-mono text-4xl">New system</h1>
  <DeckForm formId="add-system-form" systemForm={systemForm} />
  </div>
  </>
  )
}

export default NewSystem

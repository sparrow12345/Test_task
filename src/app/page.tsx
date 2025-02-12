import FormComponent from "@/components/formComponent";
// import './globals.css';


export default function Home() {
  const form = {
    title: '',
    description: '',
    tags: [],
    budgetRangeMin: null,
    budgetRangeMax: null,
    deadline: null,
    reminders: null,
    rules: {},
    token: '',
};
return(
    <main className='mx-auto  min-h-screen w-full bg-gray-400 text-black'>
      <div className='mx-auto max-w-2xl pt-20'>
        <FormComponent form = {form}/>
      </div>
    </main>
)
}

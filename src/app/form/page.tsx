import FormComponent from "@/components/formComponent";


export default function formPage() {
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
        <main className='text-gray-900'>
            <FormComponent form = {form}/>
        </main>
    )
}
'use client';
import { formProps } from '@/types/formObj';
import { FormEventHandler, useState } from 'react';
import toast from 'react-hot-toast';


const FormComponent: React.FC<formProps> = ({ form }) => {
  
  const [formTitle, setFormTitle] = useState<string>(form.title);
  const [formDescription, setFormDescription] = useState<string>(form.description);
  const [formTags, setFormTags] = useState<string[]>(form.tags || []);
  const [formBudgetRangeMin, setFormBudgetRangeMin] = useState<number|null>(form.budgetRangeMin);
  const [formBudgetRangeMax, setFormBudgetRangeMax] = useState<number|null>(form.budgetRangeMax);
  const [formDeadline, setFormDeadline] = useState<number|null>(form.deadline);
  const [formReminders, setFormReminders] = useState<number|null>(form.reminders);
  const [formRules, setFormRules] = useState<string>("");
  const [formToken, setFormToken] = useState<string>(localStorage.getItem('authToken') || "");
  
  const updateRange = (ranges: string) => {
    const parts = ranges.split("/");
  
    const range1 = parts[0]?.trim() || "";
    const range2 = parts[1]?.trim() || "";

    if (ranges.charAt(ranges.length - 1) == '/' && (range2 == "" || range2 == null)) {
      setFormBudgetRangeMin(range1 ? parseInt(range1, 10) : 0);
      setFormBudgetRangeMax(0.012);
    } else {
      setFormBudgetRangeMin(range1 ? parseInt(range1, 10) : null);
      setFormBudgetRangeMax(range2 ? parseInt(range2, 10) : null);
    }
  };

  const updateRangeWritten = (num1: number|null, num2: number| null) => {
    const range1 = num1 ?? ""; // First value or empty string
    const range2 = num2 ?? ""; // Second value or empty string
  
    if (range1 == "" && range2 == "") {
      return ""
    } else if (range2 == "") {
      return `${range1}`
    } else if (range2 == 0.012) {
      return `${range1}/0`
    } else return `${range1}/${range2}`
  };
  
  const formatRules = (rulesInput: string) => {
    const rulesObj: { [key: string]: string | number } | Record<string, never> = {};
  
    rulesInput.split(',').forEach(pair => {
      const [key, value] = pair.split(':').map(str => str.trim());
      if (key && value) {
          rulesObj[key] = isNaN(Number(value)) ? String(value) : Number(value); // Convert numeric values
      }
  });
    return JSON.stringify(rulesObj);
  };
  
  
  const submitForm = async (): Promise<{ success: boolean; data?: string; error?: string }> => {
    try {
      // Ensure required fields are filled
      if (!formTitle || !formDescription || !formToken) {
        return { success: false, error: "Title, description, and token are required." };
      }
  
      localStorage.setItem('authToken', formToken);
      // Construct API request URL
      const apiUrl = "https://deadlinetaskbot.productlove.ru/api/v1/tasks/client/newhardtask";
      const formattedRules = formatRules(formRules);
      const queryParams = new URLSearchParams({
        title: formTitle,
        description: formDescription,
        tags: formTags.join(","), // Convert array to comma-separated string
        budget_from: formBudgetRangeMin?.toString() || "0",
        budget_to: formBudgetRangeMax?.toString() || "0",
        deadline: formDeadline?.toString() || "1",
        reminds: formReminders?.toString() || "0",
        all_auto_responses: "false", // Assuming this is a constant
        rules: formattedRules, // Convert object to string
      });
  
      const queryString = new URLSearchParams(queryParams).toString();
      const encodedURL = `${apiUrl}?token=${formToken}&${queryString}`;
      console.log(`${apiUrl}?token=${formToken}&${queryString}`);
      // Send POST request
      const response = await fetch(`${encodedURL}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
  
      // Handle response
      const responseData = await response.json();
  
      if (response.ok && response.status==200) {
        return { success: true, data: responseData };
      } else {
        return { success: false, error: responseData.message || "Something went wrong" };
      }
    } catch (error) {
      console.error("Request failed:", error);
      return { success: false, error: "Failed to publish the task. Please try again." };
    }

  };
  

  const handleSubmitEditTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (formTitle.trim() === '') {
      toast.error("Title is required.");
      return;
    } else if (formDescription.trim() === '') {
      toast.error("description is required.");
      return;
    }

    const result = await submitForm();

    if (result.success) {
      toast.success("Task has been submitted!");
  
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500); // 1.5 seconds delay to let user see the toast
    } else {
      toast.error(result.error || "Submission failed.");
    }

  };

  return (
    <main className='flex min-h-screen flex-col justify-between p-10'>
      <form id='1' className='space-y-1' onSubmit={handleSubmitEditTodo}>
        <h4>Title:</h4>
        <input
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          type='text'
          placeholder={'Title'}
          className='h-30 input input-bordered w-full bg-gray-300'
        />
        <h4>Description:</h4>
        <textarea
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          placeholder={formDescription}
          className='input input-bordered h-40 w-full bg-gray-300 p-2' // p-2.5
        />

        <h4>Tags:</h4>
        <input
          type="text"
          value={formTags.join(", ")} // Convert array back to a comma-separated string for display
          onChange={(e) => setFormTags(e.target.value.split(", ")
                                        .map(tag => tag.trim()))} // Convert input to an array
          className="input input-bordered w-full bg-gray-300"
        />

        <h4>Budget Range (Min/Max format):</h4>
        <input
        type="text"
        value={
          updateRangeWritten(formBudgetRangeMin, formBudgetRangeMax)
        }
        onChange={(e) => updateRange(e.target.value)}
        className="input input-bordered w-full bg-gray-300"
        />

        <h4>Deadline:</h4>
        <input
          type="number"
          value={formDeadline ?? ""} // Convert array back to a comma-separated string for display
          onChange={(e) => setFormDeadline(parseInt(e.target.value) || 0)}
          className="input input-bordered w-full bg-gray-300"
        />

        <h4>Reminders:</h4>
        <input
          type="number"
          value={formReminders ?? ""} // Convert array back to a comma-separated string for display
          onChange={(e) => setFormReminders(parseInt(e.target.value) || 0)}
          className="input input-bordered w-full bg-gray-300 1"
        />

        <h4>Rules:</h4>
        <input
          type="text"
          value={formRules} // Convert array back to a comma-separated string for display
          onChange={(e) => setFormRules(e.target.value)}
          className="input input-bordered w-full bg-gray-300 1"
        />

        <h4>Token:</h4>
        <input
          type="text"
          value={formToken} // Convert array back to a comma-separated string for display
          onChange={(e) => setFormToken(e.target.value)}
          className="input input-bordered w-full bg-gray-300 1"
        />
  
        <div className='flex w-full justify-center'>
          <button
            type='submit'
            className='btn btn-primary mx-auto w-full text-white  bg-blue-500 hover:bg-blue-400
            inline-flex items-center justify-center rounded-md h-10 px-4 py-2 mt-6'
          >
            Edit Task
          </button>
        </div>
      </form>
    </main>
  );
};

export default FormComponent;

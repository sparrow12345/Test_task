export interface formObj {
    title: string,
    description: string,
    tags: string[],
    budgetRangeMin: number | null,
    budgetRangeMax: number | null,
    deadline: number | null,
    reminders: number | null,
    rules: string | "",
}

export interface formProps {
    form: formObj;
  }
export const mockExpense = {
  description: 'test expense',
  category: 'unexpected',
  amount: 20,
  date: '2022-10-27',
};

export const mockExpenseWithoutCategory = {
  description: 'test expense',
  amount: 20,
  date: '2022-09-27',
};

export const mockReturnedExpense = [
  {
    id: 1,
    description: 'test expense',
    category: 'unexpected',
    amount: 20,
    date: '2022-10-27',
    createdAt: '2022-10-27T17:54:16.584Z',
    updatedAt: '2022-10-27T17:54:16.584Z',
  },
];

export const mockUpdatedExpense = [
  {
    id: 1,
    description: 'test expense',
    category: 'unexpected',
    amount: 30,
    date: '2022-10-27',
    createdAt: '2022-10-27T17:54:16.584Z',
    updatedAt: '2022-10-27T17:54:16.584Z',
  },
];

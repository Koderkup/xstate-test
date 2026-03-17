import type { QuizQuestion } from '@/entities/quiz'

export const QUIZ_CONFIG: QuizQuestion[] | undefined = [
  {
    text: 'С каким градиентом производят разогрев аппаратов контура высокого давления?',
    correct: 'less-30',
    answers: [
      { id: 'less-30', label: 'Не более 30°C в час' },
      { id: 'less-40', label: 'Не более 40°C в час' },
      { id: 'less-50', label: 'Не более 50°C в час' },
    ],
  },
  {
    text: 'С каким градиентом производят набор давления в контуре высокого давления?',
    correct: 'less-60',
    answers: [
      { id: 'less-50', label: 'Не более 50кг/см² в час' },
      { id: 'less-60', label: 'Не более 60кг/см² в час' },
      { id: 'less-70', label: 'Не более 70кг/см² в час' },
    ],
  },
  {
    text: 'До какой температуры греют контур высокого давления?',
    correct: '150-160',
    answers: [
      { id: '150-160', label: '150-160°C' },
      { id: '160-170', label: '160-170°C' },
      { id: '170-180', label: '170-180°C' },
    ],
  },
]

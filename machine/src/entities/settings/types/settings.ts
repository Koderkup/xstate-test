// TODO: JSDoc
export interface Settings {
  storage: string
  colors: Record<
    string,
    `#${string}`
  >
  score: Record<
    | 'incorrect-trigger'
    | 'incorrect-action'
    | 'incorrect-answer'
    | 'forgotten-step'
    | 'penalty'
    | 'step-passed'
    | 'correct-answer',
    number
  >
  forceSelectOnStart?: boolean
}

export type UIRadioOptionValue = string | number | undefined

export interface UIRadioOption<V extends UIRadioOptionValue> {
  value: V
  label: string
}

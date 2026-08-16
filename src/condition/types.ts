export type ClimateHint = 'earth' | 'sap' | 'clay' | 'moss' | 'acid'

export type Authorship = 'authored' | 'collaborative' | 'contribution' | 'experiment'

export type TopologyNode = {
  slug: string
  title: string
  authorship: Authorship
  climateHint: ClimateHint
  dwellMs: number
  remembered: boolean
}

export type ConditionState = {
  climate: ClimateHint
  stillness: boolean
  reducedMotion: boolean
  occupancy: number
  attended: Record<string, TopologyNode>
  remembered: string[]
  path: Authorship[]
}

export const REMEMBER_KEY = 'sael.condition.remember'
export const SESSION_KEY = 'sael.condition.session'
export const ATTENDED_KEY = 'sael.condition.attended'

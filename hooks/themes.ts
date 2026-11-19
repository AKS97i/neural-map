import type { Palette } from './palette'

export const PRESET_NAMES = ['classic', 'night-city', 'netrunner', 'arasaka', 'monochrome'] as const
export type Preset = typeof PRESET_NAMES[number]
export const PRESET_LABELS: Record<Preset, string> = { classic: 'Classic', 'night-city': 'Night City', netrunner: 'Netrunner', arasaka: 'Arasaka', monochrome: 'Monochrome' }
export function presetOf(value: unknown): Preset { return PRESET_NAMES.includes(value as Preset) ? value as Preset : 'classic' }
export function nextPreset(value: unknown): Preset { return PRESET_NAMES[(PRESET_NAMES.indexOf(presetOf(value)) + 1) % PRESET_NAMES.length] ?? 'classic' }

const BASE: Palette = { ground: '#080c10', raised: '#0d1921', line: '#29414b', spoke: '#23414d', bone: '#e3eef2', ash: '#a3bdc9', dim: '#819ba8', accent: '#f4f444', hot: '#32e5ed', red: '#ff6274', mem: '#c99aff', memHot: '#e0c7ff', trail: '#6fc5d0' }
export const PRESETS: Record<Preset, Partial<Palette>> = {
  classic: {},
  'night-city': BASE,
  netrunner: { ...BASE, ground: '#061116', raised: '#0b2029', accent: '#32e5ed', hot: '#b4fbff', mem: '#70efa9', memHot: '#b6ffd5', trail: '#32e5ed' },
  arasaka: { ...BASE, ground: '#110a0e', raised: '#201219', line: '#543039', spoke: '#41252f', accent: '#ff6274', hot: '#ffb7c0', mem: '#f4c573', memHot: '#ffe0a6', trail: '#e28196' },
  monochrome: { ...BASE, ground: '#101214', raised: '#1b2024', line: '#424d54', spoke: '#36434b', accent: '#e3eef2', hot: '#ffffff', mem: '#b3c8d2', memHot: '#f2f7f9', trail: '#b3c8d2' },
}

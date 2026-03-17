import type { SchemeStateExact } from '@/entities/exercise'
import type { ExerciseTaskIdExact } from '@/entities/task'

export const STATE_CONFIG: Record<ExerciseTaskIdExact, SchemeStateExact> = {
  'engine-warm': {
    'Union': {
      range: 0,
    },
    'Union_2': {
      range: 0,
    },
    'Rectangle 8': {
      text: 0,
    },
    'valve_1': {
      color: 'red',
    },
    'valve_2_2': {
      color: 'red',
    },
    'valve_3': {
      color: 'red',
    },
    'Rectangle 6': {
      rotate: 0,
    },
    'Rectangle 1': {
      range: 100,
      color: 'red',
    },
    'Group 17_2': {
      color: 'red',
    },

    'button_oil': {
      status: 'Открыт',
    },
  },
  'engine-start': {
    'Union': {
      range: 10,
    },
    'Union_2': {
      range: 10,
    },
    'Rectangle 8': {
      text: 10,
    },
    'valve_1': {
      color: 'red',
    },
    'valve_2_2': {
      color: 'red',
    },
    'valve_3': {
      color: 'red',
    },
    'Rectangle 6': {
      rotate: 0,
    },
    'Rectangle 1': {
      range: 100,
      color: 'red',
    },
    'Group 17_2': {
      color: 'red',
    },
    'Rectangle 8_2': {
      text: 0,
    },
    'Rectangle 8_3': {
      text: 0,
    },

    'button_oil': {
      status: 'Закрыт',
    },
  },
  'hydraulic-test': {
    'button_1': { status: 'Открыт' },
    'button_2': { status: 'Открыт' },
    'button_3': { status: 'Открыт' },
    'button_5': { status: 'Открыт' },
    'button_6': { status: 'Открыт' },
    'button_7': { status: 'Открыт' },
    'button_8': { status: 'Открыт' },
    'button_9': { status: 'Открыт' },
    'button_10': { status: 'Открыт' },
    'button_11': { status: 'Открыт' },
    'button_12': { status: 'Открыт' },
    'button_14': { status: 'Открыт' },
    'button_16': { status: 'Открыт' },
    'button_17': { status: 'Открыт' },
    'button_18': { status: 'Открыт' },
    'button_19': { status: 'Открыт' },
    'button_20': { status: 'Открыт' },
    'button_21': { status: 'Открыт' },
    'button_22': { status: 'Открыт' },
    'button_96': { status: 'Открыт' },
    'button_97': { status: 'Открыт' },
    'button_98': { status: 'Открыт' },
    'button_99': { status: 'Открыт' },

    // Клапаны (индикаторы)
    'valve_1': { color: 'yellow' },
    'valve_2': { color: '#FD0000', range: 0 },
    'valve_3': { color: '#FD0000' },
    'valve_5': { color: '#FD0000' },
    'valve_6': { color: '#FD0000' },
    'valve_7': { color: '#FD0000' },
    'valve_8': { color: '#FD0000' },
    'valve_9': { color: '#FD0000' },
    'valve_10': { color: '#FD0000' },
    'valve_11': { color: '#FD0000' },
    'valve_12': { color: '#FD0000' },
    'valve_14': { color: '#FD0000' },
    'valve_16': { color: '#FD0000' },
    'valve_17': { color: '#FD0000' },
    'valve_18': { color: '#FD0000' },
    'valve_19': { color: '#FD0000' },
    'valve_20': { color: '#FD0000' },
    'valve_21': { color: '#00B20F' },
    'valve_22': { color: '#00B20F' },
    'valve_OORL11S001': { color: '#FD0000', range: 0 },
    'valve_XV-114': { color: '#00B20F' },
    'valve_VP-2': { color: '#00B20F' },

    'pump': { color: '#A9A9A9' },
    // Панели с датчиками
    'panel_P-2408': { text: '0' },
    'panel_P-2411': { text: '0' },
    'panel_P-2306': { text: '0' },
    'panel_P-2415': { text: '0' },
    'panel_P-9457': { text: '0' },
    'panel_P-9403': { text: '0' },
    'panel_P-9452': { text: '0' },
    'panel_P-2421': { text: '0' },
    'panel_P-2226': { text: '0' },
    'panel_P-9432': { text: '0' },
    'panel_P-2207': { text: '0' },
    'panel_P-2424': { text: '0' },

    // Датчики уровня
    'panel_L-9401': { text: '-590', color: '#FF0000' },
    'panel_L-9409': { text: '-590', color: '#FF0000' },
    'panel_L-9410': { text: '-590', color: '#FF0000' },
    'panel_L-9411': { text: '-590', color: '#FF0000' },

    // Датчик температуры
    'panel_TT-14': { text: '0' },

    // Индикатор клапана
    'panel_00RL11H001': { text: '0' },

    // Таймер
    'timer': { text: '10' },
  },
}

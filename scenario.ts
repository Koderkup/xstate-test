import { createMachine, assign } from "xstate";

// Определите типы
interface Tank {
  level: number;
  max: number;
  color: string;
}

interface Pump {
  status: "running" | "stopped";
  color: string;
  current: number;
}

interface ValveState {
  [key: string]: "open" | "closed" | "opening";
}

interface AcidDrainContext {
  tanks: {
    "6.1A": Tank;
    "6.1B": Tank;
    "6.1C": Tank;
    "6.5": Tank;
  };
  pumps: {
    "86C": Pump;
    "93": Pump;
    "86A": Pump;
    "86B": Pump;
  };
  valves: ValveState;
  indicators: {
    line6_10: { active: boolean; color: string };
    ampermeter_86C: { value: number };
    ampermeter_93: { value: number };
    temperature: { value: number };
  };
}

// Типы для событий
type AcidDrainEvent =
  | { type: "START" }
  | { type: "COLLECT_SCHEME_6_1V" }
  | { type: "OPEN_12" }
  | { type: "CLOSE_13" }
  | { type: "CLOSE_14" }
  | { type: "COLLECT_SCHEME_6_5" }
  | { type: "OPEN_1" }
  | { type: "OPEN_5" }
  | { type: "CLOSE_3_2" }
  | { type: "OPEN_3" }
  | { type: "OPEN_3_1" }
  | { type: "OPEN_2_1" }
  | { type: "OPEN_2" }
  | { type: "PUMP_STARTED" }
  | { type: "VALVE_OPENED" }
  | { type: "FILL_COMPLETE" }
  | { type: "VALVE_CLOSED" }
  | { type: "CLOSE_4" }
  | { type: "STOP_86C" }
  | { type: "CLOSE_2" }
  | { type: "CLOSE_2_1" }
  | { type: "CLOSE_3_1" }
  | { type: "CLOSE_3" }
  | { type: "CLOSE_5" }
  | { type: "CLOSE_1" }
  | { type: "NEXT" }
  | { type: "COLLECT_SCHEME_TRANSFER" }
  | { type: "VALVES_OPENED" }
  | { type: "CLOSE_11" }
  | { type: "STOP_93" }
  | { type: "CLOSE_10" }
  | { type: "CLOSE_8" }
  | { type: "CLOSE_9" }
  | { type: "CLOSE_12" }
  | { type: "CLOSE_6" }
  | { type: "COMPLETE" };

// Начальное состояние с типами
const initialContext: AcidDrainContext = {
  tanks: {
    "6.1A": { level: 7.0, max: 8.05, color: "blue" },
    "6.1B": { level: 2.98, max: 8.05, color: "blue" },
    "6.1C": { level: 7.0, max: 8.05, color: "blue" },
    "6.5": { level: 0.0, max: 8.05, color: "blue" },
  },
  pumps: {
    "86C": { status: "stopped", color: "gray", current: 0 },
    "93": { status: "stopped", color: "gray", current: 0 },
    "86A": { status: "stopped", color: "gray", current: 0 },
    "86B": { status: "stopped", color: "gray", current: 0 },
  },
  valves: {
    "1": "closed",
    "2": "closed",
    "2/1": "closed",
    "3": "closed",
    "3/1": "closed",
    "3/2": "closed",
    "4": "closed",
    "4/1": "closed",
    "5": "closed",
    "6": "closed",
    "7": "closed",
    "8": "closed",
    "9": "closed",
    "10": "closed",
    "11": "closed",
    "12": "closed",
    "13": "closed",
    "14": "closed",
  },
  indicators: {
    line6_10: { active: false, color: "gray" },
    ampermeter_86C: { value: 0 },
    ampermeter_93: { value: 0 },
    temperature: { value: 20 },
  },
};

export const acidDrainMachine = createMachine(
  {
    id: "acidDrain",
    initial: "idle",
    context: initialContext,
    types: {} as { context: AcidDrainContext; events: AcidDrainEvent },

    states: {
      // Исходное состояние
      idle: {
        on: { START: "stage1" },
      },

      // ЭТАП 1: Подготовка хранилища 6.1В (шаги 1-4)
      stage1: {
        entry: () => console.log("Этап 1: Подготовка хранилища 6.1В"),
        on: {
          COLLECT_SCHEME_6_1V: { actions: "collectScheme6_1V" },
          OPEN_12: { actions: "openValve12" },
          CLOSE_13: { actions: "closeValve13" },
          CLOSE_14: { actions: "closeValve14" },
          NEXT: { target: "stage2", guard: "isStage1Complete" },
        },
      },

      // ЭТАП 2: Подготовка напорного бака 6.5 (шаги 5-12)
      stage2: {
        entry: () => console.log("Этап 2: Подготовка напорного бака 6.5"),
        on: {
          COLLECT_SCHEME_6_5: { actions: "collectScheme6_5" },
          OPEN_1: { actions: "openValve1" },
          OPEN_5: { actions: "openValve5" },
          CLOSE_3_2: { actions: "closeValve3_2" },
          OPEN_3: { actions: "openValve3" },
          OPEN_3_1: { actions: "openValve3_1" },
          OPEN_2_1: { actions: "openValve2_1" },
          OPEN_2: { actions: "openValve2" },
          NEXT: { target: "stage3", guard: "isStage2Complete" },
        },
      },

      // ЭТАП 3: Заполнение бака 6.5 (шаги 13-16)
      stage3: {
        entry: () => console.log("Этап 3: Заполнение бака 6.5 насосом 86С"),
        initial: "pumpStart",
        states: {
          pumpStart: {
            entry: "startPump86C",
            on: { PUMP_STARTED: "openValve4" },
          },
          openValve4: {
            entry: "openValve4",
            on: { VALVE_OPENED: "openValve4_1" },
          },
          openValve4_1: {
            entry: "startFilling",
            on: { FILL_COMPLETE: "closeValve4_1" },
            after: {
              20000: { target: "closeValve4_1", actions: "completeFilling" },
            },
          },
          closeValve4_1: {
            entry: "closeValve4_1",
            on: { VALVE_CLOSED: "#acidDrain.stage4" },
          },
        },
      },

      // ЭТАП 4: Останов насоса 86С и закрытие (шаги 17-24)
      stage4: {
        entry: () => console.log("Этап 4: Останов насоса 86С"),
        on: {
          CLOSE_4: { actions: "closeValve4" },
          STOP_86C: { actions: "stopPump86C" },
          CLOSE_2: { actions: "closeValve2" },
          CLOSE_2_1: { actions: "closeValve2_1" },
          CLOSE_3_1: { actions: "closeValve3_1" },
          CLOSE_3: { actions: "closeValve3" },
          CLOSE_5: { actions: "closeValve5" },
          CLOSE_1: { actions: "closeValve1" },
          NEXT: { target: "stage5", guard: "isStage4Complete" },
        },
      },

      // ЭТАП 5: Подготовка к перекачке (шаг 25)
      stage5: {
        entry: () => console.log("Этап 5: Подготовка к перекачке"),
        on: {
          COLLECT_SCHEME_TRANSFER: { target: "stage6" },
        },
      },

      // ЭТАП 6: Перекачка насосом 93 (шаги 26-40)
      stage6: {
        entry: () => console.log("Этап 6: Перекачка насосом 93"),
        initial: "openGroup1",
        states: {
          openGroup1: {
            entry: "openValvesGroup1",
            on: { VALVES_OPENED: "closeValve7" },
          },
          closeValve7: {
            entry: "closeValve7",
            on: { VALVE_CLOSED: "openValve10" },
          },
          openValve10: {
            entry: "openValve10",
            on: { VALVE_OPENED: "startPump93" },
          },
          startPump93: {
            entry: "startPump93",
            on: { PUMP_STARTED: "openValve11" },
          },
          openValve11: {
            entry: "startFillingCistern",
            on: { CLOSE_11: "closingSequence" },
            after: { 20000: { actions: "setLine6_10Red" } },
          },
          closingSequence: {
            entry: "closeValve11",
            on: {
              STOP_93: { actions: "stopPump93" },
              CLOSE_10: { actions: "closeValve10" },
              CLOSE_8: { actions: "closeValve8" },
              CLOSE_9: { actions: "closeValve9" },
              CLOSE_12: { actions: "closeValve12" },
              CLOSE_6: { actions: "closeValve6" },
              COMPLETE: "#acidDrain.completed",
            },
          },
        },
      },

      completed: {
        type: "final",
        entry: () => console.log("Процесс завершен!"),
      },
    },
  },
  {
    actions: {
      // Этап 1
      collectScheme6_1V: assign({
        valves: (ctx) => ({
          ...ctx.valves,
          "12": "closed",
          "13": "closed",
          "14": "closed",
        }),
      }),
      openValve12: assign({
        valves: (ctx) => ({ ...ctx.valves, "12": "open" }),
      }),
      closeValve13: assign({
        valves: (ctx) => ({ ...ctx.valves, "13": "closed" }),
      }),
      closeValve14: assign({
        valves: (ctx) => ({ ...ctx.valves, "14": "closed" }),
      }),

      // Этап 2
      collectScheme6_5: assign({
        valves: (ctx) => ({
          ...ctx.valves,
          "1": "closed",
          "5": "closed",
          "3": "closed",
          "3/1": "closed",
          "2/1": "closed",
          "2": "closed",
        }),
      }),
      openValve1: assign({ valves: (ctx) => ({ ...ctx.valves, "1": "open" }) }),
      openValve5: assign({ valves: (ctx) => ({ ...ctx.valves, "5": "open" }) }),
      closeValve3_2: assign({
        valves: (ctx) => ({ ...ctx.valves, "3/2": "closed" }),
      }),
      openValve3: assign({ valves: (ctx) => ({ ...ctx.valves, "3": "open" }) }),
      openValve3_1: assign({
        valves: (ctx) => ({ ...ctx.valves, "3/1": "open" }),
      }),
      openValve2_1: assign({
        valves: (ctx) => ({ ...ctx.valves, "2/1": "open" }),
      }),
      openValve2: assign({ valves: (ctx) => ({ ...ctx.valves, "2": "open" }) }),

      // Этап 3
      startPump86C: assign({
        pumps: (ctx) => ({
          ...ctx.pumps,
          "86C": { status: "running", color: "green", current: 60 },
        }),
      }),
      openValve4: assign({ valves: (ctx) => ({ ...ctx.valves, "4": "open" }) }),
      startFilling: assign({
        valves: (ctx) => ({ ...ctx.valves, "4/1": "opening" }),
        tanks: (ctx) => ({
          ...ctx.tanks,
          "6.5": { ...ctx.tanks["6.5"], level: 8.05, color: "green" },
        }),
      }),
      completeFilling: assign({
        valves: (ctx) => ({ ...ctx.valves, "4/1": "open" }),
      }),
      closeValve4_1: assign({
        valves: (ctx) => ({ ...ctx.valves, "4/1": "closed" }),
      }),

      // Этап 4
      closeValve4: assign({
        valves: (ctx) => ({ ...ctx.valves, "4": "closed" }),
      }),
      stopPump86C: assign({
        pumps: (ctx) => ({
          ...ctx.pumps,
          "86C": { status: "stopped", color: "gray", current: 0 },
        }),
      }),
      closeValve2: assign({
        valves: (ctx) => ({ ...ctx.valves, "2": "closed" }),
      }),
      closeValve2_1: assign({
        valves: (ctx) => ({ ...ctx.valves, "2/1": "closed" }),
      }),
      closeValve3_1: assign({
        valves: (ctx) => ({ ...ctx.valves, "3/1": "closed" }),
      }),
      closeValve3: assign({
        valves: (ctx) => ({ ...ctx.valves, "3": "closed" }),
      }),
      closeValve5: assign({
        valves: (ctx) => ({ ...ctx.valves, "5": "closed" }),
      }),
      closeValve1: assign({
        valves: (ctx) => ({ ...ctx.valves, "1": "closed" }),
      }),

      // Этап 6
      openValvesGroup1: assign({
        valves: (ctx) => ({
          ...ctx.valves,
          "6": "open",
          "9": "open",
          "7": "open",
          "8": "open",
        }),
      }),
      closeValve7: assign({
        valves: (ctx) => ({ ...ctx.valves, "7": "closed" }),
      }),
      openValve10: assign({
        valves: (ctx) => ({ ...ctx.valves, "10": "open" }),
      }),
      startPump93: assign({
        pumps: (ctx) => ({
          ...ctx.pumps,
          "93": { status: "running", color: "green", current: 30 },
        }),
      }),
      startFillingCistern: assign({
        valves: (ctx) => ({ ...ctx.valves, "11": "open" }),
        indicators: (ctx) => ({ ...ctx.indicators, temperature: 35 }),
        tanks: (ctx) => ({
          ...ctx.tanks,
          "6.1B": { ...ctx.tanks["6.1B"], level: 8.05 },
        }),
      }),
      setLine6_10Red: assign({
        indicators: (ctx) => ({
          ...ctx.indicators,
          line6_10: { active: true, color: "red" },
        }),
      }),
      closeValve11: assign({
        valves: (ctx) => ({ ...ctx.valves, "11": "closed" }),
      }),
      stopPump93: assign({
        pumps: (ctx) => ({
          ...ctx.pumps,
          "93": { status: "stopped", color: "gray", current: 0 },
        }),
      }),
      closeValve10: assign({
        valves: (ctx) => ({ ...ctx.valves, "10": "closed" }),
      }),
      closeValve8: assign({
        valves: (ctx) => ({ ...ctx.valves, "8": "closed" }),
      }),
      closeValve9: assign({
        valves: (ctx) => ({ ...ctx.valves, "9": "closed" }),
      }),
      closeValve12: assign({
        valves: (ctx) => ({ ...ctx.valves, "12": "closed" }),
      }),
      closeValve6: assign({
        valves: (ctx) => ({ ...ctx.valves, "6": "closed" }),
      }),
    },

    guards: {
      isStage1Complete: (ctx) =>
        ctx.valves["12"] === "open" &&
        ctx.valves["13"] === "closed" &&
        ctx.valves["14"] === "closed",
      isStage2Complete: (ctx) =>
        ctx.valves["1"] === "open" &&
        ctx.valves["5"] === "open" &&
        ctx.valves["3/2"] === "closed" &&
        ctx.valves["3"] === "open" &&
        ctx.valves["3/1"] === "open" &&
        ctx.valves["2/1"] === "open" &&
        ctx.valves["2"] === "open",
      isStage4Complete: (ctx) =>
        ctx.valves["4"] === "closed" &&
        ctx.pumps["86C"].status === "stopped" &&
        ctx.valves["2"] === "closed" &&
        ctx.valves["2/1"] === "closed" &&
        ctx.valves["3/1"] === "closed" &&
        ctx.valves["3"] === "closed" &&
        ctx.valves["5"] === "closed" &&
        ctx.valves["1"] === "closed",
    },
  },
);

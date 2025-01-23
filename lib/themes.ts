import { get } from '@vercel/edge-config'; // Importing get from Edge Config

export interface Theme {
  name: string
  symbols: string[]
  backgroundColor: string
  gridSetup: string
  symbolValues: { [key: string]: number }
  winLines: { line: number[]; multiplier: number }[]
  bonusSymbol: string
  scatterSymbol: string
  soundEffects: {
    spin: string
    win: string
    bonus: string
  }
  backgroundMusic: string
}

export const themes: Theme[] = [
  {
    name: "Emoji Party",
    symbols: ["🎉", "🎈", "🎊", "🎁", "🕺", "💃", "🍰", "🎵"],
    backgroundColor: "from-pink-400 to-purple-500",
    gridSetup: "3x5",
    symbolValues: {
      "🎉": 2,
      "🎈": 3,
      "🎊": 4,
      "🎁": 5,
      "🕺": 6,
      "💃": 8,
      "🍰": 10,
      "🎵": "Wild",
    },
    winLines: [
      { line: [1, 1, 1, 1, 1], multiplier: 2 },
      { line: [0, 0, 0, 0, 0], multiplier: 1.5 },
      { line: [2, 2, 2, 2, 2], multiplier: 1.5 },
      { line: [0, 1, 2, 1, 0], multiplier: 1 },
      { line: [2, 1, 0, 1, 2], multiplier: 1 },
    ],
    bonusSymbol: "🎵",
    scatterSymbol: "🎊",
    soundEffects: {
      spin: "/sounds/emoji-party-spin.mp3",
      win: "/sounds/emoji-party-win.mp3",
      bonus: "/sounds/emoji-party-bonus.mp3",
    },
    backgroundMusic: "/sounds/emoji-party-background.mp3",
  },
  {
    name: "Space Odyssey",
    symbols: ["🚀", "👨‍🚀", "🛸", "🌠", "🌕", "🪐", "👽", "🌌"],
    backgroundColor: "from-indigo-900 to-purple-900",
    gridSetup: "4x4",
    symbolValues: {
      "🚀": 2,
      "👨‍🚀": 3,
      "🛸": 4,
      "🌠": 5,
      "🌕": 6,
      "🪐": 8,
      "👽": 10,
      "🌌": "Wild",
    },
    winLines: [
      { line: [0, 0, 0, 0], multiplier: 2 },
      { line: [1, 1, 1, 1], multiplier: 2 },
      { line: [2, 2, 2, 2], multiplier: 2 },
      { line: [3, 3, 3, 3], multiplier: 2 },
      { line: [0, 1, 2, 3], multiplier: 1.5 },
      { line: [3, 2, 1, 0], multiplier: 1.5 },
    ],
    bonusSymbol: "🌌",
    scatterSymbol: "👽",
    soundEffects: {
      spin: "/sounds/space-odyssey-spin.mp3",
      win: "/sounds/space-odyssey-win.mp3",
      bonus: "/sounds/space-odyssey-bonus.mp3",
    },
    backgroundMusic: "/sounds/space-odyssey-background.mp3",
  },
  {
    name: "Ocean Explorer",
    symbols: ["🐠", "🦈", "🐙", "🐳", "🦀", "🐚", "🧜‍♀️", "🌊"],
    backgroundColor: "from-blue-400 to-teal-200",
    gridSetup: "3x6",
    symbolValues: {
      "🐠": 2,
      "🦈": 3,
      "🐙": 4,
      "🐳": 5,
      "🦀": 6,
      "🐚": 8,
      "🧜‍♀️": 10,
      "🌊": "Wild",
    },
    winLines: [
      { line: [1, 1, 1, 1, 1, 1], multiplier: 3 },
      { line: [0, 0, 0, 0, 0, 0], multiplier: 2 },
      { line: [2, 2, 2, 2, 2, 2], multiplier: 2 },
      { line: [0, 1, 2, 2, 1, 0], multiplier: 1.5 },
      { line: [2, 1, 0, 0, 1, 2], multiplier: 1.5 },
    ],
    bonusSymbol: "🌊",
    scatterSymbol: "🧜‍♀️",
    soundEffects: {
      spin: "/sounds/ocean-explorer-spin.mp3",
      win: "/sounds/ocean-explorer-win.mp3",
      bonus: "/sounds/ocean-explorer-bonus.mp3",
    },
    backgroundMusic: "/sounds/ocean-explorer-background.mp3",
  },
  {
    name: "Candy Craze",
    symbols: ["🍭", "🍬", "🍫", "🍩", "🍪", "🧁", "🍰", "🎂"],
    backgroundColor: "from-pink-300 to-yellow-200",
    gridSetup: "5x3",
    symbolValues: {
      "🍭": 2,
      "🍬": 3,
      "🍫": 4,
      "🍩": 5,
      "🍪": 6,
      "🧁": 8,
      "🍰": 10,
      "🎂": "Wild",
    },
    winLines: [
      { line: [0, 0, 0], multiplier: 2 },
      { line: [1, 1, 1], multiplier: 2 },
      { line: [2, 2, 2], multiplier: 2 },
      { line: [3, 3, 3], multiplier: 2 },
      { line: [4, 4, 4], multiplier: 2 },
      { line: [0, 1, 2], multiplier: 1.5 },
      { line: [2, 1, 0], multiplier: 1.5 },
    ],
    bonusSymbol: "🎂",
    scatterSymbol: "🍰",
    soundEffects: {
      spin: "/sounds/candy-craze-spin.mp3",
      win: "/sounds/candy-craze-win.mp3",
      bonus: "/sounds/candy-craze-bonus.mp3",
    },
    backgroundMusic: "/sounds/candy-craze-background.mp3",
  },
  {
    name: "Jungle Adventure",
    symbols: ["🐒", "🦁", "🐘", "🦜", "🐍", "🌴", "💎", "🗿"],
    backgroundColor: "from-green-700 to-yellow-500",
    gridSetup: "3x5",
    symbolValues: {
      "🐒": 2,
      "🦁": 3,
      "🐘": 4,
      "🦜": 5,
      "🐍": 6,
      "🌴": 8,
      "💎": 10,
      "🗿": "Wild",
    },
    winLines: [
      { line: [1, 1, 1, 1, 1], multiplier: 2 },
      { line: [0, 0, 0, 0, 0], multiplier: 1.5 },
      { line: [2, 2, 2, 2, 2], multiplier: 1.5 },
      { line: [0, 1, 2, 1, 0], multiplier: 1 },
      { line: [2, 1, 0, 1, 2], multiplier: 1 },
    ],
    bonusSymbol: "🗿",
    scatterSymbol: "💎",
    soundEffects: {
      spin: "/sounds/jungle-adventure-spin.mp3",
      win: "/sounds/jungle-adventure-win.mp3",
      bonus: "/sounds/jungle-adventure-bonus.mp.mp3",
    },
    backgroundMusic: "/sounds/jungle-adventure-background.mp3",
  },
  {
    name: "Mystic Fortune",
    symbols: ["🔮", "🧙‍♂️", "🧝‍♀️", "🧚", "🦄", "🌙", "⭐", "🌈"],
    backgroundColor: "from-purple-800 to-indigo-600",
    gridSetup: "4x5",
    symbolValues: {
      "🔮": 2,
      "🧙‍♂️": 3,
      "🧝‍♀️": 4,
      "🧚": 5,
      "🦄": 6,
      "🌙": 8,
      "⭐": 10,
      "🌈": "Wild",
    },
    winLines: [
      { line: [0, 0, 0, 0, 0], multiplier: 3 },
      { line: [1, 1, 1, 1, 1], multiplier: 3 },
      { line: [2, 2, 2, 2, 2], multiplier: 3 },
      { line: [3, 3, 3, 3, 3], multiplier: 3 },
      { line: [0, 1, 2, 3, 3], multiplier: 2 },
      { line: [3, 2, 1, 0, 0], multiplier: 2 },
      { line: [1, 2, 3, 2, 1], multiplier: 1.5 },
    ],
    bonusSymbol: "🌈",
    scatterSymbol: "⭐",
    soundEffects: {
      spin: "/sounds/mystic-fortune-spin.mp3",
      win: "/sounds/mystic-fortune-win.mp3",
      bonus: "/sounds/mystic-fortune-bonus.mp3",
    },
    backgroundMusic: "/sounds/mystic-fortune-background.mp3",
  },
];

// Fetching Edge Config settings for themes
const themeConfig = await get('themeConfig');

export const defaultTheme = themeConfig.defaultTheme || themes[0]; // Use Edge Config for default theme

export interface GameProject {
  id: string;
  title: string;
  engine: string;
  genre: string;
  description: string;
  team: string;
  duration: string;
  status: "Complete" | "In Progress";
}

export const GAME_PROJECTS: GameProject[] = [
  {
    id: "G1",
    title: "[Game Title 1]",
    engine: "[Engine / Language]",
    genre: "[Genre]",
    description: "[One to two sentence description of the game, what it does, and any standout technical features.]",
    team: "[Solo / Team size]",
    duration: "[Duration, e.g. 8 months]",
    status: "Complete",
  },
  {
    id: "G2",
    title: "[Game Title 2]",
    engine: "[Engine / Language]",
    genre: "[Genre]",
    description: "[One to two sentence description of the game, what it does, and any standout technical features.]",
    team: "[Solo / Team size]",
    duration: "[Duration, e.g. 6 weeks — Game Jam]",
    status: "Complete",
  },
  {
    id: "G3",
    title: "[Game Title 3]",
    engine: "[Engine / Language]",
    genre: "[Genre]",
    description: "[One to two sentence description of the game, what it does, and any standout technical features.]",
    team: "[Solo / Team size]",
    duration: "[Duration, e.g. 3 months]",
    status: "In Progress",
  },
];
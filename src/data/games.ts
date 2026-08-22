import gwThumb from "../assets/games/glitchwave.png";
import lecThumb from "../assets/games/lec.png";
export interface GameProject {
  id: string;
  title: string;
  engine: string;
  genre: string[];
  description: string;
  team: string;
  duration: string;
  url?: string;
  status: "Complete" | "In Progress";
  thumbnail?: string;
}

export const GAME_PROJECTS: GameProject[] = [
  {
    id: "G1",
    title: "Glitchwave",
    engine: "Unity",
    genre: ["Arcade Remake", "Tube Shooter", ],
    description: "GlitchWave is a remake of the classic arcade game Tempest, built as a project by members of the National High School Game Academy. Contributed primarily as an artist, while also pitching in on cross disciplinary tasks alongside the rest of the team.",
    team: "4 members",
    duration: "3 weeks",
    url: "https://novigradian7.itch.io/glitchwave",
    status: "Complete",
    thumbnail: gwThumb
  },
  {
    id: "G2",
    title: "Let 'Em Cook",
    engine: "Unity",
    genre: ["VR", "Cooking", "Wave Defense", ],
    description: "Let 'Em Cook is the culmination of 5 individuals coming together to create a cooking game where you fight zombified food and serve customers at the same time. I contributed primarily as an artist, but also helped with scripting the particle system and some of the enemies.",
    team: "5 members",
    duration: "3 week",
    url: "https://drive.google.com/file/d/1RXQixTa9w16jMC_MPzcPJ7qXE2FmhMq2/view?usp=sharing",
    status: "Complete",
    thumbnail: lecThumb
  },
  {
    id: "G3",
    title: "[Game Title 3]",
    engine: "[Engine / Language]",
    genre: ["", ],
    description: "[One to two sentence description of the game, what it does, and any standout technical features.]",
    team: "[Solo / Team size]",
    duration: "[Duration, e.g. 3 months]",
    status: "In Progress",
  },
];
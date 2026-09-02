export type Species = "human" | "creature" | "robot" | "magical";
export type Gender = "male" | "female";
export type Alignment = "hero" | "villain";
export type PowerType = "none" | "superpowers" | "magic" | "tech";
export type WeaponType = "none" | "melee" | "ranged" | "magic";
export type Format = "live-movie" | "live-tv" | "animated-movie" | "animated-tv";
export type AgeGroup = "teen" | "adult" | "elder";

export interface Character {
  id: string;
  name: string;
  source: string;
  emoji: string;
  color: string;
  species?: Species;
  gender?: Gender;
  alignment?: Alignment;
  powers?: PowerType;
  weapon?: WeaponType;
  format?: Format;
  age?: AgeGroup;
  costume?: boolean;
  facialHair?: boolean;
  // packs beyond "classic"/"anime" attach their own attribute keys here
  [key: string]: string | boolean | undefined;
}

export interface CategoryValue {
  value: string;
  label: string;
  icon: string;
}

export interface CategoryDef {
  key: string;
  label: string;
  icon: string;
  question: string; // "{value}" is replaced with the chosen value's label
  values: CategoryValue[];
}

export interface Pack {
  key: string;
  label: string;
  icon: string;
  characters: Character[];
  categories: CategoryDef[];
}

const classicCharacters: Character[] = [
  { id: "walter-white", name: "Walter White", source: "Breaking Bad", emoji: "🥼", color: "#2f7d4f", species: "human", gender: "male", alignment: "villain", powers: "none", weapon: "ranged", format: "live-tv", age: "adult", costume: false, facialHair: true },
  { id: "darth-vader", name: "Darth Vader", source: "Star Wars", emoji: "🖤", color: "#1a1a1a", species: "human", gender: "male", alignment: "villain", powers: "magic", weapon: "melee", format: "live-movie", age: "adult", costume: true, facialHair: false },
  { id: "draco-malfoy", name: "Draco Malfoy", source: "Harry Potter", emoji: "🐍", color: "#2e6b4f", species: "human", gender: "male", alignment: "villain", powers: "magic", weapon: "magic", format: "live-movie", age: "teen", costume: true, facialHair: false },
  { id: "spongebob", name: "SpongeBob SquarePants", source: "SpongeBob SquarePants", emoji: "🧽", color: "#f4c542", species: "creature", gender: "male", alignment: "hero", powers: "none", weapon: "none", format: "animated-tv", age: "adult", costume: false, facialHair: false },
  { id: "iron-man", name: "Tony Stark", source: "Marvel", emoji: "🦾", color: "#c0392b", species: "human", gender: "male", alignment: "hero", powers: "tech", weapon: "ranged", format: "live-movie", age: "adult", costume: true, facialHair: true },
  { id: "michael-scott", name: "Michael Scott", source: "The Office", emoji: "📎", color: "#3b6ea5", species: "human", gender: "male", alignment: "hero", powers: "none", weapon: "none", format: "live-tv", age: "adult", costume: false, facialHair: false },
  { id: "eleven", name: "Eleven", source: "Stranger Things", emoji: "🔮", color: "#6c3fa3", species: "human", gender: "female", alignment: "hero", powers: "superpowers", weapon: "none", format: "live-tv", age: "teen", costume: false, facialHair: false },
  { id: "shrek", name: "Shrek", source: "Shrek", emoji: "🟢", color: "#5b8c3e", species: "creature", gender: "male", alignment: "hero", powers: "none", weapon: "none", format: "animated-movie", age: "adult", costume: false, facialHair: false },
  { id: "daemon-targaryen", name: "Daemon Targaryen", source: "House of the Dragon", emoji: "🐉", color: "#7a1f1f", species: "human", gender: "male", alignment: "hero", powers: "none", weapon: "melee", format: "live-tv", age: "adult", costume: false, facialHair: false },
  { id: "joker", name: "The Joker", source: "Batman", emoji: "🃏", color: "#5b2a86", species: "human", gender: "male", alignment: "villain", powers: "none", weapon: "melee", format: "live-movie", age: "adult", costume: true, facialHair: false },
  { id: "elsa", name: "Elsa", source: "Frozen", emoji: "❄️", color: "#4fa3d1", species: "human", gender: "female", alignment: "hero", powers: "magic", weapon: "none", format: "animated-movie", age: "adult", costume: true, facialHair: false },
  { id: "homer", name: "Homer Simpson", source: "The Simpsons", emoji: "🍩", color: "#f2c14e", species: "human", gender: "male", alignment: "hero", powers: "none", weapon: "none", format: "animated-tv", age: "adult", costume: false, facialHair: false },
  { id: "yoda", name: "Yoda", source: "Star Wars", emoji: "🟢", color: "#7a9b57", species: "magical", gender: "male", alignment: "hero", powers: "magic", weapon: "melee", format: "live-movie", age: "elder", costume: true, facialHair: false },
  { id: "harley-quinn", name: "Harley Quinn", source: "Batman", emoji: "🔨", color: "#d63384", species: "human", gender: "female", alignment: "villain", powers: "none", weapon: "melee", format: "live-movie", age: "adult", costume: true, facialHair: false },
  { id: "gandalf", name: "Gandalf", source: "Lord of the Rings", emoji: "🧙", color: "#7c7c7c", species: "magical", gender: "male", alignment: "hero", powers: "magic", weapon: "melee", format: "live-movie", age: "elder", costume: true, facialHair: true },
  { id: "rick-sanchez", name: "Rick Sanchez", source: "Rick and Morty", emoji: "🧪", color: "#6fae6f", species: "human", gender: "male", alignment: "hero", powers: "tech", weapon: "ranged", format: "animated-tv", age: "adult", costume: false, facialHair: false },
  { id: "wednesday", name: "Wednesday Addams", source: "Wednesday", emoji: "🖤", color: "#2b2b2b", species: "human", gender: "female", alignment: "hero", powers: "superpowers", weapon: "none", format: "live-tv", age: "teen", costume: false, facialHair: false },
  { id: "thanos", name: "Thanos", source: "Marvel", emoji: "💜", color: "#7d5ba6", species: "magical", gender: "male", alignment: "villain", powers: "superpowers", weapon: "melee", format: "live-movie", age: "adult", costume: true, facialHair: false },
  { id: "moana", name: "Moana", source: "Moana", emoji: "🌊", color: "#2e8bc0", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "none", format: "animated-movie", age: "teen", costume: false, facialHair: false },
  { id: "sheldon", name: "Sheldon Cooper", source: "The Big Bang Theory", emoji: "🧠", color: "#4a6fa5", species: "human", gender: "male", alignment: "hero", powers: "none", weapon: "none", format: "live-tv", age: "adult", costume: false, facialHair: false },
  { id: "maleficent", name: "Maleficent", source: "Sleeping Beauty", emoji: "🐐", color: "#3d1f4d", species: "magical", gender: "female", alignment: "villain", powers: "magic", weapon: "magic", format: "animated-movie", age: "adult", costume: true, facialHair: false },
  { id: "jon-snow", name: "Jon Snow", source: "Game of Thrones", emoji: "⚔️", color: "#4a4a4a", species: "human", gender: "male", alignment: "hero", powers: "none", weapon: "melee", format: "live-tv", age: "adult", costume: false, facialHair: true },
  { id: "buzz-lightyear", name: "Buzz Lightyear", source: "Toy Story", emoji: "🚀", color: "#3a6ea5", species: "robot", gender: "male", alignment: "hero", powers: "none", weapon: "none", format: "animated-movie", age: "adult", costume: true, facialHair: false },
  { id: "katniss", name: "Katniss Everdeen", source: "The Hunger Games", emoji: "🏹", color: "#5a5a3c", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "ranged", format: "live-movie", age: "teen", costume: false, facialHair: false },
  { id: "deadpool", name: "Deadpool", source: "Marvel", emoji: "🗡️", color: "#a11d2e", species: "human", gender: "male", alignment: "hero", powers: "superpowers", weapon: "melee", format: "live-movie", age: "adult", costume: true, facialHair: false },
  { id: "leia", name: "Princess Leia", source: "Star Wars", emoji: "👑", color: "#8a5a9a", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "ranged", format: "live-movie", age: "adult", costume: false, facialHair: false },
  { id: "naruto", name: "Naruto Uzumaki", source: "Naruto", emoji: "🍥", color: "#e8912d", species: "human", gender: "male", alignment: "hero", powers: "magic", weapon: "melee", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "peter-griffin", name: "Peter Griffin", source: "Family Guy", emoji: "🍺", color: "#e0b13f", species: "human", gender: "male", alignment: "hero", powers: "none", weapon: "none", format: "animated-tv", age: "adult", costume: false, facialHair: false },
  { id: "legolas", name: "Legolas", source: "Lord of the Rings", emoji: "🏹", color: "#3f6b4f", species: "magical", gender: "male", alignment: "hero", powers: "none", weapon: "ranged", format: "live-movie", age: "adult", costume: true, facialHair: false },
  { id: "spider-man", name: "Spider-Man", source: "Marvel", emoji: "🕷️", color: "#a11d2e", species: "human", gender: "male", alignment: "hero", powers: "superpowers", weapon: "none", format: "live-movie", age: "teen", costume: true, facialHair: false },
];

const classicCategories: CategoryDef[] = [
  {
    key: "species",
    label: "Species",
    icon: "🧬",
    question: "Is their species {value}?",
    values: [
      { value: "human", label: "Human", icon: "🧑" },
      { value: "creature", label: "Creature", icon: "🐾" },
      { value: "robot", label: "Robot", icon: "🤖" },
      { value: "magical", label: "Magical Being", icon: "🧝" },
    ],
  },
  {
    key: "gender",
    label: "Gender",
    icon: "🚻",
    question: "Are they {value}?",
    values: [
      { value: "male", label: "Male", icon: "👨" },
      { value: "female", label: "Female", icon: "👩" },
    ],
  },
  {
    key: "alignment",
    label: "Alignment",
    icon: "⚖️",
    question: "Are they a {value}?",
    values: [
      { value: "hero", label: "Hero", icon: "🦸" },
      { value: "villain", label: "Villain", icon: "🦹" },
    ],
  },
  {
    key: "powers",
    label: "Powers",
    icon: "✨",
    question: "Is their power type {value}?",
    values: [
      { value: "none", label: "None", icon: "🚫" },
      { value: "superpowers", label: "Superpowers", icon: "💪" },
      { value: "magic", label: "Magic", icon: "🪄" },
      { value: "tech", label: "Tech / Skill", icon: "🛠️" },
    ],
  },
  {
    key: "weapon",
    label: "Weapon",
    icon: "🗡️",
    question: "Is their weapon type {value}?",
    values: [
      { value: "none", label: "None", icon: "🚫" },
      { value: "melee", label: "Melee", icon: "⚔️" },
      { value: "ranged", label: "Ranged", icon: "🏹" },
      { value: "magic", label: "Magic / Energy", icon: "🔮" },
    ],
  },
  {
    key: "format",
    label: "Format",
    icon: "🎬",
    question: "Are they from a {value}?",
    values: [
      { value: "live-movie", label: "Live-Action Movie", icon: "🎥" },
      { value: "live-tv", label: "Live-Action TV Series", icon: "📺" },
      { value: "animated-movie", label: "Animated Movie", icon: "🎞️" },
      { value: "animated-tv", label: "Animated TV Series", icon: "📼" },
    ],
  },
  {
    key: "age",
    label: "Age Group",
    icon: "🎂",
    question: "Are they in the {value} age group?",
    values: [
      { value: "teen", label: "Teen", icon: "🧒" },
      { value: "adult", label: "Adult", icon: "🧑" },
      { value: "elder", label: "Elder", icon: "👴" },
    ],
  },
  {
    key: "costume",
    label: "Costume",
    icon: "🎭",
    question: "Do they wear a costume?",
    values: [
      { value: "true", label: "Wears a costume", icon: "✅" },
      { value: "false", label: "No costume", icon: "❌" },
    ],
  },
  {
    key: "facialHair",
    label: "Facial Hair",
    icon: "🧔",
    question: "Do they have facial hair?",
    values: [
      { value: "true", label: "Has facial hair", icon: "✅" },
      { value: "false", label: "No facial hair", icon: "❌" },
    ],
  },
];

const animeCharacters: Character[] = [
  { id: "naruto-uzumaki", name: "Naruto Uzumaki", source: "Naruto", emoji: "🍥", color: "#e8912d", species: "human", gender: "male", alignment: "hero", powers: "magic", weapon: "melee", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "sasuke-uchiha", name: "Sasuke Uchiha", source: "Naruto", emoji: "⚡", color: "#2b2b3a", species: "human", gender: "male", alignment: "hero", powers: "magic", weapon: "melee", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "itachi-uchiha", name: "Itachi Uchiha", source: "Naruto", emoji: "🐦‍⬛", color: "#34495e", species: "human", gender: "male", alignment: "hero", powers: "magic", weapon: "melee", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "goku", name: "Son Goku", source: "Dragon Ball", emoji: "🐉", color: "#ff6600", species: "magical", gender: "male", alignment: "hero", powers: "superpowers", weapon: "none", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "vegeta", name: "Vegeta", source: "Dragon Ball", emoji: "👑", color: "#1f3a93", species: "magical", gender: "male", alignment: "hero", powers: "superpowers", weapon: "none", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "piccolo", name: "Piccolo", source: "Dragon Ball", emoji: "🟢", color: "#27ae60", species: "creature", gender: "male", alignment: "hero", powers: "superpowers", weapon: "none", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "frieza", name: "Frieza", source: "Dragon Ball", emoji: "💜", color: "#9b59b6", species: "magical", gender: "male", alignment: "villain", powers: "superpowers", weapon: "none", format: "animated-tv", age: "adult", costume: false, facialHair: false },
  { id: "luffy", name: "Monkey D. Luffy", source: "One Piece", emoji: "🏴‍☠️", color: "#d63031", species: "human", gender: "male", alignment: "hero", powers: "superpowers", weapon: "none", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "zoro", name: "Roronoa Zoro", source: "One Piece", emoji: "⚔️", color: "#2ecc71", species: "human", gender: "male", alignment: "hero", powers: "none", weapon: "melee", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "nami", name: "Nami", source: "One Piece", emoji: "🍊", color: "#f39c12", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "melee", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "levi-ackerman", name: "Levi Ackerman", source: "Attack on Titan", emoji: "🗡️", color: "#34495e", species: "human", gender: "male", alignment: "hero", powers: "none", weapon: "melee", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "eren-yeager", name: "Eren Yeager", source: "Attack on Titan", emoji: "🦖", color: "#7f4f24", species: "human", gender: "male", alignment: "hero", powers: "superpowers", weapon: "melee", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "mikasa-ackerman", name: "Mikasa Ackerman", source: "Attack on Titan", emoji: "🧣", color: "#c0392b", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "melee", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "light-yagami", name: "Light Yagami", source: "Death Note", emoji: "📓", color: "#2c3e50", species: "human", gender: "male", alignment: "villain", powers: "none", weapon: "none", format: "animated-tv", age: "teen", costume: false, facialHair: false },
  { id: "l-lawliet", name: "L Lawliet", source: "Death Note", emoji: "🍰", color: "#ecf0f1", species: "human", gender: "male", alignment: "hero", powers: "none", weapon: "none", format: "animated-tv", age: "adult", costume: false, facialHair: false },
  { id: "edward-elric", name: "Edward Elric", source: "Fullmetal Alchemist", emoji: "⚗️", color: "#c0392b", species: "human", gender: "male", alignment: "hero", powers: "magic", weapon: "melee", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "alphonse-elric", name: "Alphonse Elric", source: "Fullmetal Alchemist", emoji: "🛡️", color: "#7f8c8d", species: "robot", gender: "male", alignment: "hero", powers: "magic", weapon: "none", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "saitama", name: "Saitama", source: "One Punch Man", emoji: "👊", color: "#f1c40f", species: "human", gender: "male", alignment: "hero", powers: "superpowers", weapon: "none", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "tanjiro-kamado", name: "Tanjiro Kamado", source: "Demon Slayer", emoji: "🌊", color: "#2ecc71", species: "human", gender: "male", alignment: "hero", powers: "magic", weapon: "melee", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "nezuko-kamado", name: "Nezuko Kamado", source: "Demon Slayer", emoji: "🎋", color: "#e67e22", species: "magical", gender: "female", alignment: "hero", powers: "superpowers", weapon: "none", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "gojo-satoru", name: "Gojo Satoru", source: "Jujutsu Kaisen", emoji: "🔵", color: "#3498db", species: "human", gender: "male", alignment: "hero", powers: "magic", weapon: "none", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "sailor-moon", name: "Sailor Moon", source: "Sailor Moon", emoji: "🌙", color: "#f8c9d4", species: "human", gender: "female", alignment: "hero", powers: "magic", weapon: "none", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "all-might", name: "All Might", source: "My Hero Academia", emoji: "💪", color: "#f1c40f", species: "human", gender: "male", alignment: "hero", powers: "superpowers", weapon: "none", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "deku", name: "Izuku Midoriya", source: "My Hero Academia", emoji: "🍀", color: "#27ae60", species: "human", gender: "male", alignment: "hero", powers: "superpowers", weapon: "none", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "spike-spiegel", name: "Spike Spiegel", source: "Cowboy Bebop", emoji: "🚬", color: "#2c3e50", species: "human", gender: "male", alignment: "hero", powers: "none", weapon: "ranged", format: "animated-tv", age: "adult", costume: false, facialHair: false },
  { id: "rem", name: "Rem", source: "Re:Zero", emoji: "🔵", color: "#3498db", species: "magical", gender: "female", alignment: "hero", powers: "magic", weapon: "melee", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "ichigo-kurosaki", name: "Ichigo Kurosaki", source: "Bleach", emoji: "⚔️", color: "#e67e22", species: "human", gender: "male", alignment: "hero", powers: "superpowers", weapon: "melee", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "rukia-kuchiki", name: "Rukia Kuchiki", source: "Bleach", emoji: "❄️", color: "#2c3e50", species: "magical", gender: "female", alignment: "hero", powers: "superpowers", weapon: "melee", format: "animated-tv", age: "adult", costume: true, facialHair: false },
];

export const packs: Pack[] = [
  { key: "classic", label: "Movies & TV Characters", icon: "🎬", characters: classicCharacters, categories: classicCategories },
  { key: "anime", label: "Anime Characters", icon: "🍥", characters: animeCharacters, categories: classicCategories },
];

export const DEFAULT_PACK_KEY = "classic";

export function getPack(key?: string): Pack {
  return packs.find((p) => p.key === key) ?? packs[0];
}

export function categoryValueMatches(character: Character, categoryKey: string, value: string): boolean {
  return String((character as any)[categoryKey]) === value;
}

export function buildQuestionText(categoryKey: string, value: string, categoryDefs: CategoryDef[]): string {
  const category = categoryDefs.find((c) => c.key === categoryKey);
  if (!category) return "Unknown question";
  const valueDef = category.values.find((v) => v.value === value);
  return category.question.replace("{value}", valueDef?.label ?? value);
}

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
  { id: "leslie-knope", name: "Leslie Knope", source: "Parks and Recreation", emoji: "📋", color: "#4a7c59", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "none", format: "live-tv", age: "adult", costume: false, facialHair: false },
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
  { id: "penny-bbt", name: "Penny", source: "The Big Bang Theory", emoji: "🍕", color: "#e8912d", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "none", format: "live-tv", age: "adult", costume: false, facialHair: false },
  { id: "maleficent", name: "Maleficent", source: "Sleeping Beauty", emoji: "🐐", color: "#3d1f4d", species: "magical", gender: "female", alignment: "villain", powers: "magic", weapon: "magic", format: "animated-movie", age: "adult", costume: true, facialHair: false },
  { id: "daenerys", name: "Daenerys Targaryen", source: "Game of Thrones", emoji: "🐲", color: "#c9a86a", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "none", format: "live-tv", age: "adult", costume: true, facialHair: false },
  { id: "jessie-toy-story", name: "Jessie", source: "Toy Story", emoji: "🤠", color: "#d2691e", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "none", format: "animated-movie", age: "adult", costume: true, facialHair: false },
  { id: "katniss", name: "Katniss Everdeen", source: "The Hunger Games", emoji: "🏹", color: "#5a5a3c", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "ranged", format: "live-movie", age: "teen", costume: false, facialHair: false },
  { id: "deadpool", name: "Deadpool", source: "Marvel", emoji: "🗡️", color: "#a11d2e", species: "human", gender: "male", alignment: "hero", powers: "superpowers", weapon: "melee", format: "live-movie", age: "adult", costume: true, facialHair: false },
  { id: "leia", name: "Princess Leia", source: "Star Wars", emoji: "👑", color: "#8a5a9a", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "ranged", format: "live-movie", age: "adult", costume: false, facialHair: false },
  { id: "naruto", name: "Naruto Uzumaki", source: "Naruto", emoji: "🍥", color: "#e8912d", species: "human", gender: "male", alignment: "hero", powers: "magic", weapon: "melee", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "velma", name: "Velma Dinkley", source: "Scooby-Doo", emoji: "🔍", color: "#e05d38", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "none", format: "animated-tv", age: "teen", costume: false, facialHair: false },
  { id: "galadriel", name: "Galadriel", source: "Lord of the Rings", emoji: "💍", color: "#d4af37", species: "magical", gender: "female", alignment: "hero", powers: "magic", weapon: "none", format: "live-movie", age: "elder", costume: true, facialHair: false },
  { id: "captain-marvel", name: "Captain Marvel", source: "Marvel", emoji: "⭐", color: "#c0392b", species: "human", gender: "female", alignment: "hero", powers: "superpowers", weapon: "none", format: "live-movie", age: "adult", costume: true, facialHair: false },
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
  { id: "bulma", name: "Bulma", source: "Dragon Ball", emoji: "🔵", color: "#3498db", species: "human", gender: "female", alignment: "hero", powers: "tech", weapon: "none", format: "animated-tv", age: "adult", costume: false, facialHair: false },
  { id: "goku", name: "Son Goku", source: "Dragon Ball", emoji: "🐉", color: "#ff6600", species: "magical", gender: "male", alignment: "hero", powers: "superpowers", weapon: "none", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "android-18", name: "Android 18", source: "Dragon Ball", emoji: "🤖", color: "#f1c40f", species: "robot", gender: "female", alignment: "hero", powers: "superpowers", weapon: "none", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "misa-amane", name: "Misa Amane", source: "Death Note", emoji: "😈", color: "#e91e63", species: "human", gender: "female", alignment: "villain", powers: "superpowers", weapon: "none", format: "animated-tv", age: "teen", costume: false, facialHair: false },
  { id: "frieza", name: "Frieza", source: "Dragon Ball", emoji: "💜", color: "#9b59b6", species: "magical", gender: "male", alignment: "villain", powers: "superpowers", weapon: "none", format: "animated-tv", age: "adult", costume: false, facialHair: false },
  { id: "luffy", name: "Monkey D. Luffy", source: "One Piece", emoji: "🏴‍☠️", color: "#d63031", species: "human", gender: "male", alignment: "hero", powers: "superpowers", weapon: "none", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "zoro", name: "Roronoa Zoro", source: "One Piece", emoji: "⚔️", color: "#2ecc71", species: "human", gender: "male", alignment: "hero", powers: "none", weapon: "melee", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "nami", name: "Nami", source: "One Piece", emoji: "🍊", color: "#f39c12", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "melee", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "historia-reiss", name: "Historia Reiss", source: "Attack on Titan", emoji: "👑", color: "#f5cba7", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "melee", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "eren-yeager", name: "Eren Yeager", source: "Attack on Titan", emoji: "🦖", color: "#7f4f24", species: "human", gender: "male", alignment: "hero", powers: "superpowers", weapon: "melee", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "mikasa-ackerman", name: "Mikasa Ackerman", source: "Attack on Titan", emoji: "🧣", color: "#c0392b", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "melee", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "light-yagami", name: "Light Yagami", source: "Death Note", emoji: "📓", color: "#2c3e50", species: "human", gender: "male", alignment: "villain", powers: "none", weapon: "none", format: "animated-tv", age: "teen", costume: false, facialHair: false },
  { id: "winry-rockbell", name: "Winry Rockbell", source: "Fullmetal Alchemist", emoji: "🔧", color: "#f4d03f", species: "human", gender: "female", alignment: "hero", powers: "tech", weapon: "none", format: "animated-tv", age: "teen", costume: false, facialHair: false },
  { id: "edward-elric", name: "Edward Elric", source: "Fullmetal Alchemist", emoji: "⚗️", color: "#c0392b", species: "human", gender: "male", alignment: "hero", powers: "magic", weapon: "melee", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "uraraka", name: "Uraraka Ochako", source: "My Hero Academia", emoji: "🌸", color: "#f8a5c2", species: "human", gender: "female", alignment: "hero", powers: "superpowers", weapon: "none", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "saitama", name: "Saitama", source: "One Punch Man", emoji: "👊", color: "#f1c40f", species: "human", gender: "male", alignment: "hero", powers: "superpowers", weapon: "none", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "tanjiro-kamado", name: "Tanjiro Kamado", source: "Demon Slayer", emoji: "🌊", color: "#2ecc71", species: "human", gender: "male", alignment: "hero", powers: "magic", weapon: "melee", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "nezuko-kamado", name: "Nezuko Kamado", source: "Demon Slayer", emoji: "🎋", color: "#e67e22", species: "magical", gender: "female", alignment: "hero", powers: "superpowers", weapon: "none", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "gojo-satoru", name: "Gojo Satoru", source: "Jujutsu Kaisen", emoji: "🔵", color: "#3498db", species: "human", gender: "male", alignment: "hero", powers: "magic", weapon: "none", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "sailor-moon", name: "Sailor Moon", source: "Sailor Moon", emoji: "🌙", color: "#f8c9d4", species: "human", gender: "female", alignment: "hero", powers: "magic", weapon: "none", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "nobara-kugisaki", name: "Nobara Kugisaki", source: "Jujutsu Kaisen", emoji: "🔨", color: "#e67e22", species: "human", gender: "female", alignment: "hero", powers: "magic", weapon: "melee", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "deku", name: "Izuku Midoriya", source: "My Hero Academia", emoji: "🍀", color: "#27ae60", species: "human", gender: "male", alignment: "hero", powers: "superpowers", weapon: "none", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "faye-valentine", name: "Faye Valentine", source: "Cowboy Bebop", emoji: "🚬", color: "#8e44ad", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "ranged", format: "animated-tv", age: "adult", costume: false, facialHair: false },
  { id: "rem", name: "Rem", source: "Re:Zero", emoji: "🔵", color: "#3498db", species: "magical", gender: "female", alignment: "hero", powers: "magic", weapon: "melee", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "ichigo-kurosaki", name: "Ichigo Kurosaki", source: "Bleach", emoji: "⚔️", color: "#e67e22", species: "human", gender: "male", alignment: "hero", powers: "superpowers", weapon: "melee", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "rukia-kuchiki", name: "Rukia Kuchiki", source: "Bleach", emoji: "❄️", color: "#2c3e50", species: "magical", gender: "female", alignment: "hero", powers: "superpowers", weapon: "melee", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "kakashi-hatake", name: "Kakashi Hatake", source: "Naruto", emoji: "🐺", color: "#7f8c8d", species: "human", gender: "male", alignment: "hero", powers: "magic", weapon: "melee", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "erza-scarlet", name: "Erza Scarlet", source: "Fairy Tail", emoji: "⚔️", color: "#c0392b", species: "human", gender: "female", alignment: "hero", powers: "magic", weapon: "melee", format: "animated-tv", age: "adult", costume: true, facialHair: false },
];

const youtuberCategories: CategoryDef[] = [
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
    key: "niche",
    label: "Content Niche",
    icon: "🎯",
    question: "Is their main content {value}?",
    values: [
      { value: "gaming", label: "Gaming", icon: "🎮" },
      { value: "comedy", label: "Comedy", icon: "😂" },
      { value: "beauty", label: "Beauty", icon: "💄" },
      { value: "education", label: "Education / Tech", icon: "🔬" },
      { value: "vlogging", label: "Vlogging / Lifestyle", icon: "📸" },
    ],
  },
  {
    key: "subscriberTier",
    label: "Subscriber Tier",
    icon: "📊",
    question: "Are they in the {value} subscriber tier?",
    values: [
      { value: "mega", label: "Mega (100M+)", icon: "🌟" },
      { value: "large", label: "Large (10-100M)", icon: "⭐" },
      { value: "mid", label: "Mid (1-10M)", icon: "✨" },
    ],
  },
  {
    key: "groupBased",
    label: "Group Channel",
    icon: "👥",
    question: "Do they run a {value}?",
    values: [
      { value: "true", label: "Group / Duo Channel", icon: "👥" },
      { value: "false", label: "Solo Channel", icon: "🧑" },
    ],
  },
  {
    key: "region",
    label: "Region",
    icon: "🌍",
    question: "Are they based in {value}?",
    values: [
      { value: "north-america", label: "North America", icon: "🌎" },
      { value: "europe", label: "Europe", icon: "🌍" },
    ],
  },
  {
    key: "crossoverFame",
    label: "Crossover Fame",
    icon: "🌟",
    question: "Are they {value}?",
    values: [
      { value: "true", label: "Famous Beyond YouTube", icon: "🌟" },
      { value: "false", label: "YouTube-First Fame", icon: "📹" },
    ],
  },
];

const youtuberCharacters: Character[] = [
  { id: "mrbeast", name: "MrBeast", source: "MrBeast", emoji: "💰", color: "#2ecc71", gender: "male", niche: "comedy", subscriberTier: "mega", groupBased: false, region: "north-america", crossoverFame: false },
  { id: "pewdiepie", name: "PewDiePie", source: "PewDiePie", emoji: "🎮", color: "#e74c3c", gender: "male", niche: "gaming", subscriberTier: "mega", groupBased: false, region: "europe", crossoverFame: false },
  { id: "mark-rober", name: "Mark Rober", source: "Mark Rober", emoji: "🔬", color: "#3498db", gender: "male", niche: "education", subscriberTier: "large", groupBased: false, region: "north-america", crossoverFame: true },
  { id: "mkbhd", name: "MKBHD", source: "MKBHD", emoji: "📱", color: "#2c3e50", gender: "male", niche: "education", subscriberTier: "large", groupBased: false, region: "north-america", crossoverFame: false },
  { id: "logan-paul", name: "Logan Paul", source: "Logan Paul", emoji: "🥊", color: "#e67e22", gender: "male", niche: "vlogging", subscriberTier: "mega", groupBased: false, region: "north-america", crossoverFame: true },
  { id: "ksi", name: "KSI", source: "KSI", emoji: "🎤", color: "#f1c40f", gender: "male", niche: "gaming", subscriberTier: "mega", groupBased: false, region: "europe", crossoverFame: true },
  { id: "jacksepticeye", name: "Jacksepticeye", source: "Jacksepticeye", emoji: "🍀", color: "#27ae60", gender: "male", niche: "gaming", subscriberTier: "large", groupBased: false, region: "europe", crossoverFame: false },
  { id: "markiplier", name: "Markiplier", source: "Markiplier", emoji: "🎬", color: "#c0392b", gender: "male", niche: "gaming", subscriberTier: "large", groupBased: false, region: "north-america", crossoverFame: false },
  { id: "ninja", name: "Ninja", source: "Ninja", emoji: "🕹️", color: "#2980b9", gender: "male", niche: "gaming", subscriberTier: "large", groupBased: false, region: "north-america", crossoverFame: false },
  { id: "james-charles", name: "James Charles", source: "James Charles", emoji: "💄", color: "#8e44ad", gender: "male", niche: "beauty", subscriberTier: "large", groupBased: false, region: "north-america", crossoverFame: false },
  { id: "dude-perfect", name: "Dude Perfect", source: "Dude Perfect", emoji: "🏀", color: "#16a085", gender: "male", niche: "comedy", subscriberTier: "mega", groupBased: true, region: "north-america", crossoverFame: false },
  { id: "ishowspeed", name: "IShowSpeed", source: "IShowSpeed", emoji: "⚡", color: "#e74c3c", gender: "male", niche: "gaming", subscriberTier: "large", groupBased: false, region: "north-america", crossoverFame: true },
  { id: "david-dobrik", name: "David Dobrik", source: "David Dobrik", emoji: "📸", color: "#34495e", gender: "male", niche: "vlogging", subscriberTier: "large", groupBased: false, region: "north-america", crossoverFame: true },
  { id: "jeffree-star", name: "Jeffree Star", source: "Jeffree Star", emoji: "💋", color: "#e91e63", gender: "male", niche: "beauty", subscriberTier: "large", groupBased: false, region: "north-america", crossoverFame: true },
  { id: "kai-cenat", name: "Kai Cenat", source: "Kai Cenat", emoji: "🎙️", color: "#f39c12", gender: "male", niche: "gaming", subscriberTier: "large", groupBased: false, region: "north-america", crossoverFame: false },
  { id: "emma-chamberlain", name: "Emma Chamberlain", source: "Emma Chamberlain", emoji: "☕", color: "#a0522d", gender: "female", niche: "vlogging", subscriberTier: "large", groupBased: false, region: "north-america", crossoverFame: true },
  { id: "sssniperwolf", name: "SSSniperWolf", source: "SSSniperWolf", emoji: "🐺", color: "#8e44ad", gender: "female", niche: "gaming", subscriberTier: "large", groupBased: false, region: "north-america", crossoverFame: false },
  { id: "lilly-singh", name: "Lilly Singh", source: "Lilly Singh", emoji: "😂", color: "#ff6f61", gender: "female", niche: "comedy", subscriberTier: "large", groupBased: false, region: "north-america", crossoverFame: true },
  { id: "liza-koshy", name: "Liza Koshy", source: "Liza Koshy", emoji: "🤪", color: "#ff9f43", gender: "female", niche: "comedy", subscriberTier: "large", groupBased: false, region: "north-america", crossoverFame: true },
  { id: "nikkietutorials", name: "NikkieTutorials", source: "NikkieTutorials", emoji: "💄", color: "#ff69b4", gender: "female", niche: "beauty", subscriberTier: "large", groupBased: false, region: "europe", crossoverFame: false },
  { id: "zoella", name: "Zoella", source: "Zoella", emoji: "🌸", color: "#f8b4c0", gender: "female", niche: "beauty", subscriberTier: "mid", groupBased: false, region: "europe", crossoverFame: true },
  { id: "rosanna-pansino", name: "Rosanna Pansino", source: "Rosanna Pansino", emoji: "🧁", color: "#ffb6c1", gender: "female", niche: "vlogging", subscriberTier: "mid", groupBased: false, region: "north-america", crossoverFame: false },
  { id: "valkyrae", name: "Valkyrae", source: "Valkyrae", emoji: "🎮", color: "#9b59b6", gender: "female", niche: "gaming", subscriberTier: "large", groupBased: false, region: "north-america", crossoverFame: false },
  { id: "pokimane", name: "Pokimane", source: "Pokimane", emoji: "🕹️", color: "#1abc9c", gender: "female", niche: "gaming", subscriberTier: "large", groupBased: false, region: "north-america", crossoverFame: false },
  { id: "colleen-ballinger", name: "Colleen Ballinger", source: "Miranda Sings", emoji: "💋", color: "#c0392b", gender: "female", niche: "comedy", subscriberTier: "large", groupBased: false, region: "north-america", crossoverFame: true },
  { id: "jenna-marbles", name: "Jenna Marbles", source: "Jenna Marbles", emoji: "🐶", color: "#b8860b", gender: "female", niche: "comedy", subscriberTier: "large", groupBased: false, region: "north-america", crossoverFame: false },
  { id: "rclbeauty101", name: "RCLBeauty101", source: "RCLBeauty101", emoji: "💅", color: "#ff6b9d", gender: "female", niche: "comedy", subscriberTier: "large", groupBased: false, region: "north-america", crossoverFame: false },
  { id: "jackie-aina", name: "Jackie Aina", source: "Jackie Aina", emoji: "💄", color: "#8b4513", gender: "female", niche: "beauty", subscriberTier: "mid", groupBased: false, region: "north-america", crossoverFame: false },
  { id: "safiya-nygaard", name: "Safiya Nygaard", source: "Safiya Nygaard", emoji: "🔍", color: "#6c5ce7", gender: "female", niche: "education", subscriberTier: "mid", groupBased: false, region: "north-america", crossoverFame: false },
  { id: "anna-akana", name: "Anna Akana", source: "Anna Akana", emoji: "🎭", color: "#e17055", gender: "female", niche: "comedy", subscriberTier: "mid", groupBased: false, region: "north-america", crossoverFame: true },
];

const actorCategories: CategoryDef[] = [
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
    key: "genre",
    label: "Primary Genre",
    icon: "🎭",
    question: "Are they mainly known for {value} roles?",
    values: [
      { value: "action", label: "Action", icon: "💥" },
      { value: "comedy", label: "Comedy", icon: "😂" },
      { value: "drama", label: "Drama", icon: "🎬" },
    ],
  },
  {
    key: "awardWinner",
    label: "Award Winner",
    icon: "🏆",
    question: "Have they {value}?",
    values: [
      { value: "true", label: "Won an Oscar", icon: "🏆" },
      { value: "false", label: "Not Won an Oscar", icon: "🚫" },
    ],
  },
  {
    key: "franchiseRole",
    label: "Blockbuster Franchise",
    icon: "🚀",
    question: "Have they {value}?",
    values: [
      { value: "true", label: "Played a Major Franchise Role", icon: "🚀" },
      { value: "false", label: "No Major Franchise Role", icon: "🚫" },
    ],
  },
  {
    key: "region",
    label: "Region",
    icon: "🌍",
    question: "Are they from {value}?",
    values: [
      { value: "north-america", label: "North America", icon: "🌎" },
      { value: "europe", label: "Europe", icon: "🌍" },
      { value: "asia", label: "Asia", icon: "🌏" },
      { value: "other", label: "Elsewhere", icon: "🗺️" },
    ],
  },
  {
    key: "breakoutEra",
    label: "Breakout Era",
    icon: "📅",
    question: "Did they break out {value}?",
    values: [
      { value: "veteran", label: "Before 2010", icon: "📼" },
      { value: "newer", label: "2010 or Later", icon: "🆕" },
    ],
  },
];

const actorCharacters: Character[] = [
  { id: "tom-cruise", name: "Tom Cruise", source: "Mission: Impossible", emoji: "🛩️", color: "#34495e", gender: "male", genre: "action", awardWinner: false, franchiseRole: true, region: "north-america", breakoutEra: "veteran" },
  { id: "dwayne-johnson", name: "Dwayne Johnson", source: "Jumanji / Fast & Furious", emoji: "💪", color: "#2c3e50", gender: "male", genre: "action", awardWinner: false, franchiseRole: true, region: "north-america", breakoutEra: "newer" },
  { id: "leonardo-dicaprio", name: "Leonardo DiCaprio", source: "Titanic", emoji: "🚢", color: "#2980b9", gender: "male", genre: "drama", awardWinner: true, franchiseRole: false, region: "north-america", breakoutEra: "veteran" },
  { id: "robert-downey-jr", name: "Robert Downey Jr.", source: "Iron Man (MCU)", emoji: "🦾", color: "#c0392b", gender: "male", genre: "action", awardWinner: true, franchiseRole: true, region: "north-america", breakoutEra: "veteran" },
  { id: "chris-hemsworth", name: "Chris Hemsworth", source: "Thor (MCU)", emoji: "🔨", color: "#e74c3c", gender: "male", genre: "action", awardWinner: false, franchiseRole: true, region: "other", breakoutEra: "newer" },
  { id: "chris-evans", name: "Chris Evans", source: "Captain America (MCU)", emoji: "🛡️", color: "#1f3a93", gender: "male", genre: "action", awardWinner: false, franchiseRole: true, region: "north-america", breakoutEra: "newer" },
  { id: "tom-holland", name: "Tom Holland", source: "Spider-Man (MCU)", emoji: "🕷️", color: "#a11d2e", gender: "male", genre: "action", awardWinner: false, franchiseRole: true, region: "europe", breakoutEra: "newer" },
  { id: "denzel-washington", name: "Denzel Washington", source: "Training Day", emoji: "🎬", color: "#6d4c41", gender: "male", genre: "drama", awardWinner: true, franchiseRole: false, region: "north-america", breakoutEra: "veteran" },
  { id: "will-smith", name: "Will Smith", source: "Men in Black", emoji: "🕶️", color: "#34495e", gender: "male", genre: "action", awardWinner: true, franchiseRole: true, region: "north-america", breakoutEra: "veteran" },
  { id: "ryan-reynolds", name: "Ryan Reynolds", source: "Deadpool", emoji: "🗡️", color: "#a11d2e", gender: "male", genre: "comedy", awardWinner: false, franchiseRole: true, region: "north-america", breakoutEra: "newer" },
  { id: "timothee-chalamet", name: "Timothée Chalamet", source: "Dune", emoji: "🏜️", color: "#d4a76a", gender: "male", genre: "drama", awardWinner: false, franchiseRole: true, region: "north-america", breakoutEra: "newer" },
  { id: "keanu-reeves", name: "Keanu Reeves", source: "John Wick", emoji: "🕴️", color: "#2c2c2c", gender: "male", genre: "action", awardWinner: false, franchiseRole: true, region: "north-america", breakoutEra: "veteran" },
  { id: "hugh-jackman", name: "Hugh Jackman", source: "Wolverine (X-Men)", emoji: "🦾", color: "#7f8c8d", gender: "male", genre: "action", awardWinner: false, franchiseRole: true, region: "other", breakoutEra: "veteran" },
  { id: "idris-elba", name: "Idris Elba", source: "Luther", emoji: "🕵️", color: "#2c3e50", gender: "male", genre: "action", awardWinner: false, franchiseRole: true, region: "europe", breakoutEra: "newer" },
  { id: "jason-statham", name: "Jason Statham", source: "Fast & Furious", emoji: "🏎️", color: "#34495e", gender: "male", genre: "action", awardWinner: false, franchiseRole: true, region: "europe", breakoutEra: "veteran" },
  { id: "meryl-streep", name: "Meryl Streep", source: "The Devil Wears Prada", emoji: "👑", color: "#8e44ad", gender: "female", genre: "drama", awardWinner: true, franchiseRole: false, region: "north-america", breakoutEra: "veteran" },
  { id: "scarlett-johansson", name: "Scarlett Johansson", source: "Black Widow (MCU)", emoji: "🕸️", color: "#922b21", gender: "female", genre: "action", awardWinner: false, franchiseRole: true, region: "north-america", breakoutEra: "veteran" },
  { id: "jennifer-lawrence", name: "Jennifer Lawrence", source: "The Hunger Games", emoji: "🏹", color: "#5a5a3c", gender: "female", genre: "drama", awardWinner: true, franchiseRole: true, region: "north-america", breakoutEra: "newer" },
  { id: "zendaya", name: "Zendaya", source: "Dune / Spider-Man", emoji: "✨", color: "#6c3483", gender: "female", genre: "drama", awardWinner: false, franchiseRole: true, region: "north-america", breakoutEra: "newer" },
  { id: "margot-robbie", name: "Margot Robbie", source: "Barbie", emoji: "💗", color: "#ff69b4", gender: "female", genre: "comedy", awardWinner: false, franchiseRole: true, region: "other", breakoutEra: "newer" },
  { id: "emma-stone", name: "Emma Stone", source: "La La Land", emoji: "🌟", color: "#f39c12", gender: "female", genre: "comedy", awardWinner: true, franchiseRole: false, region: "north-america", breakoutEra: "newer" },
  { id: "angelina-jolie", name: "Angelina Jolie", source: "Tomb Raider", emoji: "🏺", color: "#6d4c41", gender: "female", genre: "action", awardWinner: true, franchiseRole: true, region: "north-america", breakoutEra: "veteran" },
  { id: "charlize-theron", name: "Charlize Theron", source: "Mad Max: Fury Road", emoji: "🏜️", color: "#b9770e", gender: "female", genre: "action", awardWinner: true, franchiseRole: true, region: "other", breakoutEra: "veteran" },
  { id: "gal-gadot", name: "Gal Gadot", source: "Wonder Woman", emoji: "🛡️", color: "#c0392b", gender: "female", genre: "action", awardWinner: false, franchiseRole: true, region: "other", breakoutEra: "newer" },
  { id: "anne-hathaway", name: "Anne Hathaway", source: "The Princess Diaries", emoji: "👗", color: "#8e44ad", gender: "female", genre: "drama", awardWinner: true, franchiseRole: false, region: "north-america", breakoutEra: "veteran" },
  { id: "sandra-bullock", name: "Sandra Bullock", source: "Gravity", emoji: "🚀", color: "#2980b9", gender: "female", genre: "comedy", awardWinner: true, franchiseRole: false, region: "north-america", breakoutEra: "veteran" },
  { id: "emma-watson", name: "Emma Watson", source: "Harry Potter", emoji: "📚", color: "#2e6b4f", gender: "female", genre: "drama", awardWinner: false, franchiseRole: true, region: "europe", breakoutEra: "veteran" },
  { id: "priyanka-chopra", name: "Priyanka Chopra", source: "Citadel", emoji: "🎬", color: "#b03a2e", gender: "female", genre: "drama", awardWinner: false, franchiseRole: false, region: "asia", breakoutEra: "newer" },
  { id: "florence-pugh", name: "Florence Pugh", source: "Black Widow (MCU)", emoji: "🌸", color: "#cd6155", gender: "female", genre: "drama", awardWinner: false, franchiseRole: true, region: "europe", breakoutEra: "newer" },
  { id: "millie-bobby-brown", name: "Millie Bobby Brown", source: "Godzilla", emoji: "🦖", color: "#7f4f24", gender: "female", genre: "drama", awardWinner: false, franchiseRole: true, region: "europe", breakoutEra: "newer" },
];

const musicianCategories: CategoryDef[] = [
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
    key: "genre",
    label: "Genre",
    icon: "🎵",
    question: "Do they mainly make {value} music?",
    values: [
      { value: "pop", label: "Pop", icon: "🎤" },
      { value: "hip-hop", label: "Hip-Hop / Rap", icon: "🎧" },
      { value: "rock", label: "Rock", icon: "🎸" },
      { value: "rnb", label: "R&B", icon: "🎹" },
      { value: "country", label: "Country", icon: "🤠" },
    ],
  },
  {
    key: "awardWinner",
    label: "Grammy Winner",
    icon: "🏆",
    question: "Have they {value}?",
    values: [
      { value: "true", label: "Won a Grammy", icon: "🏆" },
      { value: "false", label: "Not Won a Grammy", icon: "🚫" },
    ],
  },
  {
    key: "groupBased",
    label: "Solo or Group",
    icon: "👥",
    question: "Are they a {value}?",
    values: [
      { value: "true", label: "Group / Band", icon: "👥" },
      { value: "false", label: "Solo Artist", icon: "🧑" },
    ],
  },
  {
    key: "region",
    label: "Region",
    icon: "🌍",
    question: "Are they from {value}?",
    values: [
      { value: "north-america", label: "North America", icon: "🌎" },
      { value: "europe", label: "Europe", icon: "🌍" },
      { value: "asia", label: "Asia", icon: "🌏" },
      { value: "other", label: "Elsewhere", icon: "🗺️" },
    ],
  },
  {
    key: "breakoutEra",
    label: "Breakout Era",
    icon: "📅",
    question: "Did they break out {value}?",
    values: [
      { value: "veteran", label: "Before 2010", icon: "📼" },
      { value: "newer", label: "2010 or Later", icon: "🆕" },
    ],
  },
];

const musicianCharacters: Character[] = [
  { id: "drake", name: "Drake", source: "Hip-Hop", emoji: "🦉", color: "#d4af37", gender: "male", genre: "hip-hop", awardWinner: true, groupBased: false, region: "north-america", breakoutEra: "newer" },
  { id: "ed-sheeran", name: "Ed Sheeran", source: "Pop / Folk", emoji: "🎸", color: "#e67e22", gender: "male", genre: "pop", awardWinner: true, groupBased: false, region: "europe", breakoutEra: "newer" },
  { id: "bruno-mars", name: "Bruno Mars", source: "Pop / Funk", emoji: "🎤", color: "#f1c40f", gender: "male", genre: "pop", awardWinner: true, groupBased: false, region: "north-america", breakoutEra: "newer" },
  { id: "justin-bieber", name: "Justin Bieber", source: "Pop", emoji: "🎵", color: "#3498db", gender: "male", genre: "pop", awardWinner: true, groupBased: false, region: "north-america", breakoutEra: "newer" },
  { id: "the-weeknd", name: "The Weeknd", source: "R&B", emoji: "🌙", color: "#c0392b", gender: "male", genre: "rnb", awardWinner: true, groupBased: false, region: "north-america", breakoutEra: "newer" },
  { id: "kendrick-lamar", name: "Kendrick Lamar", source: "Hip-Hop", emoji: "🎙️", color: "#27ae60", gender: "male", genre: "hip-hop", awardWinner: true, groupBased: false, region: "north-america", breakoutEra: "newer" },
  { id: "eminem", name: "Eminem", source: "Hip-Hop", emoji: "🎧", color: "#7f8c8d", gender: "male", genre: "hip-hop", awardWinner: true, groupBased: false, region: "north-america", breakoutEra: "veteran" },
  { id: "jay-z", name: "Jay-Z", source: "Hip-Hop", emoji: "👑", color: "#1a1a1a", gender: "male", genre: "hip-hop", awardWinner: true, groupBased: false, region: "north-america", breakoutEra: "veteran" },
  { id: "bruce-springsteen", name: "Bruce Springsteen", source: "Rock", emoji: "🎸", color: "#1f3a93", gender: "male", genre: "rock", awardWinner: true, groupBased: false, region: "north-america", breakoutEra: "veteran" },
  { id: "elton-john", name: "Elton John", source: "Pop / Rock", emoji: "🎹", color: "#f39c12", gender: "male", genre: "rock", awardWinner: true, groupBased: false, region: "europe", breakoutEra: "veteran" },
  { id: "harry-styles", name: "Harry Styles", source: "Pop", emoji: "🎀", color: "#e91e63", gender: "male", genre: "pop", awardWinner: true, groupBased: false, region: "europe", breakoutEra: "newer" },
  { id: "post-malone", name: "Post Malone", source: "Hip-Hop / Pop", emoji: "🎶", color: "#616a6b", gender: "male", genre: "hip-hop", awardWinner: false, groupBased: false, region: "north-america", breakoutEra: "newer" },
  { id: "coldplay", name: "Coldplay", source: "Rock", emoji: "🌟", color: "#f1c40f", gender: "male", genre: "rock", awardWinner: true, groupBased: true, region: "europe", breakoutEra: "veteran" },
  { id: "kanye-west", name: "Kanye West", source: "Hip-Hop", emoji: "🎤", color: "#8b4513", gender: "male", genre: "hip-hop", awardWinner: true, groupBased: false, region: "north-america", breakoutEra: "veteran" },
  { id: "bts", name: "BTS", source: "K-Pop", emoji: "💜", color: "#8e44ad", gender: "male", genre: "pop", awardWinner: false, groupBased: true, region: "asia", breakoutEra: "newer" },
  { id: "taylor-swift", name: "Taylor Swift", source: "Pop / Country", emoji: "🎤", color: "#e91e63", gender: "female", genre: "country", awardWinner: true, groupBased: false, region: "north-america", breakoutEra: "newer" },
  { id: "beyonce", name: "Beyoncé", source: "R&B / Pop", emoji: "👑", color: "#f1c40f", gender: "female", genre: "rnb", awardWinner: true, groupBased: false, region: "north-america", breakoutEra: "veteran" },
  { id: "rihanna", name: "Rihanna", source: "Pop / R&B", emoji: "💎", color: "#922b21", gender: "female", genre: "rnb", awardWinner: true, groupBased: false, region: "other", breakoutEra: "veteran" },
  { id: "ariana-grande", name: "Ariana Grande", source: "Pop", emoji: "🎀", color: "#a569bd", gender: "female", genre: "pop", awardWinner: true, groupBased: false, region: "north-america", breakoutEra: "newer" },
  { id: "adele", name: "Adele", source: "Pop / Soul", emoji: "🎙️", color: "#34495e", gender: "female", genre: "pop", awardWinner: true, groupBased: false, region: "europe", breakoutEra: "newer" },
  { id: "billie-eilish", name: "Billie Eilish", source: "Pop / Alt", emoji: "🖤", color: "#1a1a1a", gender: "female", genre: "pop", awardWinner: true, groupBased: false, region: "north-america", breakoutEra: "newer" },
  { id: "dua-lipa", name: "Dua Lipa", source: "Pop", emoji: "✨", color: "#ec407a", gender: "female", genre: "pop", awardWinner: true, groupBased: false, region: "europe", breakoutEra: "newer" },
  { id: "katy-perry", name: "Katy Perry", source: "Pop", emoji: "🍭", color: "#ff6f91", gender: "female", genre: "pop", awardWinner: false, groupBased: false, region: "north-america", breakoutEra: "newer" },
  { id: "lady-gaga", name: "Lady Gaga", source: "Pop", emoji: "🎭", color: "#c0392b", gender: "female", genre: "pop", awardWinner: true, groupBased: false, region: "north-america", breakoutEra: "newer" },
  { id: "nicki-minaj", name: "Nicki Minaj", source: "Hip-Hop", emoji: "💅", color: "#ff69b4", gender: "female", genre: "hip-hop", awardWinner: false, groupBased: false, region: "other", breakoutEra: "newer" },
  { id: "cardi-b", name: "Cardi B", source: "Hip-Hop", emoji: "💃", color: "#d63384", gender: "female", genre: "hip-hop", awardWinner: true, groupBased: false, region: "north-america", breakoutEra: "newer" },
  { id: "shakira", name: "Shakira", source: "Pop / Latin", emoji: "🐺", color: "#e67e22", gender: "female", genre: "pop", awardWinner: true, groupBased: false, region: "other", breakoutEra: "veteran" },
  { id: "miley-cyrus", name: "Miley Cyrus", source: "Pop", emoji: "🔨", color: "#f4d03f", gender: "female", genre: "pop", awardWinner: true, groupBased: false, region: "north-america", breakoutEra: "veteran" },
  { id: "blackpink", name: "Blackpink", source: "K-Pop", emoji: "🖤", color: "#ff1493", gender: "female", genre: "pop", awardWinner: false, groupBased: true, region: "asia", breakoutEra: "newer" },
  { id: "olivia-rodrigo", name: "Olivia Rodrigo", source: "Pop", emoji: "💜", color: "#9b59b6", gender: "female", genre: "pop", awardWinner: true, groupBased: false, region: "north-america", breakoutEra: "newer" },
];

export const packs: Pack[] = [
  { key: "classic", label: "Movies & TV Characters", icon: "🎬", characters: classicCharacters, categories: classicCategories },
  { key: "anime", label: "Anime Characters", icon: "🍥", characters: animeCharacters, categories: classicCategories },
  { key: "youtubers", label: "YouTubers", icon: "▶️", characters: youtuberCharacters, categories: youtuberCategories },
  { key: "actors", label: "Movie Character Actors", icon: "🎥", characters: actorCharacters, categories: actorCategories },
  { key: "musicians", label: "Musicians", icon: "🎵", characters: musicianCharacters, categories: musicianCategories },
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

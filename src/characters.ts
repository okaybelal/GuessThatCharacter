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
  // real-person packs attach their own attribute keys here
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

const fictionalCategories: CategoryDef[] = [
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
  { id: "tom-cruise", name: "Ethan Hunt", source: "Tom Cruise · Mission: Impossible", emoji: "🛩️", color: "#34495e", gender: "male", genre: "action", awardWinner: false, franchiseRole: true, region: "north-america", breakoutEra: "veteran" },
  { id: "dwayne-johnson", name: "Luke Hobbs", source: "Dwayne Johnson · Fast & Furious", emoji: "💪", color: "#2c3e50", gender: "male", genre: "action", awardWinner: false, franchiseRole: true, region: "north-america", breakoutEra: "newer" },
  { id: "leonardo-dicaprio", name: "Jack Dawson", source: "Leonardo DiCaprio · Titanic", emoji: "🚢", color: "#2980b9", gender: "male", genre: "drama", awardWinner: true, franchiseRole: false, region: "north-america", breakoutEra: "veteran" },
  { id: "robert-downey-jr", name: "Tony Stark", source: "Robert Downey Jr. · Iron Man (MCU)", emoji: "🦾", color: "#c0392b", gender: "male", genre: "action", awardWinner: true, franchiseRole: true, region: "north-america", breakoutEra: "veteran" },
  { id: "chris-hemsworth", name: "Thor", source: "Chris Hemsworth · Thor (MCU)", emoji: "🔨", color: "#e74c3c", gender: "male", genre: "action", awardWinner: false, franchiseRole: true, region: "other", breakoutEra: "newer" },
  { id: "chris-evans", name: "Steve Rogers", source: "Chris Evans · Captain America (MCU)", emoji: "🛡️", color: "#1f3a93", gender: "male", genre: "action", awardWinner: false, franchiseRole: true, region: "north-america", breakoutEra: "newer" },
  { id: "tom-holland", name: "Peter Parker", source: "Tom Holland · Spider-Man (MCU)", emoji: "🕷️", color: "#a11d2e", gender: "male", genre: "action", awardWinner: false, franchiseRole: true, region: "europe", breakoutEra: "newer" },
  { id: "denzel-washington", name: "Alonzo Harris", source: "Denzel Washington · Training Day", emoji: "🎬", color: "#6d4c41", gender: "male", genre: "drama", awardWinner: true, franchiseRole: false, region: "north-america", breakoutEra: "veteran" },
  { id: "will-smith", name: "Agent J", source: "Will Smith · Men in Black", emoji: "🕶️", color: "#34495e", gender: "male", genre: "action", awardWinner: true, franchiseRole: true, region: "north-america", breakoutEra: "veteran" },
  { id: "ryan-reynolds", name: "Wade Wilson", source: "Ryan Reynolds · Deadpool", emoji: "🗡️", color: "#a11d2e", gender: "male", genre: "comedy", awardWinner: false, franchiseRole: true, region: "north-america", breakoutEra: "newer" },
  { id: "timothee-chalamet", name: "Paul Atreides", source: "Timothée Chalamet · Dune", emoji: "🏜️", color: "#d4a76a", gender: "male", genre: "drama", awardWinner: false, franchiseRole: true, region: "north-america", breakoutEra: "newer" },
  { id: "keanu-reeves", name: "John Wick", source: "Keanu Reeves · John Wick", emoji: "🕴️", color: "#2c2c2c", gender: "male", genre: "action", awardWinner: false, franchiseRole: true, region: "north-america", breakoutEra: "veteran" },
  { id: "hugh-jackman", name: "Wolverine", source: "Hugh Jackman · X-Men", emoji: "🦾", color: "#7f8c8d", gender: "male", genre: "action", awardWinner: false, franchiseRole: true, region: "other", breakoutEra: "veteran" },
  { id: "idris-elba", name: "Nate Samuels", source: "Idris Elba · Beast", emoji: "🕵️", color: "#2c3e50", gender: "male", genre: "action", awardWinner: false, franchiseRole: true, region: "europe", breakoutEra: "newer" },
  { id: "jason-statham", name: "Frank Martin", source: "Jason Statham · The Transporter", emoji: "🏎️", color: "#34495e", gender: "male", genre: "action", awardWinner: false, franchiseRole: true, region: "europe", breakoutEra: "veteran" },
  { id: "meryl-streep", name: "Miranda Priestly", source: "Meryl Streep · The Devil Wears Prada", emoji: "👑", color: "#8e44ad", gender: "female", genre: "drama", awardWinner: true, franchiseRole: false, region: "north-america", breakoutEra: "veteran" },
  { id: "scarlett-johansson", name: "Natasha Romanoff", source: "Scarlett Johansson · Black Widow (MCU)", emoji: "🕸️", color: "#922b21", gender: "female", genre: "action", awardWinner: false, franchiseRole: true, region: "north-america", breakoutEra: "veteran" },
  { id: "jennifer-lawrence", name: "Katniss Everdeen", source: "Jennifer Lawrence · The Hunger Games", emoji: "🏹", color: "#5a5a3c", gender: "female", genre: "drama", awardWinner: true, franchiseRole: true, region: "north-america", breakoutEra: "newer" },
  { id: "zendaya", name: "Anne Wheeler", source: "Zendaya · The Greatest Showman", emoji: "✨", color: "#6c3483", gender: "female", genre: "drama", awardWinner: false, franchiseRole: false, region: "north-america", breakoutEra: "newer" },
  { id: "margot-robbie", name: "Barbie", source: "Margot Robbie · Barbie", emoji: "💗", color: "#ff69b4", gender: "female", genre: "comedy", awardWinner: false, franchiseRole: true, region: "other", breakoutEra: "newer" },
  { id: "emma-stone", name: "Mia Dolan", source: "Emma Stone · La La Land", emoji: "🌟", color: "#f39c12", gender: "female", genre: "comedy", awardWinner: true, franchiseRole: false, region: "north-america", breakoutEra: "newer" },
  { id: "angelina-jolie", name: "Lara Croft", source: "Angelina Jolie · Tomb Raider", emoji: "🏺", color: "#6d4c41", gender: "female", genre: "action", awardWinner: true, franchiseRole: true, region: "north-america", breakoutEra: "veteran" },
  { id: "charlize-theron", name: "Imperator Furiosa", source: "Charlize Theron · Mad Max: Fury Road", emoji: "🏜️", color: "#b9770e", gender: "female", genre: "action", awardWinner: true, franchiseRole: true, region: "other", breakoutEra: "veteran" },
  { id: "gal-gadot", name: "Diana Prince", source: "Gal Gadot · Wonder Woman", emoji: "🛡️", color: "#c0392b", gender: "female", genre: "action", awardWinner: false, franchiseRole: true, region: "other", breakoutEra: "newer" },
  { id: "anne-hathaway", name: "Mia Thermopolis", source: "Anne Hathaway · The Princess Diaries", emoji: "👗", color: "#8e44ad", gender: "female", genre: "drama", awardWinner: true, franchiseRole: false, region: "north-america", breakoutEra: "veteran" },
  { id: "sandra-bullock", name: "Ryan Stone", source: "Sandra Bullock · Gravity", emoji: "🚀", color: "#2980b9", gender: "female", genre: "comedy", awardWinner: true, franchiseRole: false, region: "north-america", breakoutEra: "veteran" },
  { id: "emma-watson", name: "Hermione Granger", source: "Emma Watson · Harry Potter", emoji: "📚", color: "#2e6b4f", gender: "female", genre: "drama", awardWinner: false, franchiseRole: true, region: "europe", breakoutEra: "veteran" },
  { id: "priyanka-chopra", name: "Nadia Sinh", source: "Priyanka Chopra · Citadel", emoji: "🎬", color: "#b03a2e", gender: "female", genre: "drama", awardWinner: false, franchiseRole: false, region: "asia", breakoutEra: "newer" },
  { id: "florence-pugh", name: "Amy March", source: "Florence Pugh · Little Women", emoji: "🌸", color: "#cd6155", gender: "female", genre: "drama", awardWinner: false, franchiseRole: false, region: "europe", breakoutEra: "newer" },
  { id: "millie-bobby-brown", name: "Madison Russell", source: "Millie Bobby Brown · Godzilla", emoji: "🦖", color: "#7f4f24", gender: "female", genre: "drama", awardWinner: false, franchiseRole: true, region: "europe", breakoutEra: "newer" },
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

const tvActorCategories: CategoryDef[] = [
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
    label: "Character Alignment",
    icon: "⚖️",
    question: "Is their signature character a {value}?",
    values: [
      { value: "hero", label: "Hero", icon: "🦸" },
      { value: "villain", label: "Villain", icon: "🦹" },
    ],
  },
  {
    key: "species",
    label: "Character Species",
    icon: "🧬",
    question: "Is their signature character {value}?",
    values: [
      { value: "human", label: "Human", icon: "🧑" },
      { value: "creature", label: "Creature", icon: "🐾" },
      { value: "robot", label: "Robot", icon: "🤖" },
      { value: "magical", label: "Magical Being", icon: "🧝" },
    ],
  },
  {
    key: "powers",
    label: "Character Powers",
    icon: "✨",
    question: "Does their signature character have {value} powers?",
    values: [
      { value: "none", label: "None", icon: "🚫" },
      { value: "superpowers", label: "Superpowers", icon: "💪" },
      { value: "magic", label: "Magic", icon: "🪄" },
      { value: "tech", label: "Tech / Skill", icon: "🛠️" },
    ],
  },
  {
    key: "weapon",
    label: "Character Weapon",
    icon: "🗡️",
    question: "Does their signature character use a {value} weapon?",
    values: [
      { value: "none", label: "None", icon: "🚫" },
      { value: "melee", label: "Melee", icon: "⚔️" },
      { value: "ranged", label: "Ranged", icon: "🏹" },
      { value: "magic", label: "Magic / Energy", icon: "🔮" },
    ],
  },
  {
    key: "costume",
    label: "Costume",
    icon: "🎭",
    question: "Does their signature character wear a costume?",
    values: [
      { value: "true", label: "Wears a costume", icon: "✅" },
      { value: "false", label: "No costume", icon: "❌" },
    ],
  },
];

const tvActorCharacters: Character[] = [
  { id: "bryan-cranston", name: "Walter White", source: "Bryan Cranston · Breaking Bad", emoji: "🧪", color: "#2f7d4f", gender: "male", alignment: "villain", species: "human", powers: "none", weapon: "ranged", costume: false },
  { id: "pedro-pascal", name: "Din Djarin", source: "Pedro Pascal · The Mandalorian", emoji: "🛡️", color: "#4a4a4a", gender: "male", alignment: "hero", species: "human", powers: "none", weapon: "ranged", costume: true },
  { id: "steve-carell", name: "Michael Scott", source: "Steve Carell · The Office", emoji: "📎", color: "#3b6ea5", gender: "male", alignment: "hero", species: "human", powers: "none", weapon: "none", costume: false },
  { id: "peter-dinklage", name: "Tyrion Lannister", source: "Peter Dinklage · Game of Thrones", emoji: "🍺", color: "#7a1f1f", gender: "male", alignment: "hero", species: "human", powers: "none", weapon: "none", costume: false },
  { id: "henry-cavill", name: "Geralt of Rivia", source: "Henry Cavill · The Witcher", emoji: "🗡️", color: "#34495e", gender: "male", alignment: "hero", species: "creature", powers: "magic", weapon: "melee", costume: true },
  { id: "jason-sudeikis", name: "Ted Lasso", source: "Jason Sudeikis · Ted Lasso", emoji: "⚽", color: "#f1c40f", gender: "male", alignment: "hero", species: "human", powers: "none", weapon: "none", costume: false },
  { id: "bob-odenkirk", name: "Saul Goodman", source: "Bob Odenkirk · Better Call Saul", emoji: "💼", color: "#c0392b", gender: "male", alignment: "villain", species: "human", powers: "none", weapon: "none", costume: false },
  { id: "sterling-k-brown", name: "Randall Pearson", source: "Sterling K. Brown · This Is Us", emoji: "🎭", color: "#2c3e50", gender: "male", alignment: "hero", species: "human", powers: "none", weapon: "none", costume: false },
  { id: "norman-reedus", name: "Daryl Dixon", source: "Norman Reedus · The Walking Dead", emoji: "🏹", color: "#556b2f", gender: "male", alignment: "hero", species: "human", powers: "none", weapon: "ranged", costume: false },
  { id: "michael-c-hall", name: "Dexter Morgan", source: "Michael C. Hall · Dexter", emoji: "🔪", color: "#922b21", gender: "male", alignment: "villain", species: "human", powers: "none", weapon: "melee", costume: false },
  { id: "lee-jung-jae", name: "Seong Gi-hun", source: "Lee Jung-jae · Squid Game", emoji: "🦑", color: "#e91e63", gender: "male", alignment: "hero", species: "human", powers: "none", weapon: "none", costume: false },
  { id: "brent-spiner", name: "Data", source: "Brent Spiner · Star Trek: TNG", emoji: "🤖", color: "#7f8c8d", gender: "male", alignment: "hero", species: "robot", powers: "tech", weapon: "none", costume: true },
  { id: "rami-malek", name: "Elliot Alderson", source: "Rami Malek · Mr. Robot", emoji: "💻", color: "#1a1a2e", gender: "male", alignment: "hero", species: "human", powers: "none", weapon: "none", costume: false },
  { id: "antony-starr", name: "Homelander", source: "Antony Starr · The Boys", emoji: "🦸", color: "#002868", gender: "male", alignment: "villain", species: "human", powers: "superpowers", weapon: "none", costume: true },
  { id: "david-harbour", name: "Jim Hopper", source: "David Harbour · Stranger Things", emoji: "🚬", color: "#8b7355", gender: "male", alignment: "hero", species: "human", powers: "none", weapon: "ranged", costume: false },
  { id: "elisabeth-moss", name: "June Osborne", source: "Elisabeth Moss · The Handmaid's Tale", emoji: "🔴", color: "#a93226", gender: "female", alignment: "hero", species: "human", powers: "none", weapon: "none", costume: true },
  { id: "anya-taylor-joy", name: "Beth Harmon", source: "Anya Taylor-Joy · The Queen's Gambit", emoji: "♟️", color: "#34495e", gender: "female", alignment: "hero", species: "human", powers: "tech", weapon: "none", costume: false },
  { id: "jennifer-aniston", name: "Rachel Green", source: "Jennifer Aniston · Friends", emoji: "☕", color: "#d4a76a", gender: "female", alignment: "hero", species: "human", powers: "none", weapon: "none", costume: false },
  { id: "reese-witherspoon", name: "Bradley Jackson", source: "Reese Witherspoon · The Morning Show", emoji: "📺", color: "#f4d03f", gender: "female", alignment: "hero", species: "human", powers: "none", weapon: "none", costume: false },
  { id: "nicole-kidman", name: "Celeste Wright", source: "Nicole Kidman · Big Little Lies", emoji: "🌊", color: "#85c1e9", gender: "female", alignment: "hero", species: "human", powers: "none", weapon: "none", costume: false },
  { id: "sarah-paulson", name: "Cordelia Goode", source: "Sarah Paulson · American Horror Story", emoji: "🕯️", color: "#6c3483", gender: "female", alignment: "villain", species: "human", powers: "magic", weapon: "none", costume: false },
  { id: "viola-davis", name: "Annalise Keating", source: "Viola Davis · How to Get Away with Murder", emoji: "⚖️", color: "#6d4c41", gender: "female", alignment: "hero", species: "human", powers: "none", weapon: "none", costume: false },
  { id: "julia-garner", name: "Ruth Langmore", source: "Julia Garner · Ozark", emoji: "💵", color: "#145a32", gender: "female", alignment: "villain", species: "human", powers: "none", weapon: "ranged", costume: false },
  { id: "jenna-ortega", name: "Wednesday Addams", source: "Jenna Ortega · Wednesday", emoji: "🖤", color: "#2b2b2b", gender: "female", alignment: "hero", species: "human", powers: "superpowers", weapon: "none", costume: false },
  { id: "kaley-cuoco", name: "Penny", source: "Kaley Cuoco · The Big Bang Theory", emoji: "🧠", color: "#f5b041", gender: "female", alignment: "hero", species: "human", powers: "none", weapon: "none", costume: false },
  { id: "elizabeth-olsen", name: "Wanda Maximoff", source: "Elizabeth Olsen · WandaVision", emoji: "🔴", color: "#922b21", gender: "female", alignment: "hero", species: "magical", powers: "magic", weapon: "magic", costume: true },
  { id: "sydney-sweeney", name: "Cassie Howard", source: "Sydney Sweeney · Euphoria", emoji: "💧", color: "#ff6f91", gender: "female", alignment: "hero", species: "human", powers: "none", weapon: "none", costume: false },
  { id: "elizabeth-debicki", name: "Princess Diana", source: "Elizabeth Debicki · The Crown", emoji: "👑", color: "#f5f5f5", gender: "female", alignment: "hero", species: "human", powers: "none", weapon: "none", costume: true },
  { id: "rachel-brosnahan", name: "Midge Maisel", source: "Rachel Brosnahan · The Marvelous Mrs. Maisel", emoji: "🎤", color: "#c0392b", gender: "female", alignment: "hero", species: "human", powers: "none", weapon: "none", costume: false },
  { id: "keri-russell", name: "Elizabeth Jennings", source: "Keri Russell · The Americans", emoji: "🕵️‍♀️", color: "#4a4a4a", gender: "female", alignment: "hero", species: "human", powers: "none", weapon: "ranged", costume: false },
];

const cartoonCharacters: Character[] = [
  { id: "spongebob-cartoon", name: "SpongeBob SquarePants", source: "SpongeBob SquarePants", emoji: "🧽", color: "#f4c542", species: "creature", gender: "male", alignment: "hero", powers: "none", weapon: "none", format: "animated-tv", age: "adult", costume: false, facialHair: false },
  { id: "homer-simpson", name: "Homer Simpson", source: "The Simpsons", emoji: "🍩", color: "#f2c14e", species: "human", gender: "male", alignment: "hero", powers: "none", weapon: "none", format: "animated-tv", age: "adult", costume: false, facialHair: false },
  { id: "shrek-cartoon", name: "Shrek", source: "Shrek", emoji: "🟢", color: "#5b8c3e", species: "creature", gender: "male", alignment: "hero", powers: "none", weapon: "none", format: "animated-movie", age: "adult", costume: false, facialHair: false },
  { id: "bugs-bunny", name: "Bugs Bunny", source: "Looney Tunes", emoji: "🥕", color: "#b5a642", species: "creature", gender: "male", alignment: "hero", powers: "none", weapon: "none", format: "animated-tv", age: "adult", costume: false, facialHair: false },
  { id: "mickey-mouse", name: "Mickey Mouse", source: "Mickey Mouse", emoji: "🐭", color: "#ff0000", species: "creature", gender: "male", alignment: "hero", powers: "none", weapon: "none", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "scooby-doo-cartoon", name: "Scooby-Doo", source: "Scooby-Doo", emoji: "🐕", color: "#a0522d", species: "creature", gender: "male", alignment: "hero", powers: "none", weapon: "none", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "rick-sanchez-cartoon", name: "Rick Sanchez", source: "Rick and Morty", emoji: "🧪", color: "#6fae6f", species: "human", gender: "male", alignment: "hero", powers: "tech", weapon: "ranged", format: "animated-tv", age: "elder", costume: false, facialHair: false },
  { id: "peter-griffin-cartoon", name: "Peter Griffin", source: "Family Guy", emoji: "🍺", color: "#e0b13f", species: "human", gender: "male", alignment: "hero", powers: "none", weapon: "none", format: "animated-tv", age: "adult", costume: false, facialHair: false },
  { id: "scar-lion-king", name: "Scar", source: "The Lion King", emoji: "🦁", color: "#4a3728", species: "creature", gender: "male", alignment: "villain", powers: "none", weapon: "none", format: "animated-movie", age: "adult", costume: false, facialHair: false },
  { id: "papa-smurf", name: "Papa Smurf", source: "The Smurfs", emoji: "🍄", color: "#3498db", species: "magical", gender: "male", alignment: "hero", powers: "magic", weapon: "magic", format: "animated-tv", age: "elder", costume: true, facialHair: true },
  { id: "aladdin", name: "Aladdin", source: "Aladdin", emoji: "🧞", color: "#8a5a44", species: "human", gender: "male", alignment: "hero", powers: "none", weapon: "melee", format: "animated-movie", age: "teen", costume: true, facialHair: false },
  { id: "woody-toy-story", name: "Woody", source: "Toy Story", emoji: "🤠", color: "#d2691e", species: "robot", gender: "male", alignment: "hero", powers: "none", weapon: "ranged", format: "animated-movie", age: "adult", costume: true, facialHair: false },
  { id: "po-kung-fu-panda", name: "Po", source: "Kung Fu Panda", emoji: "🐼", color: "#2c2c2c", species: "creature", gender: "male", alignment: "hero", powers: "none", weapon: "melee", format: "animated-movie", age: "adult", costume: true, facialHair: false },
  { id: "mr-incredible", name: "Mr. Incredible", source: "The Incredibles", emoji: "💪", color: "#c0392b", species: "human", gender: "male", alignment: "hero", powers: "superpowers", weapon: "none", format: "animated-movie", age: "adult", costume: true, facialHair: false },
  { id: "donald-duck", name: "Donald Duck", source: "DuckTales", emoji: "🦆", color: "#4a90d9", species: "creature", gender: "male", alignment: "hero", powers: "none", weapon: "none", format: "animated-tv", age: "adult", costume: true, facialHair: false },
  { id: "elsa-cartoon", name: "Elsa", source: "Frozen", emoji: "❄️", color: "#4fa3d1", species: "human", gender: "female", alignment: "hero", powers: "magic", weapon: "none", format: "animated-movie", age: "adult", costume: true, facialHair: false },
  { id: "moana-cartoon", name: "Moana", source: "Moana", emoji: "🌊", color: "#2e8bc0", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "none", format: "animated-movie", age: "teen", costume: false, facialHair: false },
  { id: "judy-hopps", name: "Judy Hopps", source: "Zootopia", emoji: "🐰", color: "#6699cc", species: "creature", gender: "female", alignment: "hero", powers: "none", weapon: "none", format: "animated-movie", age: "adult", costume: true, facialHair: false },
  { id: "merida", name: "Merida", source: "Brave", emoji: "🏹", color: "#c0392b", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "ranged", format: "animated-movie", age: "teen", costume: true, facialHair: false },
  { id: "vanellope", name: "Vanellope von Schweetz", source: "Wreck-It Ralph", emoji: "🍬", color: "#8e44ad", species: "human", gender: "female", alignment: "hero", powers: "tech", weapon: "none", format: "animated-movie", age: "teen", costume: true, facialHair: false },
  { id: "rapunzel", name: "Rapunzel", source: "Tangled", emoji: "👱‍♀️", color: "#f4d03f", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "melee", format: "animated-movie", age: "teen", costume: true, facialHair: false },
  { id: "mulan", name: "Mulan", source: "Mulan", emoji: "⚔️", color: "#c0392b", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "melee", format: "animated-movie", age: "teen", costume: true, facialHair: false },
  { id: "tiana", name: "Tiana", source: "The Princess and the Frog", emoji: "🐸", color: "#27ae60", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "none", format: "animated-movie", age: "adult", costume: false, facialHair: false },
  { id: "boo-monsters-inc", name: "Boo", source: "Monsters, Inc.", emoji: "👧", color: "#f39c12", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "none", format: "animated-movie", age: "teen", costume: false, facialHair: false },
  { id: "katara", name: "Katara", source: "Avatar: The Last Airbender", emoji: "💧", color: "#3498db", species: "human", gender: "female", alignment: "hero", powers: "magic", weapon: "none", format: "animated-tv", age: "teen", costume: true, facialHair: false },
  { id: "dory", name: "Dory", source: "Finding Nemo", emoji: "🐟", color: "#4a90d9", species: "creature", gender: "female", alignment: "hero", powers: "none", weapon: "none", format: "animated-movie", age: "adult", costume: false, facialHair: false },
  { id: "peppa-pig", name: "Peppa Pig", source: "Peppa Pig", emoji: "🐷", color: "#ff69b4", species: "creature", gender: "female", alignment: "hero", powers: "none", weapon: "none", format: "animated-tv", age: "teen", costume: false, facialHair: false },
  { id: "coraline", name: "Coraline", source: "Coraline", emoji: "🔑", color: "#4169e1", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "none", format: "animated-movie", age: "teen", costume: false, facialHair: false },
  { id: "lucy-van-pelt", name: "Lucy van Pelt", source: "Peanuts", emoji: "🩺", color: "#4169e1", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "none", format: "animated-tv", age: "teen", costume: false, facialHair: false },
  { id: "daria", name: "Daria Morgendorffer", source: "Daria", emoji: "🕶️", color: "#556b2f", species: "human", gender: "female", alignment: "hero", powers: "none", weapon: "none", format: "animated-tv", age: "teen", costume: false, facialHair: false },
];

export const packs: Pack[] = [
  { key: "anime", label: "Anime Characters", icon: "🍥", characters: animeCharacters, categories: fictionalCategories },
  { key: "cartoon", label: "Cartoon Characters", icon: "🎨", characters: cartoonCharacters, categories: fictionalCategories },
  { key: "actors", label: "Movie Character Actors", icon: "🎥", characters: actorCharacters, categories: actorCategories },
  { key: "musicians", label: "Musicians", icon: "🎵", characters: musicianCharacters, categories: musicianCategories },
  { key: "tv-actors", label: "TV Series Character Actors", icon: "📺", characters: tvActorCharacters, categories: tvActorCategories },
  { key: "youtubers", label: "YouTubers", icon: "▶️", characters: youtuberCharacters, categories: youtuberCategories },
];

export const DEFAULT_PACK_KEY = "anime";

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

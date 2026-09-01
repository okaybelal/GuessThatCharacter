export interface Character {
  id: string;
  name: string;
  source: string;
  emoji: string;
  color: string;
  attributes: {
    isHuman: boolean;
    isMale: boolean;
    hasSuperpowers: boolean;
    isVillain: boolean;
    wearsCostume: boolean;
    isAnimated: boolean;
    fromMovie: boolean; // false = TV series
    hasFacialHair: boolean;
    isTeenOrYounger: boolean;
    wieldsWeapon: boolean;
  };
}

export const characters: Character[] = [
  { id: "walter-white", name: "Walter White", source: "Breaking Bad", emoji: "🥼", color: "#2f7d4f", attributes: { isHuman: true, isMale: true, hasSuperpowers: false, isVillain: true, wearsCostume: false, isAnimated: false, fromMovie: false, hasFacialHair: true, isTeenOrYounger: false, wieldsWeapon: true } },
  { id: "darth-vader", name: "Darth Vader", source: "Star Wars", emoji: "🖤", color: "#1a1a1a", attributes: { isHuman: true, isMale: true, hasSuperpowers: true, isVillain: true, wearsCostume: true, isAnimated: false, fromMovie: true, hasFacialHair: false, isTeenOrYounger: false, wieldsWeapon: true } },
  { id: "draco-malfoy", name: "Draco Malfoy", source: "Harry Potter", emoji: "🐍", color: "#2e6b4f", attributes: { isHuman: true, isMale: true, hasSuperpowers: true, isVillain: true, wearsCostume: true, isAnimated: false, fromMovie: true, hasFacialHair: false, isTeenOrYounger: true, wieldsWeapon: true } },
  { id: "spongebob", name: "SpongeBob SquarePants", source: "SpongeBob SquarePants", emoji: "🧽", color: "#f4c542", attributes: { isHuman: false, isMale: true, hasSuperpowers: false, isVillain: false, wearsCostume: false, isAnimated: true, fromMovie: false, hasFacialHair: false, isTeenOrYounger: false, wieldsWeapon: false } },
  { id: "iron-man", name: "Tony Stark", source: "Marvel", emoji: "🦾", color: "#c0392b", attributes: { isHuman: true, isMale: true, hasSuperpowers: true, isVillain: false, wearsCostume: true, isAnimated: false, fromMovie: true, hasFacialHair: true, isTeenOrYounger: false, wieldsWeapon: true } },
  { id: "michael-scott", name: "Michael Scott", source: "The Office", emoji: "📎", color: "#3b6ea5", attributes: { isHuman: true, isMale: true, hasSuperpowers: false, isVillain: false, wearsCostume: false, isAnimated: false, fromMovie: false, hasFacialHair: false, isTeenOrYounger: false, wieldsWeapon: false } },
  { id: "eleven", name: "Eleven", source: "Stranger Things", emoji: "🔮", color: "#6c3fa3", attributes: { isHuman: true, isMale: false, hasSuperpowers: true, isVillain: false, wearsCostume: false, isAnimated: false, fromMovie: false, hasFacialHair: false, isTeenOrYounger: true, wieldsWeapon: false } },
  { id: "shrek", name: "Shrek", source: "Shrek", emoji: "🟢", color: "#5b8c3e", attributes: { isHuman: false, isMale: true, hasSuperpowers: false, isVillain: false, wearsCostume: false, isAnimated: true, fromMovie: true, hasFacialHair: false, isTeenOrYounger: false, wieldsWeapon: false } },
  { id: "daemon-targaryen", name: "Daemon Targaryen", source: "House of the Dragon", emoji: "🐉", color: "#7a1f1f", attributes: { isHuman: true, isMale: true, hasSuperpowers: false, isVillain: false, wearsCostume: false, isAnimated: false, fromMovie: false, hasFacialHair: false, isTeenOrYounger: false, wieldsWeapon: true } },
  { id: "joker", name: "The Joker", source: "Batman", emoji: "🃏", color: "#5b2a86", attributes: { isHuman: true, isMale: true, hasSuperpowers: false, isVillain: true, wearsCostume: true, isAnimated: false, fromMovie: true, hasFacialHair: false, isTeenOrYounger: false, wieldsWeapon: true } },
  { id: "elsa", name: "Elsa", source: "Frozen", emoji: "❄️", color: "#4fa3d1", attributes: { isHuman: true, isMale: false, hasSuperpowers: true, isVillain: false, wearsCostume: true, isAnimated: true, fromMovie: true, hasFacialHair: false, isTeenOrYounger: false, wieldsWeapon: false } },
  { id: "homer", name: "Homer Simpson", source: "The Simpsons", emoji: "🍩", color: "#f2c14e", attributes: { isHuman: true, isMale: true, hasSuperpowers: false, isVillain: false, wearsCostume: false, isAnimated: true, fromMovie: false, hasFacialHair: false, isTeenOrYounger: false, wieldsWeapon: false } },
  { id: "yoda", name: "Yoda", source: "Star Wars", emoji: "🟢", color: "#7a9b57", attributes: { isHuman: false, isMale: true, hasSuperpowers: true, isVillain: false, wearsCostume: true, isAnimated: false, fromMovie: true, hasFacialHair: false, isTeenOrYounger: false, wieldsWeapon: true } },
  { id: "harley-quinn", name: "Harley Quinn", source: "Batman", emoji: "🔨", color: "#d63384", attributes: { isHuman: true, isMale: false, hasSuperpowers: false, isVillain: true, wearsCostume: true, isAnimated: false, fromMovie: true, hasFacialHair: false, isTeenOrYounger: false, wieldsWeapon: true } },
  { id: "gandalf", name: "Gandalf", source: "Lord of the Rings", emoji: "🧙", color: "#7c7c7c", attributes: { isHuman: false, isMale: true, hasSuperpowers: true, isVillain: false, wearsCostume: true, isAnimated: false, fromMovie: true, hasFacialHair: true, isTeenOrYounger: false, wieldsWeapon: true } },
  { id: "rick-sanchez", name: "Rick Sanchez", source: "Rick and Morty", emoji: "🧪", color: "#6fae6f", attributes: { isHuman: true, isMale: true, hasSuperpowers: false, isVillain: false, wearsCostume: false, isAnimated: true, fromMovie: false, hasFacialHair: false, isTeenOrYounger: false, wieldsWeapon: true } },
  { id: "wednesday", name: "Wednesday Addams", source: "Wednesday", emoji: "🖤", color: "#2b2b2b", attributes: { isHuman: true, isMale: false, hasSuperpowers: true, isVillain: false, wearsCostume: false, isAnimated: false, fromMovie: false, hasFacialHair: false, isTeenOrYounger: true, wieldsWeapon: false } },
  { id: "thanos", name: "Thanos", source: "Marvel", emoji: "💜", color: "#7d5ba6", attributes: { isHuman: false, isMale: true, hasSuperpowers: true, isVillain: true, wearsCostume: true, isAnimated: false, fromMovie: true, hasFacialHair: false, isTeenOrYounger: false, wieldsWeapon: true } },
  { id: "moana", name: "Moana", source: "Moana", emoji: "🌊", color: "#2e8bc0", attributes: { isHuman: true, isMale: false, hasSuperpowers: false, isVillain: false, wearsCostume: false, isAnimated: true, fromMovie: true, hasFacialHair: false, isTeenOrYounger: true, wieldsWeapon: false } },
  { id: "sheldon", name: "Sheldon Cooper", source: "The Big Bang Theory", emoji: "🧠", color: "#4a6fa5", attributes: { isHuman: true, isMale: true, hasSuperpowers: false, isVillain: false, wearsCostume: false, isAnimated: false, fromMovie: false, hasFacialHair: false, isTeenOrYounger: false, wieldsWeapon: false } },
  { id: "maleficent", name: "Maleficent", source: "Sleeping Beauty", emoji: "🐐", color: "#3d1f4d", attributes: { isHuman: true, isMale: false, hasSuperpowers: true, isVillain: true, wearsCostume: true, isAnimated: true, fromMovie: true, hasFacialHair: false, isTeenOrYounger: false, wieldsWeapon: true } },
  { id: "jon-snow", name: "Jon Snow", source: "Game of Thrones", emoji: "⚔️", color: "#4a4a4a", attributes: { isHuman: true, isMale: true, hasSuperpowers: false, isVillain: false, wearsCostume: false, isAnimated: false, fromMovie: false, hasFacialHair: true, isTeenOrYounger: false, wieldsWeapon: true } },
  { id: "buzz-lightyear", name: "Buzz Lightyear", source: "Toy Story", emoji: "🚀", color: "#3a6ea5", attributes: { isHuman: false, isMale: true, hasSuperpowers: false, isVillain: false, wearsCostume: true, isAnimated: true, fromMovie: true, hasFacialHair: false, isTeenOrYounger: false, wieldsWeapon: false } },
  { id: "katniss", name: "Katniss Everdeen", source: "The Hunger Games", emoji: "🏹", color: "#5a5a3c", attributes: { isHuman: true, isMale: false, hasSuperpowers: false, isVillain: false, wearsCostume: false, isAnimated: false, fromMovie: true, hasFacialHair: false, isTeenOrYounger: true, wieldsWeapon: true } },
  { id: "deadpool", name: "Deadpool", source: "Marvel", emoji: "🗡️", color: "#a11d2e", attributes: { isHuman: true, isMale: true, hasSuperpowers: true, isVillain: false, wearsCostume: true, isAnimated: false, fromMovie: true, hasFacialHair: false, isTeenOrYounger: false, wieldsWeapon: true } },
  { id: "leia", name: "Princess Leia", source: "Star Wars", emoji: "👑", color: "#8a5a9a", attributes: { isHuman: true, isMale: false, hasSuperpowers: false, isVillain: false, wearsCostume: false, isAnimated: false, fromMovie: true, hasFacialHair: false, isTeenOrYounger: false, wieldsWeapon: true } },
  { id: "naruto", name: "Naruto Uzumaki", source: "Naruto", emoji: "🍥", color: "#e8912d", attributes: { isHuman: true, isMale: true, hasSuperpowers: true, isVillain: false, wearsCostume: true, isAnimated: true, fromMovie: false, hasFacialHair: false, isTeenOrYounger: true, wieldsWeapon: true } },
  { id: "peter-griffin", name: "Peter Griffin", source: "Family Guy", emoji: "🍺", color: "#e0b13f", attributes: { isHuman: true, isMale: true, hasSuperpowers: false, isVillain: false, wearsCostume: false, isAnimated: true, fromMovie: false, hasFacialHair: false, isTeenOrYounger: false, wieldsWeapon: false } },
  { id: "legolas", name: "Legolas", source: "Lord of the Rings", emoji: "🏹", color: "#3f6b4f", attributes: { isHuman: false, isMale: true, hasSuperpowers: false, isVillain: false, wearsCostume: true, isAnimated: false, fromMovie: true, hasFacialHair: false, isTeenOrYounger: false, wieldsWeapon: true } },
  { id: "spider-man", name: "Spider-Man", source: "Marvel", emoji: "🕷️", color: "#a11d2e", attributes: { isHuman: true, isMale: true, hasSuperpowers: true, isVillain: false, wearsCostume: true, isAnimated: false, fromMovie: true, hasFacialHair: false, isTeenOrYounger: true, wieldsWeapon: false } },
];

export const attributeLabels: Record<keyof Character["attributes"], string> = {
  isHuman: "Are they human?",
  isMale: "Are they male?",
  hasSuperpowers: "Do they have superpowers?",
  isVillain: "Are they a villain?",
  wearsCostume: "Do they wear a costume?",
  isAnimated: "Are they from an animated show/movie?",
  fromMovie: "Are they from a movie (not a TV series)?",
  hasFacialHair: "Do they have facial hair?",
  isTeenOrYounger: "Are they a teenager or younger?",
  wieldsWeapon: "Do they wield a weapon?",
};

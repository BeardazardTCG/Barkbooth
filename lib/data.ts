export type Competition = {
  slug: string;
  title: string;
  theme: string;
  month: string;
  entries: number;
  closes: string;
  price: string;
  prize: string;
  color: string;
  classType: string;
  classes: string[];
  description: string;
};

export const achievements = [
  "First Entry",
  "First Rosette",
  "Puppy Star",
  "Rescue Hero",
  "Top 10 Finisher",
  "Summer Smiles Winner",
  "3 Month Streak",
  "Community Favourite"
];

export const competitions: Competition[] = [
  {
    slug: "summer-smiles",
    title: "Summer Smiles",
    theme: "Bright, happy portraits",
    month: "June 2026",
    entries: 284,
    closes: "30 Jun 2026",
    price: "$4.99",
    prize: "$500 + gold digital rosette",
    color: "from-amber-200 to-orange-200",
    classType: "Monthly headline class",
    classes: ["Puppy", "Senior Sweethearts", "Best Rescue", "Action Shot"],
    description: "Celebrate beach days, garden zoomies, and sunny sofa snoozes with a warm seasonal showcase. Phone photos only; proud moments encouraged."
  },
  {
    slug: "rescue-heroes",
    title: "Rescue Heroes",
    theme: "Stories with heart",
    month: "July 2026",
    entries: 172,
    closes: "31 Jul 2026",
    price: "$3.99",
    prize: "$300 shelter donation",
    color: "from-skysoft to-blue-200",
    classType: "Special community class",
    classes: ["Glow Up", "Bonded Pair", "Golden Oldie", "People's Choice"],
    description: "A month dedicated to rescue dogs and the humans who gave them a second chapter."
  },
  {
    slug: "tiny-paws-big-attitude",
    title: "Tiny Dogs, Big Attitude",
    theme: "Small dogs, huge charm",
    month: "August 2026",
    entries: 96,
    closes: "31 Aug 2026",
    price: "$4.99",
    prize: "Premium treat hamper",
    color: "from-pink-200 to-rose-200",
    classType: "Monthly class",
    classes: ["Sassy Sit", "Mini Athlete", "Couch Royalty", "Best Outfit"],
    description: "For pocket rockets, lap legends, and compact canines with main-character energy."
  },
  {
    slug: "community-favourites",
    title: "Community Favourites",
    theme: "The moments members love most",
    month: "Every month",
    entries: 421,
    closes: "Final Sunday",
    price: "Free member vote",
    prize: "Community Favourite badge",
    color: "from-emerald-100 to-teal-200",
    classType: "Always-on special",
    classes: ["Funniest Face", "Best Nap", "Most Supportive Comment", "Owner's Proud Pick"],
    description: "A lighter class for everyday dog moments, friendly reactions, and building the PupPodium habit."
  }
];

export const dogs = [
  {
    name: "Mabel",
    breed: "Cocker Spaniel",
    age: "3 years",
    birthday: "14 April 2023",
    owner: "Amelia Carter",
    points: 1240,
    rosettes: ["1st · Summer Smiles", "3rd · Action Shot", "Finalist · Rescue Heroes"],
    badges: ["First Entry", "First Rosette", "Summer Smiles Winner", "3 Month Streak", "Community Favourite"],
    entered: ["Summer Smiles", "Rescue Heroes", "Community Favourites"],
    streak: "3 month streak"
  },
  { name: "Otis", breed: "French Bulldog", age: "5 years", birthday: "3 September 2021", owner: "Noah Evans", points: 860, rosettes: ["Top 10 · Community Favourites"], badges: ["Top 10 Finisher", "Community Favourite"], entered: ["Community Favourites"], streak: "1 month streak" }
];

export const winners = [
  { place: "1st", dog: "Luna", className: "Puppy", note: "A confident, joyful portrait with real personality and a beautifully natural moment.", ribbon: "bg-amber-300", owner: "Maya" },
  { place: "2nd", dog: "Biscuit", className: "Action Shot", note: "Mid-air ears, sharp timing, and the kind of photo every dog owner smiles at.", ribbon: "bg-slate-300", owner: "Noah" },
  { place: "3rd", dog: "Pepper", className: "Best Rescue", note: "Soft eyes, strong story, and a calm image that stayed with the judging panel.", ribbon: "bg-orange-300", owner: "Sofia" }
];

export const annualAwards = ["Dog of the Year", "Best Rescue", "Best Puppy", "Best Senior", "Community Favourite"];

export const faqs = [
  ["How does entry work?", "Choose a monthly competition class, add your dog's details, and upload a photo in the mock entry flow."],
  ["Is payment built yet?", "Not yet. This concept uses mock data only and is ready for future checkout and backend integrations."],
  ["How are winners picked?", "The concept supports fair human judging, community recognition, class winners, and rosette-style placements."],
  ["What are badges?", "Badges mark proud milestones such as first entry, first rosette, streaks, rescue stories, and community favourites."]
];

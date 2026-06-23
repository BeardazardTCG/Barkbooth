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

export const achievements = ["First Entry", "First Rosette", "Puppy Star", "Rescue Hero", "Top 10 Finisher", "Summer Smiles Winner", "3 Month Streak", "Community Favourite"];

export const competitionTimeline = [
  { label: "Entries open", detail: "Days 1–25" },
  { label: "Winners announced", detail: "Day 25" },
  { label: "People’s Choice voting", detail: "Days 26–29" },
  { label: "New competition launches", detail: "Day 30" }
];

export const competitionPricing = [
  { label: "Single class", price: "£3" },
  { label: "5 classes", price: "£12" },
  { label: "10 classes", price: "£22" }
];

export const judgingCriteria = [
  { label: "Theme relevance", value: "40%" },
  { label: "Creativity", value: "25%" },
  { label: "Image quality", value: "20%" },
  { label: "Personality/expression", value: "15%" }
];

export const prizeStructure = [
  { place: "1st", prizes: ["Premium treat bundle", "Optional toy", "Themed rosette", "Winner badge", "Winners Gallery feature"] },
  { place: "2nd", prizes: ["Rosette", "Treat bundle", "Badge"] },
  { place: "3rd", prizes: ["Rosette", "Treat bundle", "Badge"] }
];

export const competitions: Competition[] = [
  { slug: "miami-mutts", title: "Miami Mutts", theme: "Bright colours, sunshine, poolside poses, and bold holiday energy", month: "June 2026", entries: 284, closes: "Day 25", price: "From £3", prize: "Treat bundle + themed rosette", color: "from-cyan-200 to-pink-200", classType: "Themed photo competition", classes: ["Beach Babe", "Neon Pup", "Poolside Pose", "Tropical Smile"], description: "A vivid judged photo competition for confident colour, sunny personality, and playful Miami-inspired styling." },
  { slug: "cosy-companions", title: "Cosy Companions", theme: "Blankets, sofa snuggles, calm winter portraits, and gentle companionship", month: "July 2026", entries: 172, closes: "Day 25", price: "From £3", prize: "Treat bundle + themed rosette", color: "from-amber-100 to-orange-200", classType: "Themed photo competition", classes: ["Sofa Snuggles", "Blanket Buddy", "Tea-Time Pup", "Sleepy Sweetheart"], description: "A soft seasonal showcase for warm indoor moments, comfort, and the quiet bond between dogs and owners." },
  { slug: "summer-smiles", title: "Summer Smiles", theme: "Bright, happy portraits, garden zoomies, and sunshine grins", month: "August 2026", entries: 326, closes: "Day 25", price: "From £3", prize: "Treat bundle + themed rosette", color: "from-amber-200 to-orange-200", classType: "Themed photo competition", classes: ["Golden Hour", "Garden Zoomies", "Picnic Pal", "Best Grin"], description: "Celebrate beach days, garden zoomies, and sunny sofa snoozes with a warm seasonal showcase. Phone photos and proud moments encouraged." },
  { slug: "autumn-adventures", title: "Autumn Adventures", theme: "Crunchy leaves, woodland walks, pumpkin tones, and outdoor exploring", month: "September 2026", entries: 148, closes: "Day 25", price: "From £3", prize: "Treat bundle + themed rosette", color: "from-orange-200 to-rose-200", classType: "Themed photo competition", classes: ["Leaf Leaper", "Woodland Wanderer", "Pumpkin Pup", "Muddy Boots"], description: "For dogs who love leaf piles, nature trails, cosy colours, and the small adventures that become big scrapbook memories." }
];

export const peopleChoiceCards = [
  { dog: "Mabel", className: "Summer Smiles", note: "Golden-hour grin shortlisted from the judged monthly placements." },
  { dog: "Otis", className: "Cosy Companions", note: "A sofa-royalty portrait with lots of community charm." },
  { dog: "Pepper", className: "Autumn Adventures", note: "Crunchy-leaf confidence from a much-loved rescue terrier." }
];

export const calendarMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const tricksClasses = ["Sit", "Stay", "Paw", "Best Recall", "Top 5 Tricks", "Freestyle"];
export const tricksCriteria = [
  { label: "Bond and teamwork", value: "30%" },
  { label: "Training quality", value: "30%" },
  { label: "Creativity", value: "20%" },
  { label: "Welfare and enthusiasm", value: "20%" }
];

export const dogs = [
  { name: "Mabel", breed: "Cocker Spaniel", age: "3 years", birthday: "14 April 2023", owner: "Amelia Carter", points: 1240, rosettes: ["1st · Summer Smiles", "3rd · Action Shot", "Finalist · Rescue Heroes"], badges: ["First Entry", "First Rosette", "Summer Smiles Winner", "3 Month Streak", "Community Favourite"], entered: ["Summer Smiles", "Rescue Heroes", "Community Favourites"], streak: "3 month streak" },
  { name: "Otis", breed: "French Bulldog", age: "5 years", birthday: "3 September 2021", owner: "Noah Evans", points: 860, rosettes: ["Top 10 · Community Favourites"], badges: ["Top 10 Finisher", "Community Favourite"], entered: ["Community Favourites"], streak: "1 month streak" }
];

export const winners = [
  { place: "1st", dog: "Luna", className: "Puppy", note: "A confident, joyful portrait with real personality and a beautifully natural moment.", ribbon: "bg-amber-300", owner: "Maya" },
  { place: "2nd", dog: "Biscuit", className: "Action Shot", note: "Mid-air ears, sharp timing, and the kind of photo every dog owner smiles at.", ribbon: "bg-slate-300", owner: "Noah" },
  { place: "3rd", dog: "Pepper", className: "Best Rescue", note: "Soft eyes, strong story, and a calm image that stayed with the judging panel.", ribbon: "bg-orange-300", owner: "Sofia" }
];

export const galleryGroups = [
  { tab: "Recent winners", items: winners },
  { tab: "People’s Choice winners", items: [{ place: "PC", dog: "Mabel", className: "People’s Choice Pooch", note: "Homepage feature winner chosen in the mock community vote.", ribbon: "bg-pink", owner: "Amelia" }] },
  { tab: "Calendar Pups winners", items: [{ place: "Jan", dog: "Daisy", className: "Calendar Pups", note: "January page winner with a frosty morning portrait.", ribbon: "bg-skysoft", owner: "Grace" }] },
  { tab: "Tricks & Tails winners", items: [{ place: "Top", dog: "Rolo", className: "Freestyle", note: "Kind, enthusiastic teamwork in a 20-second routine.", ribbon: "bg-emerald-200", owner: "Sam" }] }
];

export const annualAwards = ["Dog of the Year", "Best Rescue", "Best Puppy", "Best Senior", "Community Favourite"];
export const faqs = [["How does entry work?", "Choose a monthly competition class, add your dog's details, and upload a photo in the mock entry flow."], ["Is payment built yet?", "Not yet. This concept uses mock data only and is ready for future checkout and backend integrations."], ["How are winners picked?", "The concept supports fair human judging, community recognition, class winners, and rosette-style placements."], ["What are badges?", "Badges mark proud milestones such as first entry, first rosette, streaks, rescue stories, and community favourites."]];
export const coreValues = [{ title: "Progress over perfection", detail: "Every small win belongs in the scrapbook, not just polished podium moments." }, { title: "Positive reinforcement", detail: "Celebrate kind training, confidence, play, and trust between dogs and owners." }, { title: "Dog welfare first", detail: "Comfort, consent, and safety come before poses, prizes, or pressure." }, { title: "Fair judging", detail: "Clear classes, human review, and everyday phone photos all get a fair chance." }, { title: "Community", detail: "A warm UK space for cheering on real dogs, rescue stories, and proud owners." }, { title: "Accessibility", detail: "Simple routes, friendly copy, and low-pressure mock entry flows for every owner." }];
export const featuredProfiles = [{ name: "Mabel", note: "Collected her first rosette after three months of sunny garden entries.", badge: "3 Month Streak" }, { name: "Otis", note: "A couch-royalty finalist loved by the community vote.", badge: "Community Favourite" }, { name: "Nala", note: "Rescue confidence milestone: first beach photo without worry.", badge: "Rescue Hero" }];
export const calendarPups = ["January Jumpers", "Spring Sniffs", "Summer Smiles", "Autumn Adventures"];
export const tricksAndTails = ["Teach a calm paw touch", "Celebrate a recall win", "Share the story behind a favourite photo"];

export const profileDog = { name: "Mabel", breed: "Cocker Spaniel mix", age: "3 years old", dateOfBirth: "14 April 2023", county: "Somerset", ownerUsername: "mabels_mate", bio: "Mabel is a sunny, snack-motivated spaniel who loves garden zoomies, calm training wins, and posing with every digital rosette she has earned. Her scrapbook celebrates the tiny steps as much as the big podium moments.", stats: [{ label: "Rosettes earned", value: "7" }, { label: "Badges earned", value: "11" }, { label: "Competitions entered", value: "14" }, { label: "People’s Choice wins", value: "2" }, { label: "Calendar appearances", value: "1" }, { label: "Training achievements", value: "5" }], timeline: [{ date: "Jan 2026", type: "Entry", icon: "🐾", title: "First Entry", story: "A cosy sofa portrait became Mabel’s first Bark Booth moment and started her public scrapbook." }, { date: "Feb 2026", type: "Rosette", icon: "🏵️", title: "First Rosette", story: "Her bright recall photo placed in Action Shot and unlocked the first rosette on her wall." }, { date: "Jun 2026", type: "Winner", icon: "☀️", title: "Summer Smiles Winner", story: "A golden-hour garden grin won the seasonal headline class and became her signature photo." }, { date: "Jun 2026", type: "Feature", icon: "💖", title: "People’s Choice Feature", story: "The community picked Mabel’s muddy-paws blooper as a favourite feel-good moment." }, { date: "Jul 2026", type: "Finalist", icon: "📅", title: "Calendar Pup Finalist", story: "Her wildflower portrait was shortlisted for the mock Bark Booth calendar collection." }, { date: "Aug 2026", type: "Entry", icon: "🎪", title: "Tricks & Tails Entry", story: "Mabel shared a gentle paw-touch trick after weeks of patient positive reinforcement." }, { date: "Sep 2026", type: "Training", icon: "🎓", title: "Top Pup Graduate", story: "A calm settle at a busy café marked her proudest training milestone so far." }], gallery: [{ title: "Competition entry", caption: "Garden grin for Summer Smiles" }, { title: "Winner photo", caption: "Gold rosette celebration" }, { title: "Training moment", caption: "Paw touch practice" }, { title: "Calendar photo", caption: "Wildflowers and floppy ears" }, { title: "Owner favourite", caption: "Muddy-paws blooper" }], rosettes: [{ place: "1st", label: "Summer Smiles", date: "June 2026" }, { place: "PC", label: "People’s Choice", date: "June 2026" }, { place: "Top", label: "Calendar Pup Finalist", date: "July 2026" }, { place: "3rd", label: "Action Shot", date: "February 2026" }], badges: ["First Entry", "First Rosette", "Summer Smiles Winner", "People’s Choice Feature", "Calendar Pup Finalist", "Tricks & Tails Entry", "Top Pup Graduate", "3 Month Streak"], history: [{ competition: "Summer Smiles", className: "Headline class", placement: "1st", date: "Jun 2026", result: "Gold rosette" }, { competition: "Community Favourites", className: "People’s Choice", placement: "Winner", date: "Jun 2026", result: "Community badge" }, { competition: "Calendar Pups", className: "Summer page", placement: "Finalist", date: "Jul 2026", result: "Calendar badge" }, { competition: "Tricks & Tails", className: "Paw touch", placement: "Entered", date: "Aug 2026", result: "Training badge" }, { competition: "Action Shot", className: "Recall run", placement: "3rd", date: "Feb 2026", result: "Bronze rosette" }] };
export const profileCards = [{ name: "Luna", breed: "Golden Retriever", county: "Devon", rosetteCount: 5, latestAchievement: "Puppy Star" }, { name: "Mabel", breed: "Cocker Spaniel mix", county: "Somerset", rosetteCount: 7, latestAchievement: "Top Pup Graduate" }, { name: "Biscuit", breed: "Beagle", county: "Kent", rosetteCount: 3, latestAchievement: "Action Shot finalist" }, { name: "Pepper", breed: "Rescue Terrier", county: "Yorkshire", rosetteCount: 4, latestAchievement: "Best Rescue" }, { name: "Otis", breed: "French Bulldog", county: "Bristol", rosetteCount: 1, latestAchievement: "Community Favourite" }, { name: "Daisy", breed: "Labrador", county: "Norfolk", rosetteCount: 6, latestAchievement: "Calendar Pup" }];

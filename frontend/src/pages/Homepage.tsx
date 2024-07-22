import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

const content = [
  {
    title: "Explore cards from the community",
    description:
      "Discover a vast library of quizzes and flashcards created by our community. Collaborate with other learners, share knowledge, and benefit from the collective effort. Find the resources you need to enhance your studies and track your progress.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <img
          src="/community.jpg"
          width={500}
          height={300}
          className="h-full w-full object-cover rounded-md"
          alt="Explore cards from the community"
        />
      </div>
    ),
  },
  {
    title: "Create and share your own cards",
    description:
      "Design personalized quizzes and flashcards tailored to your study needs. Share your creations with the community, help others learn, and receive feedback. Collaborate with peers and contribute to the growing pool of educational resources.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <img
          src="/study.jpg"
          width={500}
          height={300}
          className="h-full w-full object-cover rounded-md"
          alt="Create and share your own cards"
        />
      </div>
    ),
  },
  {
    title: "Track your progress",
    description:
      "Monitor your learning journey with real-time updates and detailed tracking for each card you use. See your improvements, identify areas for growth, and stay motivated with continuous progress reports. Keep your studies organized and efficient.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <img
          src="/progress.jpg"
          width={500}
          height={300}
          className="h-full w-full object-cover rounded-md"
          alt="Track your progress"
        />
      </div>
    ),
  },
  {
    title: "Create a study group",
    description:
      "Professors and educators can create study groups to share custom card sets directly with their students. Facilitate learning by providing curated materials, track student progress, and enhance the educational experience through structured group activities and collaboration.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        <img
          src="/class.jpg"
          width={500}
          height={300}
          className="h-full w-full object-cover rounded-md"
          alt="Create a study group"
        />
      </div>
    ),
  },
];

const Homepage = () => {
  return (
    <div className="flex flex-col flex-grow justify-evenly items-center space-y-11">
      <h1 className="uppercase font-extrabold text-5xl text-center tracking-widest">
        Welcome to Studynow
      </h1>
      <div className="w-full">
        <StickyScroll content={content} />
      </div>
    </div>
  );
};

export default Homepage;

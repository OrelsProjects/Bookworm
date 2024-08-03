"use client";

import React from "react";
import BookPageFlip, {
  BookPageFlipItemProps,
} from "../components/bookPageFlip/BookPageFlip";
import Link from "next/link";
import Image from "next/image";

const CratorNameAndTitle = ({
  name,
  title,
  className,
}: {
  name: string;
  title: string;
  className?: string;
}) => (
  <div className={`w-full flex flex-col gap-0 ${className}`}>
    <h2 className="text-base text-start lg:text-xl text-black">{name}</h2>
    <h3 className="text-sm text-start lg:text-lg text-black">{title}</h3>
  </div>
);

const Creator = ({
  name,
  title,
  photoUrl,
  favoriteAuthors,
  favoriteBooks,
}: {
  name: string;
  title: string;
  photoUrl: string;
  favoriteAuthors: string[];
  favoriteBooks: string[];
}) => (
  <div className="w-full flex flex-col lg:flex-row gap-2">
    <div className="flex flex-row gap-1 flex-shrink-0 lg:items-center">
      <Image
        src={photoUrl}
        about="http://schema.org/ImageObject"
        alt={"Photo of " + name}
        fill
        loading="eager"
        className="!relative !h-15 !max-h-15 lg:!h-30 lg:!max-h-30 !w-15 !max-w-15 lg:!w-30 lg:!max-w-30 rounded-full flex-shrink-0 text-xs"
      />
      <CratorNameAndTitle name={name} title={title} className="lg:hidden" />
    </div>
    <div className="flex flex-col gap-2">
      <CratorNameAndTitle
        name={name}
        title={title}
        className="hidden lg:flex"
      />
      <div className="flex flex-col gap-0 text-xs justify-start items-start">
        <span className="underline flex-shrink-0 text-start">
          Favorite Authors:
        </span>
        <span className="text-start">{favoriteAuthors.join(", ")}</span>
      </div>
      <div className="flex flex-col gap-1 text-xs justify-start items-start">
        <span className="underline flex-shrink-0 text-start">
          Favorite Books:
        </span>
        <span className="text-start">{favoriteBooks.join(", ")}</span>
      </div>
    </div>
  </div>
);

const Orel = () => (
  <Creator
    name="Orel Zilberman"
    title="Chief wizard + code producer"
    photoUrl="https://lh3.googleusercontent.com/a/ACg8ocJuQcn9RGs6JLIUTa4TJzH4CQKVQatTZE4zIlMqxe9ec8wlXJttvA=s96-c"
    favoriteAuthors={["David Goggins", "MJ DeMarco", "Jon Acuff"]}
    favoriteBooks={[
      "Can't Hurt Me",
      "The Millionaire Fastlane",
      "I Can't Make This Up",
    ]}
  />
);

const Anton = () => (
  <Creator
    name="Anton Zaides"
    title="Chief content and marketing guy"
    photoUrl="https://lh3.googleusercontent.com/a/ACg8ocJ1YsG5jprtxwjS1dZk0TPSIo_DW2OK_-BCHLOsa9Pizg=s96-c"
    favoriteAuthors={["Brandon Sanderson", "Adam Grant"]}
    favoriteBooks={["No Rules Rules", "Atomic Habits", "Deep Work"]}
  />
);

const PageHeader = () => (
  <div className="w-full text-center text-black">
    Ready to explore?{" "}
    {
      <Link
        href="/explore"
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="text-primary underline-offset-4 hover:underline hover:cursor-pointer"
      >
        Let's Do It!
      </Link>
    }
  </div>
);

const PageContent = ({
  title,
  sections,
}: {
  title: string;
  sections: React.ReactNode[];
}) => (
  <div className="w-full h-[90%] flex flex-col flex-start justify-start items-start gap-[17px] text-black rounded-lg">
    <div className="w-full flex flex-col justify-center items-center gap-2 pt-4">
      <PageHeader />
    </div>
    <div className="w-full flex flex-col items-start overflow-auto gap-[30px]">
      <h1 className="w-full text-[40px] lg:text-5xl leading-10 lg:leading-[48px] text-center">
        {title}
      </h1>
      {sections.map((section, index) => (
        <div
          className="w-full text-center text-2xl tracking-[1px]"
          key={`page-section-${title}-${index}`}
        >
          {section}
        </div>
      ))}
    </div>
  </div>
);

function App() {
  const items: BookPageFlipItemProps[] = [
    {
      content: (
        <PageContent
          title="Explore readlists"
          sections={[
            "Finding great book recommendations is HARD, and wasting your time on boring books is a shame.",
            <p>
              We collected the best readlists by real people, categorized by
              topic.
            </p>,
            <p>
              Do you want to be a better leader?{" "}
              {
                <Link
                  href="https://bookwiz.app/lists/top-leadership-books"
                  target="_blank"
                  about="http://schema.org/ItemList"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="underline-offset-4 hover:underline hover:cursor-pointer text-primary"
                >
                  Check out this one
                </Link>
              }
              .
            </p>,
            <p>
              Better software engineer?{" "}
              {
                <Link
                  href="https://bookwiz.app/lists/12-most-influential-books-every-software-engineer-needs-to-read-e29e63"
                  target="_blank"
                  about="http://schema.org/ItemList"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="underline-offset-4 hover:underline hover:cursor-pointer text-primary"
                >
                  {<br />}
                  We've got you covered!
                </Link>
              }
              .
            </p>,
            <p>
              "Each readlist has only a handful of books, so you won't be lost."
            </p>,
          ]}
        />
      ),
    },
    {
      content: (
        <PageContent
          title="Your Next Read"
          sections={[
            "We didn't stop at spot-on recommendations! Using BookWiz, you'll be able to organize your backlog, and keep track of your reading plans.",
          ]}
        />
      ),
    },
    {
      content: (
        <PageContent
          title="Our mission"
          sections={[
            "Reading is more than a hobby for us, it's our passion. BookWiz was born to help ourselves find the BEST book recommendations.",
            "Join us to change the way you'll decide what to read next. No more aimless searching or awful recommendations.",
            "Here, you'll end up with the exact book you'll enjoy.",
            <Orel />,
            <Anton />,
          ]}
        />
      ),
    },
  ];

  return (
    <div className="w-full h-[100svh] lg:h-full overflow-clip">
      <BookPageFlip items={items} />;
    </div>
  );
}

export default App;

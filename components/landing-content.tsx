"use client";

import { it } from "node:test";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const testimonials = [
  {
    name: "Novice",
    avatar: "A",
    title: "Software Engineer",
    description: "This is the best application I've used!",
  },
  {
    name: "Tanya",
    avatar: "B",
    title: "Data Analyst",
    description: "Love this app!",
  },
  {
    name: "Maddy",
    avatar: "C",
    title: "SDET",
    description: "Have been using this app since a year and it's amazing!",
  },
  {
    name: "Aish",
    avatar: "D",
    title: "Data Engineer",
    description: "This is such a helpful app!",
  },
];

const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-white text-4xl font-extrabold mb-10">
        Testimonials
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          //   <h1 className="text-white">{item.name}</h1>
          <Card
            key={item.description}
            className="bg-[#192339] border-none text-white"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LandingContent;

"use client";

import { Tree, PawPrint, Butterfly, Bird, Leaf, MapPin } from "@phosphor-icons/react";

export default function AboutUsMain() {
  return (
    <div
      className="w-full h-[1300px] bg-cover bg-center bg-slate-600 flex flex-col items-center justify-center text-white"
      style={{ backgroundImage: "url('/backgrounds/whitetools.jpg')" }}
    >
      {/* Centered title and text */}
      <div className="text-center">
        <h1 className="text-5xl font-bold text-titletextblack">Explore Lebanon&apos;s Nature,</h1>
        <h1 className="text-5xl font-bold text-titletextyellow">One Discovery at a Time</h1>
        <p className="text-xl mt-2 text-paragraphtextgrey">
          A project by our Scouts to map Lebanon’s wildlife, trees, and ecosystems.
        </p>
      </div>

      {/* Content section with image on the left */}
      <div className="mt-16 flex items-center justify-center w-3/4">
        <div className="w-1/2 flex justify-start">
          <img
            src="/images/aboutusimage.jpg"
            alt="Scout Lebanon Map"
            className="w-96 h-64 object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="w-1/2 pl-10">
          <h2 className="text-3xl font-semibold text-titletextblack">Our Mission</h2>
          <p className="mt-4 text-lg text-paragraphtextgrey">
            We are building an interactive map of Lebanon, where each Scout contributes data
            on animals, trees, and their natural habitats. Our goal is to create a valuable
            resource for nature lovers and conservationists.
          </p>
          <button className="mt-6 px-6 py-3 bg-titletextyellow text-titletextblack font-semibold rounded-lg shadow-md hover:bg-opacity-80 transition">
            Explore the Map
          </button>
        </div>
      </div>

      {/* Icons Section with Hover Effect */}
      <div className="mt-10 grid grid-cols-3 gap-6 w-3/4">
        {[
          { icon: Tree, label: "Forests", description: "View forest composition in key areas around Lebanon" },
          { icon: PawPrint, label: "Wildlife", description: "Discover wildlife species and their habitats" },
          { icon: Butterfly, label: "Insects", description: "Track insect populations in different regions" },
          { icon: Bird, label: "Bird Migration", description: "Follow migratory bird routes across Lebanon" },
          { icon: Leaf, label: "Plants", description: "Explore native plant species and their locations" },
          { icon: MapPin, label: "Locations", description: "Find biodiversity hotspots and key conservation areas" },
        ].map(({ icon: Icon, label, description }, index) => (
          <div
            key={index}
            className="group relative flex items-center justify-center border-2 border-titletextyellow rounded-lg p-4 transition-all duration-1000 transform hover:scale-105 hover:bg-titletextyellow"
          >
            {/* Icon Container */}
            <div className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-1000 group-hover:left-12">
              <Icon size={50} className="text-titletextyellow transition-all duration-1000 group-hover:text-white" />
            </div>

            {/* Label and Description */}
            <div className="ml-20 opacity-0 transition-opacity duration-1000 group-hover:opacity-100">
              <p className="text-paragraphtextgrey text-sm transition-all duration-1000 group-hover:text-white">
                {label}
              </p>
              <p className="text-sm text-paragraphtextgrey transition-all duration-1000 group-hover:text-white">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Text */}
      <div className="text-center mt-10">
        <p className="text-xl text-paragraphtextgrey">Find any of the above in our map research</p>
      </div>
    </div>
  );
}

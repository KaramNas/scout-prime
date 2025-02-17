"use client";



export default function ContactUsMain() {
  return (
    <div
      className="w-full h-[700px] bg-cover bg-center bg-slate-600 flex flex-col items-center justify-center text-white"
      style={{ backgroundImage: "url('/backgrounds/blacktools.jpg')" }}
    >
      {/* Centered title and text */}
      <div className="text-center">
        <h1 className="text-5xl font-bold text-titletextblack">Explore Lebanon&apos;s Nature,</h1>
        <h1 className="text-5xl font-bold text-titletextyellow">One Discovery at a Time</h1>
        <p className="text-xl mt-2 text-paragraphtextgrey">
          A project by our Scouts to map Lebanon’s wildlife, trees, and ecosystems.
        </p>
      </div>


      

      {/* Bottom Text */}
      <div className="text-center mt-10">
        <p className="text-xl text-paragraphtextgrey">Find any of the above in our map research</p>
      </div>
    </div>
  );
}

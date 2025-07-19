"use client";

export default function Logo() {
  return (
    <div className="fixed top-4 left-4 z-50">
      {/* Background shape */}
      <div className="h-20 w-28 bg-lion rounded-br-[60px] shadow-lg" />
      
      {/* Text Container */}
      <div className="absolute left-2 top-2">
        <div className="text-lion text-2xl font-normal font-display leading-[20px] [-webkit-text-stroke:1px_white]">
          plan
        </div>
        <div className="text-lion text-2xl font-normal font-display leading-[20px] [-webkit-text-stroke:1px_black]">
          cake
        </div>
        
        {/* Menu icon */}
        <div 
          data-direction="down" 
          data-status="closed" 
          className="mt-1 w-6 h-6"
        >
          <div className="w-6 h-6 relative bg-white/0">
            <div className="w-4 h-[2px] absolute left-1 top-1 bg-red" />
            <div className="w-4 h-[2px] absolute left-1 top-2.5 bg-white" />
            <div className="w-4 h-[2px] absolute left-1 top-4 bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
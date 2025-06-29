"use client";

export default function Logo() {
  return (
    <div className="relative">
      {/* Background shape */}
      <div className="h-36 w-44 bg-lion rounded-br-[100px]" />
      
      {/* Text Container */}
      <div className="absolute left-4 top-4">
        <div className="w-32 justify-start text-[#C7966E] text-5xl font-normal font-['Modak'] leading-[50px] [-webkit-text-stroke:1px_white]">
          plan
        </div>
        <div className="w-40 justify-start text-[#C7966E] text-5xl font-normal font-['Modak'] leading-[50px] [-webkit-text-stroke:1px_#05121E]">
          cake
        </div>
        
        {/* Menu icon */}
        <div 
          data-direction="down" 
          data-status="closed" 
          className="mt-1 w-8 h-8"
        >
          <div className="w-8 h-8 relative bg-white/0">
            <div className="w-6 h-[3px] absolute left-1 top-1.5 bg-stone-400" />
            <div className="w-6 h-[3px] absolute left-1 top-3.5 bg-stone-400" />
            <div className="w-6 h-[3px] absolute left-1 top-5.5 bg-stone-400" />
          </div>
        </div>
      </div>
    </div>
  );
} 
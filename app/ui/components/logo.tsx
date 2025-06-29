"use client";

export default function Logo() {
  return (
    <div className="relative">
      {/* Background shape */}
      <div className="h-36 w-44 bg-lion rounded-br-[100px]" />
      
      {/* Text Container */}
      <div className="absolute left-4 top-4">
        <div className="text-stone-400 text-5xl font-normal font-['Modak'] leading-[50px]">
          plan
        </div>
        <div className="text-stone-400 text-5xl font-normal font-['Modak'] leading-[50px]">
          cake
        </div>
        
        {/* Menu icon */}
        <div 
          data-direction="down" 
          data-status="closed" 
          className="w-8 h-8 relative"
        >
          <div className="w-8 h-8 left-0 top-0 absolute bg-white/0">
            <div className="w-6 h-3.5 left-[4.27px] top-[7px] absolute bg-[#E9DECA]"></div>
            <div className="w-1 h-1 left-[14px] top-[1px] absolute bg-[#FF5C5C] rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
} 
// components/InfoTooltip.tsx
import React from "react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"; // Adjust the import path based on your file structure
import { Info } from "lucide-react"; // Make sure to import your icon here

const InfoTooltip = ({message} : {message:string }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Info className="text-gray-500" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="bg-white text-black opacity-100 p-2 rounded-md max-w-[300px]">
          <p className="text-justify whitespace-normal leading-relaxed mt-2">
            {message}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;

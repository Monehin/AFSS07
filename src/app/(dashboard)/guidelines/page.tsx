"use client";

import React from "react";
import dynamic from "next/dynamic";

const DynamicGuidelines = dynamic(() => import("./Guidelines"), {
  ssr: false,
});

const page = () => {
  return (
    <div>
      <DynamicGuidelines />
    </div>
  );
};
export default page;

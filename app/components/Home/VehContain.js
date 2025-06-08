"use client";

import React from "react";
import VehContainProd from "./VehContainProd";
import VehContainCom from "./VehContainCom";

const VehContain = () => {
  return (
<div className=" space-y-8">
      <VehContainProd />
      <VehContainCom />
    </div>
  );
};

export default VehContain;

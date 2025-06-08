"use client";

import React from "react";
import VehNotificationProd from "./VehNotificationProd";
import VehNotificationCom from "./VehNotificationCom";

const VehNotification = () => {
  return (
    <div className=" space-y-8">
 
      <VehNotificationProd />
      <VehNotificationCom />
    </div>
  );
};

export default VehNotification;

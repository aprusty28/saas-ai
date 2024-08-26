"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("48583ed4-d59b-4bab-9ba7-78d03955d035");
  }, []);

  return null;
};

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Props {
  universityCard: string | null;
}

const ViewIdButton = ({ universityCard }: Props) => {
  if (!universityCard) {
    return <span className="text-gray-400">No ID</span>;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.open(universityCard, "_blank")}
      className="flex items-center gap-1"
    >
      <Image src="/icons/admin/eye.svg" alt="view" width={12} height={12} />
      View ID
    </Button>
  );
};

export default ViewIdButton;

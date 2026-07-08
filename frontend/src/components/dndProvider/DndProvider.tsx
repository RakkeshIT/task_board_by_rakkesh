"use client";

import { ReactNode } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";

interface DndProviderProps {
  children: ReactNode;
  onDragEnd: (result: DropResult) => void;
}

export default function DndProvider({ children, onDragEnd }: DndProviderProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {children}
    </DragDropContext>
  );
}
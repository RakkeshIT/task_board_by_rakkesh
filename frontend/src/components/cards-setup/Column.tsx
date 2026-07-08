// src/components/Column.tsx

import React, { useState } from "react";
import AddCard from "./AddCard";
import { Card } from "./Card";
import { Droppable  } from "@hello-pangea/dnd";

interface CardData {
    id: number;
    title: string;
    status: string;
}

interface ColumnProps {
    id: string;
    title: string;
    status: string;
    cards: CardData[];
    onAdd: (title: string) => void,
    handleEdit: (id: number, title: string) => void
    handleDelete: (id: number) => void
    
}

export default function Column({
    id,
    title,
    status,
    cards,
    onAdd,
    handleEdit,
    handleDelete
    
}: ColumnProps) {


    const [isOver, setIsOver] = useState(false)
    const columnCards = cards.filter(c => c.status === status);

    return (
        <div className={`flex flex-col gap-4 rounded-lg p-4 min-w-[280px] bg-gray-200
            ${
                isOver 
                  ? "bg-green-100 border-2 border-green-400" 
                  : "bg-gray-100"                            
              }
            `}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'todo' ? 'bg-gray-400' :
                            status === 'in_progress' ? 'bg-yellow-500' :
                                'bg-green-500'
                        }`} />
                    <h2 className="font-semibold text-gray-700">{title}</h2>
                </div>
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {columnCards.length}
                </span>
            </div>

            {/* Cards */}
            <Droppable  droppableId={String(id)}>
                {(provider, snapshot) => (
                    <div
                    ref={provider.innerRef}
                    {...provider.droppableProps}
                    className={`
                      rounded-lg p-2 min-h-[150px] transition-colors duration-200
                      ${
                        snapshot.isDraggingOver
                          ? "bg-emerald-50 border-2 border-dashed border-emerald-300"
                          : "bg-gray-100"
                      }
                    `}
                  >
                    <div className="space-y-2"
                    >
                        {columnCards.map((card, index) => (
                            <Card
                                key={card.id}
                                id={card.id}
                                title={card.title}
                                index={index}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            />
                        ))}
                    </div>

                    {provider.placeholder}

                    {/* Add Card */}
                    <AddCard onAdd={onAdd} />
                    </div>

                )}
            </Droppable >

        </div>
    );
}
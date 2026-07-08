'use client'
import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { GripVertical, Trash } from "lucide-react";
import EditCard from "./EditCard";
import Swal from "sweetalert2";
interface CardProps {
    id: number;
    title: string;
    index: number;
    // onEdit: (id: number, title: string) => void,
    handleDelete: (id: number) => void,
    handleEdit: (id: number, title: string) => void
}
export const Card = ({ id, title, index, handleEdit, handleDelete }: CardProps) => {
    const [isEdite, setIsEdit] = useState(false)

    const handleSave = (newTitle: string) => {
        if (title !== newTitle) {
            handleEdit(id, newTitle)
        }

        setIsEdit(false)
    }

    const handleDeleted = async () => {
        const result = await Swal.fire({
            title: "Delete Card?",
            text: "You won't be able to undo this action.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#ef4444",
        });

        if (result.isConfirmed) {
            handleDelete(id)
            setIsEdit(false)
        }
    }
    const enableEditBox = () => {

        setIsEdit(true)
    }

    const cancelEdit = () => {
        setIsEdit(false)
        console.log("Active");
    }

    return (
        <>
            <Draggable draggableId={String(id)} index={index}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`
        group relative mb-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm
        transition-all duration-200
        ${snapshot.isDragging
                                ? "rotate-2 scale-105 shadow-2xl ring-2 ring-emerald-400"
                                : "hover:shadow-md"
                            }
      `}
                    >
                        {isEdite ? (
                            <EditCard
                                title={title}
                                handleSave={handleSave}
                                handleDelete={handleDeleted}
                                cancelEdit={cancelEdit}
                            />
                        ) : (
                            <div className="flex items-start gap-2">
                                <span
                                    {...provided.dragHandleProps}
                                    className="mt-0.5 shrink-0 cursor-grab text-gray-300 transition-colors group-hover:text-gray-400 active:cursor-grabbing"
                                >
                                    <GripVertical className="h-4 w-4" />
                                </span>

                                <p
                                    onClick={enableEditBox}
                                    className="min-w-0 flex-1 cursor-pointer break-words text-sm font-medium text-gray-800"
                                >
                                    {title || "Empty"}
                                </p>

                                <button
                                    type="button"
                                    onClick={handleDeleted}
                                    className="shrink-0 rounded-md p-1 text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                                >
                                    <Trash size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Draggable>
        </>
    )
}
'use client'

import { cardSchemaType, cardZodSchema } from "@/service/zod/card.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, X } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface onAddProps {
    onAdd: (title: string) => void
}

export default function AddCard({ onAdd }: onAddProps) {
    const [isOpen, setIsOpen] = useState(false)
    const {
        register, handleSubmit, reset, formState: { errors , isSubmitting}
    } = useForm<cardSchemaType>(
        {
            resolver: zodResolver(cardZodSchema)
        }
    )

    const onAddSubmit = (data: cardSchemaType) => {
        try {
            onAdd(data.title)
            reset()
            setIsOpen(false);
        } catch (error) {
            console.log("Error from frontend", error);

        }
    }

    const handleCancel = () => {
        reset();
        setIsOpen(false);
    };
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex justify-center w-full border-1 border-gray-200 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 active:bg-emerald-100"
            >
                <Plus className="h-4 w-4" />
                <span>Add card</span>
            </button>
        )
    }
    return (
        <>

            <form className="mt-2" onSubmit={handleSubmit(onAddSubmit)}>
                <input
                    type="text"
                    {...register('title')}
                    placeholder="Enter card title..."
                    className="w-full p-2 border rounded text-sm mb-2"
                    autoFocus
                />
                {errors.title && (
                    <p className="text-red-500 text-xs mb-2">
                        {errors.title.message}
                    </p>
                )}
                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-emerald-600 text-white px-3 py-1.5 rounded text-sm hover:bg-emerald-700 disabled:opacity-50"
                    >
                        {isSubmitting ? "Adding..." : "Add"}
                    </button>

                    <button
                        type="button"
                        onClick={handleCancel}
                        className="text-gray-500 px-2 py-1.5 text-sm hover:text-gray-700"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </form>

        </>
    )
}
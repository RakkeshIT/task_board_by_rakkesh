'use client'

import { cardSchemaType, cardZodSchema } from "@/service/zod/card.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, Plus, Trash, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

interface onEditProps {
    title: string,
    handleSave: (title: string) => void,
    handleDelete: () => void,
    cancelEdit: () => void,
}

export default function EditCard(
    {   
        title,
        handleSave,
        handleDelete,
        cancelEdit
    }: onEditProps
) {
    const [isOpen, setIsOpen] = useState(false)
    const {
        register, handleSubmit, reset, formState: { errors, isSubmitting }
    } = useForm<cardSchemaType>(
        {
            resolver: zodResolver(cardZodSchema),
            defaultValues: {title}
        }
    )

    useEffect(() => {
        reset({ title });
      }, [title, reset]);

    const onAddSubmit = (data: cardSchemaType) => {
        try {
            handleSave(data.title)
            reset()
            setIsOpen(false);
        } catch (error) {
            console.log("Error from frontend", error);

        }
    }

    // const handleCancel = () => {
    //     reset();
    //     setIsOpen(false);
    // };

    // if (!isOpen) {
    //     return (
    //         <button
    //             onClick={() => setIsOpen(true)}
    //             className="flex justify-center w-full border-1 border-gray-200 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 active:bg-emerald-100"
    //         >
    //             <Plus className="h-4 w-4" />
    //             <span>Add card</span>
    //         </button>
    //     )
    // }
    return (
        <>
            <form className="mt-2 flex items-center gap-2" onSubmit={handleSubmit(onAddSubmit)}>
                {/* Input */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        {...register('title')}
                        placeholder="Enter card title..."
                        className="w-full rounded-lg border border-gray-300 py-2 pl-3 pr-20 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        autoFocus
                    />

                    {/* Edit & Delete */}
                    <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                        <button
                            type="submit"
                            className="rounded-md p-1.5 text-emerald-600 transition hover:bg-emerald-100 hover:text-emerald-700"
                        >
                            <Edit size={16} />
                        </button>
                    </div>
                </div>
                
                {/* Cancel */}
                <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                >
                    <X size={18} />
                </button>
            </form>
        </>
    )
}
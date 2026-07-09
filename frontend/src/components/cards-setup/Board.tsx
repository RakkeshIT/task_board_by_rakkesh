// src/components/Board.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import Column from "./Column";
import { apiService } from "@/service/api";
import { ENDPOINT } from "@/service/endpoints";
import DndProvider from "../dndProvider/DndProvider";
import { toast } from "react-toastify";
import { DropResult } from "@hello-pangea/dnd";
import { useWebSocket } from "@/websocket/useWebSocket";

interface Card {
    id: number;
    title: string;
    status: string;
    position: number;
}

const COLUMNS = [
    { id: "todo", title: "To Do", status: "todo" },
    { id: "in_progress", title: "In Progress", status: "in_progress" },
    { id: "done", title: "Done", status: "done" },
];
const WS_URL = process.env.NODE_ENV === "production" ? process.env.NEXT_PUBLIC_WS_URL! : process.env.NEXT_PUBLIC_LOCAL_WS_URL!

export default function Board() {
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState(true);
    const { lastMessage } = useWebSocket(WS_URL)
    // Initial load — fetch cards
    useEffect(() => {
        if (!lastMessage || !lastMessage.data) return;

        switch (lastMessage.type) {
            case "CARD_CREATED":
                setCards((prev) => {
                    const exists = prev.find((c) => c.id === lastMessage.data.id);
                    if (exists) return prev;
                    return [...prev, lastMessage.data];
                });
                break;

            case "CARD_UPDATED":
            case "CARD_MOVED":
                setCards((prev) =>
                    prev.map((c) => (c.id === lastMessage.data.id ? lastMessage.data : c))
                );
                break;

            case "CARD_DELETED":
                setCards((prev) => prev.filter((c) => c.id !== lastMessage.data.id));
                break;
        }
    }, [lastMessage]);
    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        setLoading(true)
        try {
            const res: any = await apiService({
                url: ENDPOINT.CARD.GETALL,
                method: "POST"
            })
            setCards(res.data);
            console.log("Data: ", res);

        } catch (err) {
            console.error("Failed to fetch cards:", err);
        } finally {
            setLoading(false);
        }

    };


    const onDragEnd = useCallback((result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }
        const CardId = Number(draggableId)
        const newStatus = destination.droppableId
        setCards((prev) => {
            const newCards = [...prev];
            const cardIndex = newCards.findIndex((c) => c.id === CardId);
            if (cardIndex === -1) return prev;

            // Remove from old position
            const [movedCard] = newCards.splice(cardIndex, 1);
            movedCard.status = newStatus;

            // Find insert position in new column
            const targetCards = newCards.filter((c) => c.status === newStatus);
            const insertBefore = targetCards[destination.index];

            if (insertBefore) {
                const insertIndex = newCards.findIndex((c) => c.id === insertBefore.id);
                newCards.splice(insertIndex, 0, movedCard);
            } else {
                newCards.push(movedCard);
            }

            // Recalculate positions for target column
            return newCards.map((c) => {
                if (c.status === newStatus) {
                    const columnCards = newCards.filter((x) => x.status === newStatus);
                    return { ...c, position: columnCards.indexOf(c) };
                }
                return c;
            });
        });

        apiService({
            url: `${ENDPOINT.CARD.UPDATE}/${CardId}`,
            method: "PUT",
            data: { status: newStatus },
        }).catch((err) => {
            console.error("Move failed:", err);
            fetchCards();
        });

    }, [])

    // Add card
    const handleAdd = async (title: string) => {
        try {
            const response: any = await apiService({
                url: ENDPOINT.CARD.ADDCARD,
                method: "POST",
                data: {
                    title: title
                }
            })
            console.log("Response: ", response);
            const newCard = response.data || response

            // setCards((prev) => [...prev, newCard])

            toast.success("Todo Added")

        } catch (error) {
            console.log("error: ", error);

        }
    };

    // Edit card
    const handleEdit = async (id: number, newTitle: string) => {
        setCards((prev) =>
            prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
        );

        try {

            const response: any = await apiService({
                url: `${ENDPOINT.CARD.UPDATE}/${id}`,
                method: "PUT",
                data: {
                    title: newTitle
                }
            })

            console.log("Response Updated: ", response);
            toast.success("Card Updated")

        } catch (error) {
            console.log("Error for Update: ", error);
            fetchCards()
            toast.error("Something went wrong - from Board.tsx in edit functions")
        }

    };

    // Delete card
    const handleDelete = async (id: number) => {

        try {
            const response = await apiService({
                url: `${ENDPOINT.CARD.DELETE}/${id}`,
                method: "DELETE"
            })
            console.log("Deleted Record: ", response);
            toast.success("Record Deleted..")
            setCards((prev) => prev.filter((c) => c.id !== id));
        } catch (error) {
            console.log("Error form record deleted: ", error);
            toast.error("Something wrong in record deleted.")
        }

    };

    if (loading) {
        return <div className="p-8 text-center">Loading board...</div>;
    }


    return (
        <DndProvider onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 py-10">
                {COLUMNS.map(col => (
                    <Column
                        key={col.status}
                        id={col.id}
                        title={col.title}
                        status={col.status}
                        cards={cards}
                        onAdd={handleAdd}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                    />
                ))}
            </div>
        </DndProvider>
    );
}
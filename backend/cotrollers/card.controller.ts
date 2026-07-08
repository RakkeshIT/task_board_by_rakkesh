import { Request, Response } from "express";
import prisma from "../config/prisma";
import { broadcastToAll } from "../config/websocket/websocketserver";

export const getAllCards = async (req: Request, res: Response) => {
    try {

        const cards = await prisma.card.findMany({
            orderBy: {position: 'asc'}
        })
        console.log("Data: ", cards);
        
        res.status(200).json({ message: "Card Fetched!!!", success: true, data: cards });
    } catch (error) {
        res.status(500).json({ message:"Card Fetched Failed",success: false, error: error });
    }
}

export const createCards = async (req: Request, res:Response) => {
    try {
        const {title, status, position} = req.body


        // if(!title || !status || !position) {
        //     console.log("All fileds is Requried");
        //     res.status(400).json({message:"Field Required"})
        // }

        const card = await prisma.card.create({
            data: {
                title,
                status: status || 'todo',
                position: position || 0
            }
        })
        broadcastToAll({
            type: "CARD_CREATED",
            data: card
        })
        res.status(201).json({ message: "Card Added!!!", success: true, data: card });
    } catch (error) {
        res.status(500).json({ message:"Card Added Failed",success: false, error: error });
    }
}


// @DELETE /api/updatecard

export const updateCard = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
            
        if(!id){
            console.log("Id is required");
            res.status(400).json({message: "Id is Required"})
        }

        const {title, status, position} = req.body

        const updatecard = await prisma.card.update({
            where: {id: Number(id)},
            data: {
                title,
                status,
                position
            }
        })
        console.log("Updated Record: ", updatecard);
        console.log("🎯 Broadcasting:", updatecard)
        broadcastToAll({
            type: "CARD_UPDATED",
            data: updatecard
        })
        res.status(200).json({message:"Record Updated", success: true, data: deleteCard})
    } catch (error) {
        res.status(200).json({message:"Record Updated Failed", success: false})
    }
}

// @DELETE /api/delete-card/:id
export const deleteCard = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        if(!id){
            console.log("Id is required");
            res.status(400).json({message: "Id is Required"})
        }

        const deletedCard = await prisma.card.delete({
            where: {id: Number(id)}
        })
        console.log("Deleted Record: ", deletedCard);

        broadcastToAll({
            type: "CARD_DELETED",
            data: {id: Number(id)}
        })
        res.status(200).json({message:"Record Deleted", success: true, data: deleteCard})
    } catch (error) {
        res.status(200).json({message:"Record Deleted Failed", success: false})
    }
}
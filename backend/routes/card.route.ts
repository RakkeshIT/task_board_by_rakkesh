import { Router } from "express";
import { createCards, getAllCards, deleteCard, updateCard } from "../cotrollers/card.controller";
const router = Router()

// @POST /api/getall-card
router.post('/getall-card', getAllCards)

// @POST /api/create-card
router.post('/create-card', createCards)

// @PUT /api/updatecard
router.put('/updatecard/:id', updateCard)

// @DELETE /api/delete-card
router.delete('/delete-card/:id', deleteCard)

export default router
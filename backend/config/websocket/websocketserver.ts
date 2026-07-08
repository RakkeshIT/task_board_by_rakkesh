import { WebSocketServer, WebSocket } from "ws";
import {Server} from 'http'

const client: Map<string, WebSocket> = new Map()
let clientCounter = 0


// Generate Client ID
function generateClientID(): string {
    return `client-${++clientCounter}-${Date.now()}`
}

export type WSEventType = 
  | "CARD_CREATED" 
  | "CARD_UPDATED" 
  | "CARD_DELETED" 
  | "CARD_MOVED"
  | "PRESENCE"
  | "CONNECTED";

export interface WSEvent {
    type: WSEventType;
    data: any;
    senderId?: string
}

export function initialzeWebSocket(httpserver: Server){
    const wss = new WebSocketServer({server: httpserver})

    wss.on('connection', (ws: WebSocket) => {
        const clientId = generateClientID()

        // Store Client Id
        client.set(clientId, ws);
        console.log("Client Connected: ", clientId);
        console.log("Total Clients : ", client.size);
        sendPresence()
        ws.send(JSON.stringify({
            type: "CONNECTED",
            data: {clientId, message:"Welcome"}
        }))

        ws.on("message", (message: string) => {
            try {
                const event:WSEvent = JSON.parse(message.toString())
                console.log("Received: ", event.type, "from: ", clientId);
                
                broadcast(event, clientId)
            } catch (error) {
                console.log("Invalid Message: ", error);
                
            }
        })

        ws.on('close', ()=>{
            client.delete(clientId)
            console.log("client Disconnected: ", clientId);
            console.log("Total Disconnected : ", client.size);
            sendPresence()
            
        })
        
        ws.on('error', (err) => {
            console.log("Websocket Error: ", err);
            
        })
    })

    console.log("webSocket Server Initialized");
    return wss
    
}

export function broadcast(event: WSEvent, exclusiveClientId?: string){
    const message = JSON.stringify(event)
    client.forEach((ws, id) => {
        if(exclusiveClientId && id === exclusiveClientId) return;
        if(ws.readyState !== WebSocket.OPEN) return

        ws.send(message)
    })

}

export function broadcastToAll(event: WSEvent) {
    const message = JSON.stringify(event)
    client.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message)
        }
    })
}

export function sendPresence() {
    const count = client.size
    
    broadcastToAll({
        type: "PRESENCE",
        data: { count }
    })
}

export function getClientCount(): number {
    return client.size
}
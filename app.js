const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const JsonFileAdapter = require('@bot-whatsapp/database/json')
const { delay } = require('@whiskeysockets/baileys')
const path = require('path')
const fs = require('fs')
const chat = require('./chatGPT')

const BienVenida = path.join(__dirname, "mensajes", "helloprofile.txt")
const Stock = path.join(__dirname, "mensajes", "Stock.txt")

const celus = fs.readFileSync(Stock,"utf-8")
const hello = fs.readFileSync(BienVenida,"utf-8")

const comprar = addKeyword(EVENTS.ACTION)
    .addAnswer(celus)
    .addAnswer("Dejanos tu consulta para que nuestro bot te responda.", 
        {capture:true},
        async (ctx, ctxFn) => {
            const prompt = "Responde de forma amigable"
            const consulta = ctx.body
            const respuesta = await chat(promt, consulta)  
            console.log(respuesta)
        })

const flowPrincipal = addKeyword("hola")
    .addAnswer(hello,
        {capture: true},async (ctx,{gotoFlow, fallBack, flowDynamic}) => {
        if (!["1","2"].includes(ctx.body)){}
            switch (ctx.body){
                case "1": 
                    return gotoFlow(comprar);
            }
        }
    )

const main = async () => {
    const adapterDB = new JsonFileAdapter()
    const adapterFlow = createFlow([flowPrincipal, comprar])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()

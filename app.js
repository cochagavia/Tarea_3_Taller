const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

const { message } = require("./models");
const { resultados } = require("./models");

const ngrokUrl = "https://af9c-190-196-138-146.ngrok-free.app";
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// CONECTING PORT BACKEND ********************************************************************************
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// CONECTING DATABASE ********************************************************************************
const { Sequelize } = require("sequelize");

// Configura la conexión a la base de datos
const sequelize = new Sequelize("cristobalochagavia@uc.cl", "cristobalochagavia@uc.cl", "19639902", {
  host: "langosta.ing.puc.cl",
  dialect: "postgres", // o el dialecto de tu elección
});

// Prueba la conexión a la base de datos
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida correctamente.");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos:", error);
  }
}

testConnection();

// ENDPOINTS ********************************************************************************

// ENDPOINT RECIBE TRANSACCION ********************************************************************************
app.post("/recibe_transaction", async (req, res) => {
  try {
    const { body } = req;
    const decodedFields = decodeISO8583(body.message.data);
    console.log(decodedFields);

    if (decodedFields !== null) {
      const id = body.message.messageId;



      const result = await message.findOne({
        where: { messageId: id },
      });

      console.log(result);

      if (result === null) {
        const new_message = await message.create({
          attributes: {
            key: "value",
          },
          data: body.message.data,
          messageId: body.message.messageId,
          publishTime: body.message.publishTime,
          subscription: body.subscription,
          operationType: decodedFields.operationType,
          transactionId: decodedFields.transactionId,
          sourceBank: decodedFields.sourceBank,
          sourceAccount: decodedFields.sourceAccount,
          destinationBank: decodedFields.destinationBank,
          destinationAccount: decodedFields.destinationAccount,
          amount: decodedFields.amount,
        });
        res.sendStatus(200);
      }
    }
  } catch (error) {
    // console.error("Error al recibir transacción:", error.message);
    console.error("Error al recibir transacción:", error.message);
    res.sendStatus(500);
  }
});

// FUNCIÓN PARA DECODIFICAR EL MENSAJE ISO8583 ************************************************************************************************
function decodeISO8583(encodedMessage) {
  // Decodificar el mensaje en base64
  const decodedMessage = Buffer.from(encodedMessage, "base64").toString("utf-8");

  // Verificar si el mensaje tiene la longitud adecuada
  if (decodedMessage.length !== 64) {
    return null;
    // throw new Error("Longitud de mensaje incorrecta. El mensaje decodificado debe tener 64 caracteres.");
  }

  // Obtener los campos del mensaje
  const operationType = decodedMessage.substr(0, 4);
  const messageId = decodedMessage.substr(4, 10);
  const sourceBank = decodedMessage.substr(14, 7);
  const sourceAccount = decodedMessage.substr(21, 10);
  const destinationBank = decodedMessage.substr(31, 7);
  const destinationAccount = decodedMessage.substr(38, 10);
  const amount = decodedMessage.substr(48, 16);

  // Decodificar los campos según el formato
  const decodedFields = {
    operationType: operationType === "2200" ? "Envío de fondos" : "Reversa de transacción",
    transactionId: Number(messageId),
    sourceBank: Number(sourceBank),
    sourceAccount: Number(sourceAccount),
    destinationBank: Number(destinationBank),
    destinationAccount: Number(destinationAccount),
    amount: Number(amount),
  };

  return decodedFields;
}


// FUNCIÓN SUMAR O RESTAR RESULTADO ENTRE BANCOS ************************************************************************************************
function procesarTransaccion(banco1, banco2, monto, operacion) {
  // Realiza la suma o resta de los montos según corresponda

  // const resultado = banco1 + banco2 >= 0 ? monto : -monto;

  // Verifica si la tupla de bancos ya está creada en el modelo de conciliación
  const conciliacionExistente1 = resultados.findOne({
    where: {
      banco1: banco1,
      banco2: banco2,
    },
  });

  // Verifica si la tupla de bancos ya está creada en el modelo de conciliación
  const conciliacionExistente2 = resultados.findOne({
    where: {
      banco1: banco2,
      banco2: banco1,
    },
  });

  if(operacion === "Envío de fondos"){
    const new_monto = -monto;
  }else{
    const new_monto = monto;
  }


  if (!conciliacionExistente1 | !conciliacionExistente2) {
    // Si la tupla no está creada, crea una nueva instancia de conciliación
    const nuevaConciliacion = resultados.create({
      banco1,
      banco2,
      new_monto,
    });

    return resultado;
  } else if (conciliacionExistente1) {

    const monto_sumado = conciliacionExistente1.monto + new_monto;
    // Si la tupla ya existe, actualiza el monto existente
    resultados.update(
      { monto: monto_sumado },
      {
        where: {
          banco1: banco1,
          banco2: banco2,
        },
      }
    );
    return resultado;
  } else if (conciliacionExistente2) {

    const monto_sumado = conciliacionExistente2.monto - new_monto;
    // Si la tupla ya existe, actualiza el monto existente
    resultados.update(
      { monto: monto_sumado },
      {
        where: {
          banco1: banco2,
          banco2: banco1,
        },
      }
    );
    return resultado;
  }
}

// ENDPOINT SEND SUBSCRIPTION ********************************************************************************
// app.post("/send_subscrition", async (req, res) => {
//   try {
//     const url =
//       "https://us-central1-taller-integracion-310700.cloudfunctions.net/tarea-3-2023-1/subscriptions/19639902";

//     // const { urlAlumno } = req.body;
//     const headers = { "Content-Type": "application/json" };
//     // const body = { url: urlAlumno };
//     const body = { url: `${ngrokUrl}/recibe_transaction` };

//     const response = await axios.post(url, body, { headers });

//     // res.json(response.data);
//   } catch (error) {
//     console.error("Error al enviar la solicitud:", error.message);
//     res.status(500).json({ error: "Error al enviar la solicitud" });
//   }
// });

// ENDPOINT DELETE SUBSCRIPTION ********************************************************************************
// app.delete("/delete_subscription", async (req, res) => {
//   try {
//     const url =
//       "https://us-central1-taller-integracion-310700.cloudfunctions.net/tarea-3-2023-1/subscriptions/19639902";

//     const response = await axios.delete(url);

//     res.json(response.data);
//   } catch (error) {
//     console.error("Error al enviar la solicitud:", error.message);
//     res.status(500).json({ error: "Error al enviar la solicitud" });
//   }
// });

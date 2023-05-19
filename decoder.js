function decodeISO8583(encodedMessage) {
    // Decodificar el mensaje en base64
    const decodedMessage = Buffer.from(encodedMessage, "base64").toString("utf-8");
  
    console.log(decodedMessage);
    // Verificar si el mensaje tiene la longitud adecuada
    if (decodedMessage.length !== 64) {
      throw new Error("Longitud de mensaje incorrecta. El mensaje decodificado debe tener 64 caracteres.");
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
      messageId: Number(messageId),
      sourceBank: Number(sourceBank),
      sourceAccount: Number(sourceAccount),
      destinationBank: Number(destinationBank),
      destinationAccount: Number(destinationAccount),
      amount: Number(amount),
    };
  
    return decodedFields;
  }

  // Ejemplo de uso
const encodedMessage = "MjQwMDE2MjU3MTY3MjUwMDM2NTI1MDAwMDA1NjAzNjAwMzY5NDIwMDAwMDM3NDI5MDAwMDAwMDAwMDk5OTk5MA==";
const decodedFields = decodeISO8583(encodedMessage);
console.log(decodedFields);
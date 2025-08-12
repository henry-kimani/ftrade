import net from 'net';
import accountStatus from "./server/account_status.json";
import tradeHistory from "./server/trade_history.json";
import { ClientCommands } from './msg_types';

const FIRST_RESULT = 0;

const server = net.createServer();

server.on("connection", function(socket) {

  console.log(`CONNECTED: ${socket.remoteAddress}:${socket.remotePort}`);

  socket.on('data', async function(buffer) {
    const data = buffer.toString();

    /* Check if data was sent */
    if (data.indexOf('\r\n') > -1) {
      const msg: ClientCommands = JSON.parse(data.split('\r\n')[FIRST_RESULT]);
      console.log("DATA: ", msg);
      const result = await getData(msg);

      console.log("SENT: ", result);

      if (result) socket.write('\r\n'+result+'\r\n');
    }
  });

  socket.on("close", function() {
    console.log(`CLOSED: ${socket.remoteAddress} \n`);
  });

  socket.pipe(socket);
});

server.on('error', (err) => {
  console.log(err);
  throw err;
})

server.listen(8000, '127.0.0.1', () => {
  console.log("TCP server listening on localhost:"+8000+" ...");
});


async function getData(msg: ClientCommands) {

  switch (msg.MSG) {
    case "ACCOUNT_STATUS":
      return JSON.stringify(accountStatus);

    case 'TRADE_HISTORY':
      return JSON.stringify(tradeHistory);

    default:
      break;
  }
}


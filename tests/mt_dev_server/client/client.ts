import net from "net";

const client = new net.Socket();

client.connect(8080, '127.0.0.1', function() {
  client.write('{"MSG": "TRADE_HISTORY"}'+'\r\n');
});

client.on('data', function(data) {
  const response = data.toString();
  if (response.indexOf("\r\n") > 0) {
    const resString = response.split("\r\n")[0];
    const resJSON = JSON.parse(resString);
    console.log(resJSON);
  }

  client.end();
});

client.on('close', function() {
  console.log("CONNECTION CLOSED");
});

client.on('error', function(error){
  console.log(error);
  throw error;
});

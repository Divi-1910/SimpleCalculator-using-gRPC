const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "../contract.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  defaults: true,
  oneofs: true
});
const protoDescriptor =
  grpc.loadPackageDefinition(packageDefinition).calculator;

function add(call, callback) {
  const a = call.request.a;
  const b = call.request.b;
  const result = a + b;
  console.log(`Add: ${a} + ${b} = ${result}`);
  callback(null, { result: result });
}

function subtract(call, callback) {
  const a = call.request.a;
  const b = call.request.b;
  const result = a - b;
  console.log(`Subtract: ${a} - ${b} = ${result}`);
  callback(null, { result: result });
}

function unimplemented(call, callback) {
  callback({
    code: grpc.status.UNIMPLEMENTED,
    details: "Method not implemented on this server"
  });
}

function main() {
  const server = new grpc.Server();
  server.addService(protoDescriptor.Calculator.service, {
    Add: add,
    Subtract: subtract,
    Multiply: unimplemented,
    Divide: unimplemented
  });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(
        `Node.js Calculator (Add/Subtract) Server running on port: ${port}`
      );
      server.start();
    }
  );
}

main();

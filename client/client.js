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

const jsClient = new protoDescriptor.Calculator(
  "localhost:50051",
  grpc.credentials.createInsecure()
);
const javaClient = new protoDescriptor.Calculator(
  "localhost:50052",
  grpc.credentials.createInsecure()
);
const goClient = new protoDescriptor.Calculator(
  "localhost:50053",
  grpc.credentials.createInsecure()
);

function performCall(client, method, requestData, callback) {
  client[method](requestData, (error, response) => {
    if (error) {
      console.error(`${method} error:`, error);
      callback(error);
    } else if (response.error) {
      console.error(`${method} returned error:`, response.error);
      callback(new Error(response.error));
    } else {
      console.log(`${method} result:`, response.result);
      callback(null, response.result);
    }
  });
}

function main() {
  performCall(jsClient, "Add", { a: 10, b: 5 }, () => {
    performCall(jsClient, "Subtract", { a: 10, b: 5 }, () => {
      performCall(javaClient, "Multiply", { a: 10, b: 5 }, () => {
        performCall(goClient, "Divide", { a: 10, b: 5 }, () => {
          performCall(goClient, "Divide", { a: 10, b: 0 }, () => {
            console.log("All operations completed.");
          });
        });
      });
    });
  });
}

main();

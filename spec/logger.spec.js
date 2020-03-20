const { logger } = require("../server/logger/logger.js");
const { expect } = require("chai");

describe("logger", () => {
  it("takes a message and appends to the errors.txt file", () => {
    const req = "hello";
    const err = "world";
    output = logger(msg, err);
    console.log(output);
  });
});

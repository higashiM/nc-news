const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("takes an array of objects and converts the timestamp into a javascript date object", () => {
    const input = [
      { a: "a", b: "b", created_at: "1500000000000" },
      { a: "a", b: "b", created_at: "2017-07-14T03:40:00" },
      { a: "a", b: "b", created_at: "2020-03-16T12:00:00" }
    ];
    const output = formatDates(input);
    expect(output[0].created_at).to.be.a("Date");
  });
  it("does not mutate the other fields", () => {
    const input = [
      { a: "a", b: "b", created_at: "1500000000000" },
      { a: "a", b: "b", created_at: "2017-07-14T03:40:00" },
      { a: "a", b: "b", created_at: "2020-03-16T12:00:00" }
    ];
    const control = [
      { a: "a", b: "b", created_at: new Date(1500000000000) },
      { a: "a", b: "b", created_at: new Date("2017-07-14T03:40:00") },
      { a: "a", b: "b", created_at: new Date("2020-03-16T12:00:00") }
    ];

    const output = formatDates(input);
    expect(output).to.eql(control);
  });
});

describe("makeRefObj", () => {
  it("creates a key pair ref object for a specified id and value", () => {
    const input = [
      { a: "abra", b: "c", c: 1 },
      { a: "cadabra", b: "d", c: 2 }
    ];
    const expected = { abra: 1, cadabra: 2 };
    const output = makeRefObj(input, "a", "c");
    expect(output).to.be.a("object");
    expect(output).to.eql(expected);
  });
  it("does not mutate the original", () => {
    const input = [
      { a: "abra", b: "c", c: 1 },
      { a: "cadabra", b: "d", c: 2 }
    ];
    const control = [
      { a: "abra", b: "c", c: 1 },
      { a: "cadabra", b: "d", c: 2 }
    ];
    const output = makeRefObj(input, "a", "c");
    expect(input).to.eql(control);
  });
});

describe("formatComments", () => {
  it("reformats an array of  comments objects with the correctly named keys and values", () => {
    const input = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const lookupRef = { "Living in the shadow of a great man": 1 };
    const output = formatComments(input, lookupRef);

    expect(output[0]).to.contain.keys(
      "author",
      "article_id",
      "votes",
      "created_at"
    );
    expect(output[0]).to.not.contain.keys("created_by", "belongs_to");
    expect(output[0].article_id).to.equal(1);
    expect(output[0].created_at).to.be.a("Date");
    expect(output).to.be.a("array");
  });
  it("does not mutate the original and copies the body and votes fields", () => {
    const input = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const control = [
      {
        body:
          "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 14,
        created_at: 1479818163389
      }
    ];
    const lookupRef = { "Living in the shadow of a great man": 1 };
    const output = formatComments(input, lookupRef);

    expect(input).to.eql(control);
    expect(output[0].votes).to.equal(input[0].votes);
    expect(output[0].body).to.equal(input[0].body);
  });
});

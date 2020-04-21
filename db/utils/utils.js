const moment = require("moment");
const bcrypt = require("bcrypt");

exports.formatDates = (list) => {
  return list.map((item) => {
    let newItem = {
      ...item,
    };
    let d = /^[0-9]*$/.test(item.created_at)
      ? Number(item.created_at)
      : item.created_at;
    newItem.created_at = new Date(d);
    return newItem;
  });
};

exports.makeRefObj = (list, key, value) => {
  let lookUpObj = {};
  list.forEach((item) => {
    lookUpObj[item[key]] = item[value];
  });
  return lookUpObj;
};

exports.encryptPasswords = (users) => {
  return users.map((user) => {
    return (newUser = {
      ...user,
      password: bcrypt.hashSync(user.password, 1),
    });
  });
};

exports.formatComments = (comments, articleRef) => {
  return comments.map((item) => {
    let newItem = {
      article_id: articleRef[item.belongs_to],
      votes: item.votes,
      created_at: new Date(item.created_at),
      body: item.body,
      author: item.created_by,
    };

    return newItem;
  });
};

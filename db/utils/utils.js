exports.formatDates = list => {
  return list.map(item => {
    let newItem = {
      ...item
    };
    /^[0-9]*$/.test(item.created_at)
      ? (d = Number(item.created_at))
      : (d = item.created_at);
    newItem.created_at = new Date(d);
    return newItem;
  });
};

exports.makeRefObj = (list, key, value) => {
  let lookUpObj = {};
  list.forEach(item => {
    lookUpObj[item[key]] = item[value];
  });
  return lookUpObj;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(item => {
    let newItem = {
      article_id: articleRef[item.belongs_to],
      votes: item.votes,
      created_at: new Date(item.created_at),
      body: item.body,
      author: item.created_by
    };

    return newItem;
  });
};

const moment = require("moment");

exports.dateNow = moment.utc();

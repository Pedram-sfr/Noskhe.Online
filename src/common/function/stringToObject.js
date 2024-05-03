const stringToObject = function(data) {
    const jsonStr = data.replace(/(\w+:)|(\w+ :)/g, function(s) {
        return '"' + s.substring(0, s.length-1) + '":';
      });
      const myobj = JSON.parse(jsonStr);
      return myobj
}

module.exports = {
    stringToObject
}
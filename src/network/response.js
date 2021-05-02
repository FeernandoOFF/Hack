module.exports.success = function (req, res, data, InternalLog, status) {
  res.status(status || 200).send({
    error: '',
    data,
  });
  console.log(InternalLog || 'Response Ok');
};
module.exports.error = function (req, res, data, InternalLog, status) {
  res.status(status || 400).send({
    error: data,
    data: '',
  });
};

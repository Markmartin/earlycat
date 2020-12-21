function isValidPhone(str) {
  var myreg = /^[1][0-9][0-9]{9}$/;
  if (!myreg.test(str)) {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  isValidPhone
}
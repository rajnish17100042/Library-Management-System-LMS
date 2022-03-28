const validateInput = (req) => {
  // console.log(req.roleFromFrontend);
  // console.log(req.body);
  // server side validation
  // destructuring the data

  console.log(req.body);
  const { name, email, phone, address, city, state, pincode, role } = req.body;

  //   server side validation
  if (
    !name ||
    !email ||
    !phone ||
    !address ||
    !city ||
    !state ||
    !pincode ||
    !role
  ) {
    return false;
  } else {
    return true;
  }
};

module.exports = validateInput;

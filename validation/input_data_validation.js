const validateInput = (req) => {
  // console.log(req.roleFromFrontend);
  // console.log(req.body);
  // server side validation
  // destructuring the data

  console.log(req.body);
  const {
    user_id,
    name,
    email,
    phone,
    address,
    city,
    state,
    pincode,
    role,
    password,
    cpassword,
  } = req.body;

  //   server side validation
  if (
    (!user_id ||
      !name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !role ||
      !password ||
      !cpassword) &&
    password !== cpassword
  ) {
    return false;
  } else {
    return true;
  }
};

module.exports = validateInput;

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

const validateBookDetails = (data) => {
  console.log(data);
  const {
    book_id,
    bk_title,
    bk_name,
    publisher,
    author,
    bk_copies,
    bk_category,
  } = data;

  //   server side validation
  if (
    !book_id ||
    !bk_title ||
    !bk_name ||
    !publisher ||
    !author ||
    !bk_copies ||
    !bk_category
  ) {
    return false;
  } else {
    return true;
  }
};
module.exports = { validateInput, validateBookDetails };

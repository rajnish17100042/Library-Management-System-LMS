const validateInput = (data) => {
  console.log(data);

  //   server side validation
  if (
    !data.name ||
    !data.email ||
    !data.phone ||
    !data.address ||
    !data.city ||
    !data.state ||
    !pdata.incode ||
    !data.role
  ) {
    return false;
  } else {
    return true;
  }
};

const validateBookDetails = (data) => {
  console.log(data);

  //   server side validation
  if (
    !data.book_id ||
    !data.bk_title ||
    !data.bk_name ||
    !data.publisher ||
    !data.author ||
    !data.bk_copies ||
    !data.bk_category
  ) {
    return false;
  } else {
    return true;
  }
};

module.exports = { validateInput, validateBookDetails };

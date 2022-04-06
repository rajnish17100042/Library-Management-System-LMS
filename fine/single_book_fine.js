const calculate_fine = (data) => {
  console.log("inside fine calculation function");
  let fine = 0;
  const current_date = new Date().toLocaleDateString();
  console.log(current_date);

  const return_date = data.return_date;
  const date_array = return_date.split("/");
  const date_array2 = current_date.split("/");

  const current_date_day =
    new Date(date_array2[2], date_array2[0], date_array2[1]).getTime() /
    (1000 * 60 * 60 * 24);

  //new Date(yyyy,mm,dd)
  const return_date_day =
    new Date(date_array[2], date_array[0], date_array[1]).getTime() /
    (1000 * 60 * 60 * 24);

  const late = current_date_day - return_date_day;
  console.log(late);
  if (late > 0) {
    console.log("number of late days : ", late);
    console.log("fine for this book is : $ ", late * 10);
    fine = late * 10;
  }

  return fine;
};

module.exports = calculate_fine;

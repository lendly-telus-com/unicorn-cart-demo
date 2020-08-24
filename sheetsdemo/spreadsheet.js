const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const creds = require('./client_secret.json');

function printStudent(student) {
  console.log(`Name: ${student.studentname}`);
  console.log(`Major: ${student.major}`);
  console.log(`Home State: ${student.homestate}`);
  console.log('---------------');
}

async function accessSpreadsheet() {
  try {
    const doc = new GoogleSpreadsheet(
      '1Ozy7v2ooqoTZlcZKrbohVPIH9oRIeq4Wfr7dlaNYIIo'
    );
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[0];

    //*** // show table title and number of rows
    //console.log(`Title : ${sheet.title}, Rows: ${sheet.rowCount}`);

    //*** */ get all --view all -- view limit -- edit
    //const rows = await promisify(sheet.getRows)({ offset: 1 });
    //not a good format**
    //console.log(rows);

    // const rows = await promisify(sheet.getRows)({
    //   //   // by page
    //   offset: 5,
    //   limit: 10,
    //   orderby: 'homestate',

    //   //view only NY
    //   query: 'homestate = NY',
    // });
    // rows.forEach((row) => {
    //   printStudent(row);

    //   //change from NY to PA
    //   row.homestate = 'PA';
    //   row.save();
    // });

    //**adding entry to sheet */
    const row = {
      studentname: 'Jed G.',
      major: 'Computer Engineering',
      homestate: 'PA',
      classlevel: '5. Graduated',
      extracurricularactivity: 'Music',
      gender: 'male',
    };
    await promisify(sheet.addRow)(row);

    ///// delete firs Brent in the row**.///
    // const rows = await promisify(sheet.getRows)({
    //   query: 'studentname = Brent',
    // });
    // rows[0].del();

    ///*** view 3 row and 2 col  */
    // const cells = await promisify(sheet.getCells)({
    //   'min-row': 1,
    //   'max-row': 3,
    //   'min-col': 1,
    //   'max-col': 2,
    // });
    // for (const cell of cells) {
    //   console.log(`${cell.row}, ${cell.col}: ${cell.value}`);
    // }

    // cells[2].value = 'Alexis';
    // cells[2].save();
  } catch (err) {
    console.log(err);
  }
}

accessSpreadsheet();

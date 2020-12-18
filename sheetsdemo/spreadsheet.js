const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const creds = require('./client_secret.json');

async function accessSpreadsheet() {
  try {
    const doc = new GoogleSpreadsheet(
      '1I6ByqrazLDfagtDqH5soXTcp9YQf3r9wypk5to4bqZY'
    );
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[0];

    const rows = await promisify(sheet.getRows)({
      query: 'homestate = ZZZ',
    });
    rows.forEach((row) => {
      global.attendance = row.attendance;
      row.attendance++;
      row.save();
      global.name = row.studentname;
      global.major = row.major;
      console.log(global.major);
      console.log(global.name);
    });

    ///end
  } catch (err) {
    console.log(err);
  }
}

accessSpreadsheet();

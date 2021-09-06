const db = require("../db");

// Accepts an array of post objects(rows)
async function convertIdToUsername(rows) {
  try {
    const requests = rows.map(async (row) => {
      const username = await db.query(
        "SELECT username FROM author WHERE authorId = $1",
        [row.author]
      );
      row.author = username.rows[0].username;
    });

    await Promise.all(requests);

    return rows;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  convertIdToUsername,
};

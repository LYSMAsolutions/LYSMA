const bcrypt = require("bcrypt");

const password = "Temp123!";

async function run() {
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
}

run();
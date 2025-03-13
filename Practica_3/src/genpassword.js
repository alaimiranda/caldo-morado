import bcrypt from "bcryptjs";

console.log(`BCRYPT 'userpass': ${bcrypt.hashSync('userpass')}`);
console.log(`BCRYPT 'adminpass': ${bcrypt.hashSync('adminpass')}`);
import bcryptjs from 'bcryptjs' 

const plainPassword = 'damtal.com';
const hashed = bcryptjs.hashSync(plainPassword, 10);

console.log('Hashed password:', hashed);

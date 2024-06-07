import bcrypt from "bcryptjs";

const users = [
    {
        name: "Admin User",
        email: "admin@email.com",
        password:bcrypt.hashSync('123456',10),
        isAdmin:true,
    },
    {
        name: "Babu Rao",
        email: "rao@email.com",
        password:bcrypt.hashSync('123456',10),
        isAdmin:false,
    },
    {
        name: "Circuit Bhai",
        email: "circuit@email.com",
        password:bcrypt.hashSync('123456',10),
        isAdmin:false,
    },
]

export default users;
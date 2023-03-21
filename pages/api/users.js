import users from '../../data/users.json'

export default function handler(req,res){
    res.status(200).json(users);
}
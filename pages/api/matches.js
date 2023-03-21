import matches from '../../data/matches.json'

export default function handler(req,res){
    res.status(200).json(matches);
}
import {Command} from 'commander'

const commander = new Command()

commander
    .option('--mode <mode>', 'Modo de ejecución')
    .parse()

// module.exports = {
//     commander
// }
export default commander
// nodemon src/app --mode development
// nodemon src/app --mode production
process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@/app';
import GamesRoute from '@routes/games.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new GamesRoute()]);

app.listen();

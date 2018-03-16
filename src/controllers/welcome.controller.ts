import {Router, Request, Response } from 'express';
import { IMAPService } from '../services/imap.service';
import { Config } from 'imap';
var Config = require('../../config.json');

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    let config = Config.mailSettings;
    config.user = 'xt@xpresstek.net';
    config.password = 'rAM&4I4yXvE9';
    config.host = 'imap.1and1.com';
    config.port = 993;
    config.tls = true;

    let imap = new IMAPService(config);
    imap.Connect();

    res.send('Hello world');
});

export const WelcomeController: Router = router;
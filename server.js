const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');

const FeedbackService = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakersService = new SpeakersService('./data/speakers.json');

const routes = require('./routes');

const app = express();

const port = 3000;

app.set('trust proxy', 1);

app.use(cookieSession({
    name: 'session',
    keys: ['Ghuesfhenbk32', 'efbdufgbekfe'],
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

// Application of middleware
app.use(express.static(path.join(__dirname, './static')));

app.use('/', routes({
    feedbackService,
    speakersService,
}));

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Express server listening on port ${port}`);
});

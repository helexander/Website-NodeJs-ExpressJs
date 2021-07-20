/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');

const bodyParser = require('body-parser');

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'JP Top Shuttles';

// Application of middleware
app.use(express.static(path.join(__dirname, './static')));

app.use(async (req, res, next) => {
    try {
        const names = await speakersService.getNames();
        res.locals.speakerNames = names;
        return next();
    } catch (err) {
        return next(err);
    }
});

app.use('/', routes({
    feedbackService,
    speakersService,
}));

// If no route matches, show error page
app.use((req, res, next) => {
    return next(createError(404, 'File not found'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    console.log(err);
    const status = err.status || 500;
    res.locals.status = status;
    res.status(status);
    res.render('error');
});

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Express server listening on port ${port}`);
});

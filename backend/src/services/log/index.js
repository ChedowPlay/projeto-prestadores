// 250129V


import { time } from '../time';
import winston from 'winston';
import { env } from '../env';


const logPath = env.PATH_LOG ? `${env.PATH_LOG}serverlog.log` : 'serverlog.log';


const transports = [
    new winston.transports.File({ filename: logPath })
]


const format = winston.format.combine(
    winston.format.printf(info => JSON.stringify({
        timestamp: (new Date().getTime()),
        clock: time.getFormatedTime(),
        level: info.level,
        message: info.message,
    }))
);


const logger = winston.createLogger({ format, transports, });


console.log = function (...args) {
    const message = args.join(' ');
    logger.info(message);
    process.stdout.write(message + '\n');
};


console.error = function (...args) {
    const message = args.join(' ');
    logger.error(message);
    process.stderr.write(message + '\n');
};


console.warn = function (...args) {
    const message = args.join(' ');
    logger.warn(message);
    process.stderr.write(message + '\n');
};


import { performance } from 'perf_hooks';
console.time = function (label = 'default') {
    if (!this._times) this._times = {};
    this._times[label] = performance.now();
};


console.timeEnd = function (label = 'default') {
    if (!this._times || !this._times[label]) {
        console.warn(`Timer "${label}" was not started`);
        return;
    }
    const durationMs = performance.now() - this._times[label];
    const durationSeconds = durationMs / 1000;
    console.log(`> ${label}: ${durationSeconds.toFixed(3)}s`);
    delete this._times[label];
};



export default logger;

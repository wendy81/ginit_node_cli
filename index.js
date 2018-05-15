#!/usr/bin/env node
'use strict';

var _files = require('./lib/files');

var _files2 = _interopRequireDefault(_files);

var _inquirer = require('./lib/inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _github = require('./lib/github');

var _github2 = _interopRequireDefault(_github);

var _repo = require('./lib/repo');

var _repo2 = _interopRequireDefault(_repo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var pkg = require('../package.json');

require('babel-polyfill'); //async await   need it

var Configstore = require('configstore');
var conf = new Configstore(pkg.name);

clear();
console.log(chalk.yellow(figlet.textSync('Ginit', {
    horizontalLayout: 'full'
})));

if (_files2.default.directoryExists('.git')) {
    console.log(chalk.red('Already a git repository!'));
    // process.exit()
}

var getGithubToken = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var token;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // Fetch token from config store
                        token = _github2.default.getStoredGithubToken();

                        console.log(token);

                        if (!token) {
                            _context.next = 4;
                            break;
                        }

                        return _context.abrupt('return', token);

                    case 4:
                        _context.next = 6;
                        return _github2.default.setGithubCredentials();

                    case 6:
                        _context.next = 8;
                        return _github2.default.registerNewToken();

                    case 8:
                        token = _context.sent;
                        return _context.abrupt('return', token);

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function getGithubToken() {
        return _ref.apply(this, arguments);
    };
}();

var run = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var token, url, done;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        _context2.next = 3;
                        return getGithubToken();

                    case 3:
                        token = _context2.sent;

                        _github2.default.githubAuth(token);

                        // Create remote repository
                        _context2.next = 7;
                        return _repo2.default.createRemoteRepo();

                    case 7:
                        url = _context2.sent;
                        _context2.next = 10;
                        return _repo2.default.createGitignore();

                    case 10:
                        _context2.next = 12;
                        return _repo2.default.setupRepo(url);

                    case 12:
                        done = _context2.sent;

                        if (done) {
                            console.log(chalk.green('All done!'));
                        }
                        _context2.next = 27;
                        break;

                    case 16:
                        _context2.prev = 16;
                        _context2.t0 = _context2['catch'](0);

                        if (!_context2.t0) {
                            _context2.next = 27;
                            break;
                        }

                        _context2.t1 = _context2.t0.code;
                        _context2.next = _context2.t1 === 401 ? 22 : _context2.t1 === 422 ? 24 : 26;
                        break;

                    case 22:
                        console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'));
                        return _context2.abrupt('break', 27);

                    case 24:
                        console.log(chalk.red('' + JSON.parse(_context2.t0.message).message));
                        return _context2.abrupt('break', 27);

                    case 26:
                        console.log(_context2.t0);

                    case 27:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined, [[0, 16]]);
    }));

    return function run() {
        return _ref2.apply(this, arguments);
    };
}();

run();

//Configstore { path: '/Users/apple/.config/configstore/ginit.json' }
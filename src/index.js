#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const pkg = require('../package.json');

require('babel-polyfill'); //async await   need it

import files from './lib/files';
import inquirer from './lib/inquirer';
import github from './lib/github';
import repo from './lib/repo';

const Configstore = require('configstore');
const conf = new Configstore(pkg.name);

clear();
console.log(
    chalk.yellow(
        figlet.textSync('Ginit', {
            horizontalLayout: 'full'
        })
    )
)

if (files.directoryExists('.git')) {
    console.log(chalk.red('Already a git repository!'))
    // process.exit()
}

const getGithubToken = async() => {
    // Fetch token from config store
    let token = github.getStoredGithubToken();
    console.log(token)
    if (token) {
        return token;
    }

    // No token found, use credentials to access GitHub account
    await github.setGithubCredentials();

    // register new token
    token = await github.registerNewToken();
    return token;
}

const run = async() => {
    try {
        // Retrieve & Set Authentication Token
        const token = await getGithubToken();
        github.githubAuth(token);

        // Create remote repository
        const url = await repo.createRemoteRepo();
        // Create .gitignore file
        await repo.createGitignore();

        // Set up local repository and push to remote
        const done = await repo.setupRepo(url);
        if (done) {
            console.log(chalk.green('All done!'));
        }
    } catch (err) {
        if (err) {
            switch (err.code) {
                case 401:
                    console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'));
                    break;
                case 422:
                    console.log(chalk.red(`${JSON.parse(err.message).message}`));
                    break;
                default:
                    console.log(err);
            }
        }
    }
}

run()


//Configstore { path: '/Users/apple/.config/configstore/ginit.json' }
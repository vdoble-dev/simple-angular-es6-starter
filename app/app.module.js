require('./app.scss');

import angular from 'angular';

import {AppController} from './app.controller';

angular.module('appModule', [])
	.controller('AppController', AppController);
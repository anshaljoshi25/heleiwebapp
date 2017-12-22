'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('adminportal',['googlechart','smart-table', 'angularFileUpload','monospaced.qrcode']);
ApplicationConfiguration.registerModule('adminportal.admin', ['adminportal']);
ApplicationConfiguration.registerModule('adminportal.admin.routes', ['ui.router']);

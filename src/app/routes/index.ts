import { Application } from "express";

const noteRoutes = require('./note_routes');

module.exports = (app: Application, db: any) => {
    noteRoutes(app, db);
};
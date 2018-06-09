import {Application, Request, Response} from "express";
import { Note } from "../interfaces/note";
import {MongoError} from "mongodb";
import {ObjectID} from "bson";

module.exports = (app: Application, db: any) => {
    const notesCollection = db.collection('notes');
    const standardErrorHandler = () => {
        return {error: 'An error has occured'}
    };

    app.get('/notes/:id', (req: Request, res: Response) => {
        const details = { '_id': new ObjectID(req.params.id) };
        notesCollection.findOne(details, (err: MongoError, item: any) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('item', item);
                res.send(item);
            }
        });
    });

    app.get('/notes', (req: Request, res: Response) => {
        db.collection('notes').find({}).toArray((err: any, result: any) => {
            (err) ? res.send(standardErrorHandler()) : res.send(result);
        });
    });

    app.post('/notes', (req: Request, res: Response) => {
        const note: Note = { text: req.body.body, title: req.body.title};
        notesCollection.insert(note, (err: any, result: any) => {
            console.log(result.ops);
            (err) ? res.send(standardErrorHandler()) : res.send(result.ops[0]);
        });
        console.log(req.body);
    });

    app.delete('/notes/:id', (req: Request, res: Response) => {
        const id = req.params.id;
        const details = {'_id' : new ObjectID(id)};
        notesCollection.remove(details, (err: any, item: any) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                res.send('Note ' + id + ' deleted!');
            }
        })
    });

    app.put('/notes/:id', (req: Request, res: Response) => {
        console.log('new put');
        const id = req.params.id;
        const details = {'_id': new ObjectID(id)};
        const note = {
            text: req.body.body,
            title: req.body.title
        };
        notesCollection.updateOne(details, {$set: note}).then((success: any) => {
            notesCollection.findOne(details, (err: MongoError, item: any) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('item', item);
                    res.send(item);
                }
            });
        }, (error: any) => {
            console.log('error', error)
        })
    });
};
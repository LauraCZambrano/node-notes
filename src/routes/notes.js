const router = require('express').Router();

const Note = require('../models/Note');

router.get('/notes/create', (req,res) => {
    res.render('notes/new-note');
});

router.post('/notes/store', async (req,res) => {
    const {title, description} = req.body;
    const errors = [];
    if(!title) {
        errors.push({text: 'Please write a title'});
    }
    if(!description) {
        errors.push({text: 'Please write a description'});
    }
    if(errors.length > 0){
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    }
    else{
        const newNote = new Note({ title, description });
        await newNote.save();
        req.flash('success', 'Note Added Successfully');
        res.redirect('/notes/show');
    }
});

router.get('/notes/show', async (req,res) => {
    const notes = await Note.find().sort({date: 'desc'});
    res.render('notes/all-notes.hbs', {notes});
});

router.get('/notes/edit/:id', async (req,res) => {
    const note = await Note.findById(req.params.id);
    console.log(note);
    res.render('notes/edit-note', {note});
});

router.post('/notes/update/:id', async (req,res) => {
    const {title, description} = req.body;
    const errors = [];
    if(!title) {
        errors.push({text: 'Please write a title'});
    }
    if(!description) {
        errors.push({text: 'Please write a description'});
    }
    if(errors.length > 0){
        res.render('notes/edit-note', {
            errors,
            title,
            description
        });
    }
    else{
        await Note.findByIdAndUpdate(req.params.id, {title,description});
        req.flash('success', 'Note Updated Successfully');
        res.redirect('/notes/show');
    }
});

router.post('/notes/destroy/:id', async (req,res) => {
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success', 'Note Deleted Successfully');
    res.redirect('/notes/show');
});

module.exports = router;
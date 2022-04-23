// /api/dynamic/collection route control
const express = require('express');
const createSequence = require('./create_sequence_route');
const nextSequence = require('./next_sequence_route');


const router = express.Router();

// POST: /api/sequence
router.use('/', createSequence);
router.use('/v1/internal/next', nextSequence);


module.exports = router;

// /api/dynamic/collection route control
const express = require('express');
const addUpdtDynamCollec = require('./add_update_dynamic_collection_route');
// const getDynamicCollection = require('./get_dynamic_collection_route');
const validateDynamicDocument = require('./validate_dynamic_document_route');
// const getDynamicDocument = require('./get_dynamic_document_route');


const router = express.Router();

// This means , which will add a new dynamic collection
// POST: /api/dynamic/collection - Add new dynamic collection
// POST: /api/dynamic/collection/field - Add new field to an exisiting dynamic collection
// PUT: /api/dynamic/collection/field - Add new dynamic collection
router.use('/v1/internal/schema', addUpdtDynamCollec);

// GET
// router.use('/v1/internal/collection', getDynamicCollection);

// POST
router.use('/v1/internal/document/validate', validateDynamicDocument);

// GET
// router.use('/document', getDynamicDocument);
module.exports = router;

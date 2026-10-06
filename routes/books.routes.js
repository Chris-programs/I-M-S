const express = require('express');
const BookModel = require('../models/book.model');
const {
  createBookValidation,
  updateBookValidation,
  idValidation,
  handleValidationErrors,
} = require('../validators/book.validator');

const router = express.Router();

/**
 * CRUD operation
 */
// create a new book
router.post(
  '/',
  createBookValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const newBook = await BookModel.create(req.body);
      res.status(201).json(newBook);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
);

// read all books
router.get('/', async (req, res) => {
  try {
    const bookList = await BookModel.find({});
    res.status(200).send(bookList);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// read a selected book by id
router.get('/:id', idValidation, handleValidationErrors, async (req, res) => {
  try {
    const { id } = req.params;
    const book = await BookModel.findById(id);

    if (!book) {
      return res.status(404).json({ message: req.t('bookNotFound') });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete a book by id
router.delete(
  '/:id',
  idValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const deletedBook = await BookModel.findByIdAndDelete(id);

      if (!deletedBook) {
        return res.status(404).json({ message: req.t('bookNotFound') });
      }

      res.status(200).json({ message: req.t('bookDeletedSuccessfully') });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
);

// Update a selected book by id, req.body, and {returnDocument: 'after'}
router.put(
  '/:id',
  idValidation,
  updateBookValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updatedBook = await BookModel.findByIdAndUpdate(id, req.body, {
        returnDocument: 'after',
        runValidators: true,
      });

      if (!updatedBook) {
        return res.status(404).json({ message: req.t('bookNotFound') });
      }
      res
        .status(200)
        .json({ message: req.t('bookUpdatedSuccessfully'), updatedBook });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
);

module.exports = router;

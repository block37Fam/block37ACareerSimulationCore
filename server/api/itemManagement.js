const express = require('express');
const router = express.Router();
const { 
    createItem, 
    getAllItems, 
    getItemById 
    } = require('../db'); 


router.post('/', async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'Missing name or description' });
    }

    const newItem = await createItem(name, description);
    res.status(201).send(newItem);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const items = await getAllItems();
    res.status(200).send(items);
  } catch (err) {
    next(err);
  }
});


router.get('/:itemId', async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await getItemById(itemId);

    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).send(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

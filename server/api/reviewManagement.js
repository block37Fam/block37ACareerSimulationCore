const express = require('express');
const router = express.Router();

const {
    getAuthenticatedUser,
    getReviewsByItemId,
    getReviewById,
    createReview,
    editReview,
    deleteReview
} = require('../db');

// API routes

//GET /api/items/:itemId/reviews postman request verified!
router.get('/items/:itemId/reviews', async(req, res, next) => {
    try {
        const itemId = req.params.itemId
        const response = await getReviewsByItemId(itemId)
        res.status(200).send(response)
    } catch (error) {
        next(error)
    }
})

//GET /api/items/:itemId/reviews/:reviewId postman requst verified!
router.get('/items/:itemId/reviews/:reviewId', async(req, res, next) => {
    try {
        const review_id = req.params.reviewId
        const item_id = req.params.itemId
        const response = await getReviewById({
            review_id: review_id,
            item_id: item_id
        })
        res.status(200).send(response)
    } catch (error) {
        next(error)
    }
})

//POST /api/items/:itemId/reviews 🔒 postman requst verified!
router.post('/items/:itemId/reviews', async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization; // Bearer <token>
        if (!authHeader) {
          return res.status(401).send({ error: 'Token required' });
        }
        const token = authHeader.replace('Bearer ', '');
        const user = await getAuthenticatedUser(token);
        const user_id = user.id
        const item_id = req.params.itemId
        const rating = req.body.rating
        const review_text = req.body.review_text
        const response = await createReview({
            user_id: user_id,
            item_id: item_id,
            rating: rating,
            review_text: review_text
        })
        res.status(200).send(response)
    } catch (error) {
        next(error)
    }
}) 

//PUT /api/users/:userId/reviews/:reviewId 🔒 postman request verified!
router.put('/users/:userId/reviews/:reviewId', async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization; // Bearer <token>
        if (!authHeader) {
          return res.status(401).send({ error: 'Token required' });
        }
        const token = authHeader.replace('Bearer ', '');
        const user = await getAuthenticatedUser(token);
        const user_id = user.id
        const id = req.params.reviewId
        const rating = req.body.rating
        const review_text = req.body.review_text
        if(req.params.userId === user_id) {
            const response = await editReview({
                user_id: user_id,
                id: id,
                rating: rating,
                reviewText: review_text
            })
            return res.status(200).send(response)
        } else {
            return res.status(401).send({ error: 'No access to edit this review!' });
        }
    } catch (error) {
        next(error)
    }
})

//DELETE /api/users/:userId/reviews/:reviewId 🔒
router.delete('/users/:userId/reviews/:reviewId', async(req, res, next) => {
    try {
        const authHeader = req.headers.authorization; // Bearer <token>
        if (!authHeader) {
            return res.status(401).send({ error: 'Token required' });
        }
        const token = authHeader.replace('Bearer ', '');
        const user = await getAuthenticatedUser(token);
        const user_id = user.id
        const id = req.params.reviewId
        if(user_id === req.params.userId ){
            await deleteReview({user_id: req.params.userId, id:id})
            return res.status(204).send()
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router;
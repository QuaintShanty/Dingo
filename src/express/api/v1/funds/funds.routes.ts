import { handleApiError } from '../v1.utils';

import express from 'express';

import api from '../../api.main';
import { funds } from '../v1.main'; // API endpoint

export const router = express.Router();
api.use(funds, router);

// Create a new template entry.
router.get('/:username?', async (req, res) => {
  try {
    const { username } = req.params;

    if (username === undefined) {
      throw new Error(`No user provided.`);
    }

    const userExists = true; // TODO: Check if data for the user exists.
    if (!userExists) {
      throw new Error(`User doesn't exist.`);
    }

    res.json({ username });
  } catch (error) {
    handleApiError(res, error);
  }
});

export default {};

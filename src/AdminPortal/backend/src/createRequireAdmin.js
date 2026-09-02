export const createRequireAdmin = (auth0UserService) => async (req, res, next) => {
  try {
    const userId = req.auth?.sub;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const admin = await auth0UserService.isAdmin(userId);

    if (!admin) {
      return res.status(403).json({ error: 'Admin role required' });
    }

    next();
  } catch (error) {
    console.error('Failed to verify admin role:', error);
    res.status(502).json({ error: 'Failed to verify admin role' });
  }
};

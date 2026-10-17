import jwt  from "jsonwebtoken";



const protect  = (req, res, next) => {
	const authorization = req.headers.authorization;
    console.log(req);
	const token = authorization?.startsWith('Bearer ')
		? authorization.slice(7).trim()
		: null;

	if (!token) {
		return res.status(401).json({ message: 'Authentication required' });
	}

	if (!process.env.JWT_SECRET) {
		return res.status(500).json({ message: 'Authentication configuration error' });
	}

	try {
		req.user = jwt.verify(token, process.env.JWT_SECRET);
		return next();
	} catch (error) {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
};

export default protect;

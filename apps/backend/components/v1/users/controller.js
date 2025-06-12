const service = require('./service');
const { handleError } = require('./error');

exports.createUser = async (req, res) => {
  try {
    const user = await service.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await service.getUsers();
    res.json(users);
  } catch (err) {
    handleError(res, err);
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await service.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    handleError(res, err);
  }
}; 
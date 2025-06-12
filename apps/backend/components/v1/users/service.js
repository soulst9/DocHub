const { User } = require('../../../models');
const bcrypt = require('bcrypt');

exports.createUser = async (data) => {
  // 비밀번호 해싱 및 유니크 체크 등 보안 처리
  const hashed = await bcrypt.hash(data.password, 10);
  return User.create({
    username: data.username,
    password: hashed,
    email: data.email,
  });
};

exports.getUsers = async () => {
  return User.findAll({ attributes: { exclude: ['password'] } });
};

exports.getUserById = async (id) => {
  return User.findByPk(id, { attributes: { exclude: ['password'] } });
}; 
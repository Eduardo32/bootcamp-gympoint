module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postges',
  password: 'docker',
  database: 'gimpoint',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};

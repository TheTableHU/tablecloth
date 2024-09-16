module.exports = {
  dialect: 'mysql',
  migrationStorageTableName: 'sequelize_meta',
  migrationStorageTableSchema: 'public',
  define: {
    timestamps: false,
  },
  seederStorageTableName: 'sequelize_data',
  seederStorageTableSchema: 'public',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: process.env.DB_LOGGING === true ? console.log : false,
};

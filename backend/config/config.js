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
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  
  // Adding pool settings
  pool: {
    max: parseInt(process.env.SEQUELIZE_POOL_MAX, 10) || 10,    // Maximum connections in the pool
    min: parseInt(process.env.SEQUELIZE_POOL_MIN, 10) || 0,     // Minimum connections in the pool
    acquire: parseInt(process.env.SEQUELIZE_POOL_ACQUIRE, 10) || 60000,  // Max time to acquire a connection (in ms)
    idle: parseInt(process.env.SEQUELIZE_POOL_IDLE, 10) || 10000 // Max idle time (in ms) before a connection is released
  }
};

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:CV%21cFW8gU%2F46WgG@db.owilcpnhfkupvzvgpdxu.supabase.co:5432/postgres';

async function setupDatabase() {
  const client = new Client({ connectionString });
  
  try {
    console.log('🔌 Connecting to Supabase database...');
    await client.connect();
    console.log('✅ Connected!\n');
    
    console.log('📖 Reading schema file...');
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, 'supabase-schema.sql'),
      'utf8'
    );
    console.log(`✅ Read ${schemaSQL.length} characters\n`);
    
    console.log('⚙️  Executing schema (this may take a moment)...');
    await client.query(schemaSQL);
    console.log('✅ Database schema created successfully!\n');
    
    console.log('🎉 Database setup complete!');
    console.log('✨ Your tables, policies, triggers, and seed data are ready.');
    
  } catch (error) {
    console.error('❌ Error setting up database:');
    console.error(error.message);
    if (error.detail) console.error('Detail:', error.detail);
    if (error.hint) console.error('Hint:', error.hint);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();

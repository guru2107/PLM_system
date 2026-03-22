import psycopg2

conn = psycopg2.connect(
    host='127.0.0.1',
    port=5432,
    user='postgres',
    password='Mfgs@0625',
    database='plm_db'
)
cursor = conn.cursor()
cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
tables = cursor.fetchall()
print('Tables found:', [t[0] for t in tables])
conn.close()
